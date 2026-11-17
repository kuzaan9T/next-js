import { connectDB } from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/session";
import { isValidTaskId, jsonError, readJson } from "../../../../lib/tasks";
import { firstError, reorderSchema } from "../../../../lib/validation";
import { Task } from "../../../../models/Task";

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const parsed = reorderSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError(firstError(parsed.error), 400);

  const updates = parsed.data.filter((item) => isValidTaskId(item.id));
  if (updates.length !== parsed.data.length) return jsonError("Invalid task id", 400);

  await connectDB();
  const result = await Task.bulkWrite(
    updates.map(({ id, status, order }) => ({
      updateOne: {
        filter: { _id: id, userId: user.id },
        update: { $set: { status, order } },
      },
    }))
  );

  return Response.json({ updated: result.matchedCount });
}
