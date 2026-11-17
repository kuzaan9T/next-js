"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import { createTask, deleteTask, reorderTasks, updateTask, type TaskInput } from "../lib/api-client";
import { TASK_STATUSES, isTaskStatus, type TaskItem, type TaskStatus } from "../lib/task-types";
import Column from "./Column";
import { TaskCard } from "./TaskCard";
import TaskModal from "./TaskModal";
import { Alert, primaryButton } from "./ui";

type Columns = Record<TaskStatus, TaskItem[]>;

type ModalState = { task?: TaskItem; status: TaskStatus } | null;

function groupTasks(tasks: TaskItem[]): Columns {
  const columns: Columns = { todo: [], in_progress: [], done: [] };
  for (const task of [...tasks].sort((a, b) => a.order - b.order)) {
    columns[task.status].push(task);
  }
  return columns;
}

function findContainer(columns: Columns, id: UniqueIdentifier): TaskStatus | null {
  if (isTaskStatus(id)) return id;
  return TASK_STATUSES.find((status) => columns[status].some((task) => task.id === id)) ?? null;
}

function normalize(columns: Columns): Columns {
  const result = { ...columns };
  for (const status of TASK_STATUSES) {
    result[status] = columns[status].map((task, index) => ({ ...task, status, order: index }));
  }
  return result;
}

function changedPositions(before: Columns, after: Columns) {
  const previous = new Map<string, { status: TaskStatus; order: number }>();
  for (const status of TASK_STATUSES) {
    for (const task of before[status]) previous.set(task.id, { status: task.status, order: task.order });
  }

  const updates: { id: string; status: TaskStatus; order: number }[] = [];
  for (const status of TASK_STATUSES) {
    for (const task of after[status]) {
      const old = previous.get(task.id);
      if (!old || old.status !== task.status || old.order !== task.order) {
        updates.push({ id: task.id, status: task.status, order: task.order });
      }
    }
  }
  return updates;
}

export default function Board({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [columns, setColumns] = useState<Columns>(() => groupTasks(initialTasks));
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const snapshot = useRef<Columns | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const total = TASK_STATUSES.reduce((sum, status) => sum + columns[status].length, 0);
  const done = columns.done.length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  function handleDragStart({ active }: DragStartEvent) {
    snapshot.current = columns;
    setError(null);
    const status = findContainer(columns, active.id);
    setActiveTask(status ? columns[status].find((task) => task.id === active.id) ?? null : null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    setColumns((prev) => {
      const from = findContainer(prev, active.id);
      const to = findContainer(prev, over.id);
      if (!from || !to || from === to) return prev;

      const item = prev[from].find((task) => task.id === active.id);
      if (!item) return prev;

      const overIndex = prev[to].findIndex((task) => task.id === over.id);
      const insertAt = overIndex >= 0 ? overIndex : prev[to].length;

      return {
        ...prev,
        [from]: prev[from].filter((task) => task.id !== active.id),
        [to]: [...prev[to].slice(0, insertAt), { ...item, status: to }, ...prev[to].slice(insertAt)],
      };
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    const before = snapshot.current;
    snapshot.current = null;
    if (!before) return;

    if (!over) {
      setColumns(before);
      return;
    }

    let next = columns;
    const container = findContainer(next, active.id);
    const overContainer = findContainer(next, over.id);

    if (container && container === overContainer) {
      const items = next[container];
      const oldIndex = items.findIndex((task) => task.id === active.id);
      const newIndex = items.findIndex((task) => task.id === over.id);
      if (newIndex >= 0 && oldIndex !== newIndex) {
        next = { ...next, [container]: arrayMove(items, oldIndex, newIndex) };
      }
    }

    const normalized = normalize(next);
    const updates = changedPositions(before, normalized);
    setColumns(normalized);

    if (updates.length > 0) {
      reorderTasks(updates).catch(() => {
        setColumns(before);
        setError("Couldn't save the new order. Your board has been restored.");
      });
    }
  }

  function handleDragCancel() {
    setActiveTask(null);
    if (snapshot.current) setColumns(snapshot.current);
    snapshot.current = null;
  }

  const closeModal = useCallback(() => setModal(null), []);

  async function handleSave(input: TaskInput) {
    if (modal?.task) {
      const original = modal.task;
      const updated = await updateTask(original.id, input);
      setColumns((prev) => {
        const next = { ...prev, [original.status]: prev[original.status].filter((task) => task.id !== original.id) };
        if (updated.status === original.status) {
          next[updated.status] = prev[original.status].map((task) => (task.id === updated.id ? updated : task));
        } else {
          next[updated.status] = [...prev[updated.status], updated];
        }
        return next;
      });
    } else {
      const created = await createTask(input);
      setColumns((prev) => ({ ...prev, [created.status]: [...prev[created.status], created] }));
    }
    setModal(null);
  }

  async function handleDelete(task: TaskItem) {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;

    setError(null);
    setDeletingId(task.id);
    try {
      await deleteTask(task.id);
      setColumns((prev) => ({ ...prev, [task.status]: prev[task.status].filter((item) => item.id !== task.id) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the task");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your board</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total === 0
              ? "No tasks yet. Create your first one to get started."
              : `${done} of ${total} tasks done · drag cards to change their status`}
          </p>
          {total > 0 && (
            <div className="mt-3 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <button type="button" className={primaryButton} onClick={() => setModal({ status: "todo" })}>
          + New task
        </button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      <DndContext
        id="taskflow-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={columns[status]}
              deletingId={deletingId}
              onAdd={(value) => setModal({ status: value })}
              onEdit={(task) => setModal({ task, status: task.status })}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} dragging /> : null}</DragOverlay>
      </DndContext>

      {modal && (
        <TaskModal task={modal.task} defaultStatus={modal.status} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}
