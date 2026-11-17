import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { TASK_STATUSES } from "../lib/task-types";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    status: { type: String, enum: TASK_STATUSES, default: "todo", required: true },
    order: { type: Number, default: 0, required: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, order: 1 });

export type TaskDocument = InferSchemaType<typeof taskSchema>;

export const Task =
  (mongoose.models.Task as Model<TaskDocument> | undefined) ??
  mongoose.model<TaskDocument>("Task", taskSchema);
