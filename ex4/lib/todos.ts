import type { Filter, ObjectId } from "mongodb";
import { getTodosCollection } from "./mongodb";
import type { StatusFilter, Todo, TodoDocument } from "./types";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getTodos(search: string, status: StatusFilter): Promise<Todo[]> {
  const collection = await getTodosCollection();
  const filter: Filter<TodoDocument> = {};

  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: "i" };
  }
  if (status === "active") {
    filter.completed = false;
  }
  if (status === "completed") {
    filter.completed = true;
  }

  const docs = await collection
    .aggregate<TodoDocument & { _id: ObjectId }>([
      { $match: filter },
      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 0 },
                { case: { $eq: ["$priority", "medium"] }, then: 1 },
              ],
              default: 2,
            },
          },
        },
      },
      { $sort: { priorityOrder: 1, createdAt: -1 } },
      { $project: { priorityOrder: 0 } },
    ])
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    completed: doc.completed,
    priority: doc.priority,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }));
}
