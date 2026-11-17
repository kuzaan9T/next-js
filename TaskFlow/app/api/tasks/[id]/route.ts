import { connectDB } from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/session";
import { isValidTaskId, jsonError, nextOrder, readJson, toTaskItem } from "../../../../lib/tasks";
import { firstError, updateTaskSchema } from "../../../../lib/validation";
import { Task } from "../../../../models/Task";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!isValidTaskId(id)) return jsonError("Task not found", 404);

  await connectDB();
  const task = await Task.findOne({ _id: id, userId: user.id });
  if (!task) return jsonError("Task not found", 404);

  return Response.json({ task: toTaskItem(task) });
}

export async function PUT(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!isValidTaskId(id)) return jsonError("Task not found", 404);

  const parsed = updateTaskSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError(firstError(parsed.error), 400);

  await connectDB();
  const task = await Task.findOne({ _id: id, userId: user.id });
  if (!task) return jsonError("Task not found", 404);

  const { title, description, status } = parsed.data;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined && status !== task.status) {
    task.order = await nextOrder(user.id, status);
    task.status = status;
  }

  await task.save();
  return Response.json({ task: toTaskItem(task) });
}

export async function DELETE(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!isValidTaskId(id)) return jsonError("Task not found", 404);

  await connectDB();
  const result = await Task.deleteOne({ _id: id, userId: user.id });
  if (result.deletedCount === 0) return jsonError("Task not found", 404);

  return Response.json({ success: true });
}
