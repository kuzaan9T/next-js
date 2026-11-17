import { isValidObjectId, type Types } from "mongoose";
import { connectDB } from "./db";
import type { TaskItem, TaskStatus } from "./task-types";
import { Task } from "../models/Task";

type TaskLike = {
  _id: Types.ObjectId;
  title: string;
  description?: string | null;
  status: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export function toTaskItem(task: TaskLike): TaskItem {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: task.status as TaskStatus,
    order: task.order,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function isValidTaskId(id: string) {
  return isValidObjectId(id) && /^[0-9a-f]{24}$/i.test(id);
}

export async function getTasksForUser(userId: string) {
  await connectDB();
  const tasks = await Task.find({ userId }).sort({ order: 1, createdAt: 1 }).lean<TaskLike[]>();
  return tasks.map(toTaskItem);
}

export async function nextOrder(userId: string, status: TaskStatus) {
  const last = await Task.findOne({ userId, status }).sort({ order: -1 }).select("order").lean<{ order: number }>();
  return last ? last.order + 1 : 0;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
