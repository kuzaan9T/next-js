import type { TaskItem, TaskStatus } from "./task-types";

export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
};

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Your session has expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
  return data as T;
}

export async function createTask(input: TaskInput) {
  const { task } = await request<{ task: TaskItem }>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return task;
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
  const { task } = await request<{ task: TaskItem }>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return task;
}

export async function deleteTask(id: string) {
  await request<{ success: boolean }>(`/api/tasks/${id}`, { method: "DELETE" });
}

export async function reorderTasks(updates: { id: string; status: TaskStatus; order: number }[]) {
  await request<{ updated: number }>("/api/tasks/reorder", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
