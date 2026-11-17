import type { ObjectId } from "mongodb";

export type Priority = "low" | "medium" | "high";

export const PRIORITIES: Priority[] = ["high", "medium", "low"];

export type StatusFilter = "all" | "active" | "completed";

export const STATUS_FILTERS: StatusFilter[] = ["all", "active", "completed"];

export type TodoDocument = {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
};

export type FormState = {
  error?: string;
  success?: string;
} | null;

export function isPriority(value: unknown): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

export function isStatusFilter(value: unknown): value is StatusFilter {
  return STATUS_FILTERS.includes(value as StatusFilter);
}
