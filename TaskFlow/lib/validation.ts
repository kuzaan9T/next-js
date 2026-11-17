import { z } from "zod";
import { TASK_STATUSES } from "./task-types";

const title = z
  .string({ error: "Title is required" })
  .trim()
  .min(1, "Title is required")
  .max(120, "Title must be 120 characters or less");

const description = z.string().trim().max(2000, "Description must be 2000 characters or less");

const status = z.enum(TASK_STATUSES, { error: "Invalid status" });

export const createTaskSchema = z.object({
  title,
  description: description.default(""),
  status: status.default("todo"),
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    status: status.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Nothing to update",
  });

export const reorderSchema = z
  .array(
    z.object({
      id: z.string(),
      status,
      order: z.number().int().min(0),
    })
  )
  .min(1, "Nothing to reorder")
  .max(500, "Too many tasks");

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid request";
}
