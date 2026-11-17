"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { STATUS_LABELS, type TaskItem, type TaskStatus } from "../lib/task-types";
import { SortableTaskCard } from "./TaskCard";

const ACCENTS: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-amber-400",
  done: "bg-emerald-500",
};

type ColumnProps = {
  status: TaskStatus;
  tasks: TaskItem[];
  deletingId: string | null;
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
};

export default function Column({ status, tasks, deletingId, onAdd, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      className={`flex min-h-[200px] flex-col rounded-2xl border p-3 transition ${
        isOver ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 bg-slate-100/70"
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${ACCENTS[status]}`} />
          <h2 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h2>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{tasks.length}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          className="rounded-md px-2 py-1 text-lg leading-none text-slate-500 hover:bg-white hover:text-slate-800"
          aria-label={`Add task to ${STATUS_LABELS[status]}`}
        >
          +
        </button>
      </header>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="flex flex-1 flex-col gap-2">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === task.id}
            />
          ))}
          {tasks.length === 0 && (
            <li className="grid flex-1 list-none place-items-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
              Drop tasks here
            </li>
          )}
        </ul>
      </SortableContext>
    </section>
  );
}
