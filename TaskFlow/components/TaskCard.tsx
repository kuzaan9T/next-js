"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskItem } from "../lib/task-types";
import RelativeTime from "./RelativeTime";

type Actions = {
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  deleting?: boolean;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  deleting,
  dragging,
}: { task: TaskItem; dragging?: boolean } & Partial<Actions>) {
  return (
    <div
      className={`group rounded-xl border bg-white p-3 shadow-sm transition ${
        dragging ? "rotate-2 border-indigo-300 shadow-lg" : "border-slate-200 hover:border-slate-300"
      } ${deleting ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-medium break-words ${
            task.status === "done" ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {task.title}
        </h3>
        {onEdit && onDelete && (
          <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={() => onEdit(task)}
              className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={() => onDelete(task)}
              disabled={deleting}
              className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <p className="mt-1 line-clamp-3 text-xs whitespace-pre-line text-slate-500">{task.description}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-400">
        Updated <RelativeTime date={task.updatedAt} />
      </p>
    </div>
  );
}

export function SortableTaskCard({ task, ...actions }: { task: TaskItem } & Actions) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    attributes: { role: "listitem", roleDescription: "draggable task" },
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab touch-manipulation list-none active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} {...actions} />
    </li>
  );
}
