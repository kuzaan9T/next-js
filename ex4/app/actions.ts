"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTodosCollection } from "../lib/mongodb";
import { isPriority, isStatusFilter, type FormState, type Priority } from "../lib/types";

function toObjectIds(ids: string[]) {
  return ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
}

export async function createTodoAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");

  if (!title) {
    return { error: "Title is required" };
  }
  if (title.length > 200) {
    return { error: "Title must be 200 characters or less" };
  }
  if (!isPriority(priority)) {
    return { error: "Please choose a valid priority" };
  }

  const now = new Date();
  const collection = await getTodosCollection();
  await collection.insertOne({
    title,
    priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/");
  return { success: `Added "${title}"` };
}

export async function toggleTodoAction(id: string, completed: boolean) {
  const [objectId] = toObjectIds([id]);
  if (!objectId) return;

  const collection = await getTodosCollection();
  await collection.updateOne({ _id: objectId }, { $set: { completed, updatedAt: new Date() } });
  revalidatePath("/");
}

export async function updatePriorityAction(id: string, priority: Priority) {
  const [objectId] = toObjectIds([id]);
  if (!objectId || !isPriority(priority)) return;

  const collection = await getTodosCollection();
  await collection.updateOne({ _id: objectId }, { $set: { priority, updatedAt: new Date() } });
  revalidatePath("/");
}

export async function deleteTodoAction(id: string) {
  const [objectId] = toObjectIds([id]);
  if (!objectId) return;

  const collection = await getTodosCollection();
  await collection.deleteOne({ _id: objectId });
  revalidatePath("/");
}

export async function bulkDeleteAction(ids: string[]) {
  const objectIds = toObjectIds(ids);
  if (objectIds.length === 0) return;

  const collection = await getTodosCollection();
  await collection.deleteMany({ _id: { $in: objectIds } });
  revalidatePath("/");
}

export async function setAllCompletedAction(completed: boolean) {
  const collection = await getTodosCollection();
  await collection.updateMany(
    { completed: !completed },
    { $set: { completed, updatedAt: new Date() } }
  );
  revalidatePath("/");
}

export async function searchTodosAction(formData: FormData) {
  const q = String(formData.get("q") ?? "").trim();
  const status = String(formData.get("status") ?? "all");
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (isStatusFilter(status) && status !== "all") params.set("status", status);

  const query = params.toString();
  redirect(query ? `/?${query}` : "/");
}
