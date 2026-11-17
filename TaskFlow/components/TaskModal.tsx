"use client";

import { useEffect, useState } from "react";
import type { TaskInput } from "../lib/api-client";
import { STATUS_LABELS, TASK_STATUSES, type TaskItem, type TaskStatus } from "../lib/task-types";
import { createTaskSchema, firstError } from "../lib/validation";
import { Alert, Spinner, inputClass, primaryButton, secondaryButton } from "./ui";

type TaskModalProps = {
  task?: TaskItem;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSave: (input: TaskInput) => Promise<void>;
};

export default function TaskModal({ task, defaultStatus, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, saving]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = createTaskSchema.safeParse({ title, description, status });
    if (!parsed.success) {
      setError(firstError(parsed.error));
      return;
    }

    setSaving(true);
    try {
      await onSave(parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="task-modal-title" className="text-lg font-semibold">
          {task ? "Edit task" : "New task"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className={inputClass}
              placeholder="What needs to be done?"
              disabled={saving}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Add more details (optional)"
              disabled={saving}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={inputClass}
              disabled={saving}
            >
              {TASK_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </label>

          {error && <Alert kind="error">{error}</Alert>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={secondaryButton} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className={primaryButton} disabled={saving}>
              {saving && <Spinner />}
              {task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
