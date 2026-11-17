import { connectDB } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";
import { getTasksForUser, jsonError, nextOrder, readJson, toTaskItem } from "../../../lib/tasks";
import { createTaskSchema, firstError } from "../../../lib/validation";
import { Task } from "../../../models/Task";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const tasks = await getTasksForUser(user.id);
  return Response.json({ tasks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const parsed = createTaskSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError(firstError(parsed.error), 400);

  await connectDB();
  const order = await nextOrder(user.id, parsed.data.status);
  const task = await Task.create({ ...parsed.data, order, userId: user.id });

  return Response.json({ task: toTaskItem(task) }, { status: 201 });
}
