"use client";

import { useState, useTransition } from "react";
import {
  bulkDeleteAction,
  deleteTodoAction,
  setAllCompletedAction,
  toggleTodoAction,
  updatePriorityAction,
} from "../app/actions";
import { isPriority, type Priority, type Todo } from "../lib/types";
import RelativeTime from "./RelativeTime";

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "#dc2626",
  medium: "#d97706",
  low: "#16a34a",
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const selectedIds = todos.filter((todo) => selected.has(todo.id)).map((todo) => todo.id);
  const allSelected = todos.length > 0 && selectedIds.length === todos.length;

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected(allSelected ? new Set() : new Set(todos.map((todo) => todo.id)));
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected todo(s)?`)) return;

    run(async () => {
      await bulkDeleteAction(selectedIds);
      setSelected(new Set());
    });
  }

  if (todos.length === 0) {
    return <p>No todos found.</p>;
  }

  return (
    <section style={{ opacity: pending ? 0.6 : 1 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", margin: "16px 0" }}>
        <label>
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /> Select all
        </label>
        <button onClick={handleBulkDelete} disabled={pending || selectedIds.length === 0}>
          Delete selected ({selectedIds.length})
        </button>
        <button onClick={() => run(() => setAllCompletedAction(true))} disabled={pending}>
          Mark all complete
        </button>
        <button onClick={() => run(() => setAllCompletedAction(false))} disabled={pending}>
          Mark all incomplete
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <input
              type="checkbox"
              aria-label={`Select ${todo.title}`}
              checked={selected.has(todo.id)}
              onChange={() => toggleSelect(todo.id)}
            />
            <span
              style={{
                flex: 1,
                minWidth: 160,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "inherit",
              }}
            >
              {todo.title}
            </span>
            <select
              aria-label="Priority"
              value={todo.priority}
              disabled={pending}
              style={{ color: PRIORITY_COLORS[todo.priority] }}
              onChange={(e) => {
                const value = e.target.value;
                if (isPriority(value)) {
                  run(() => updatePriorityAction(todo.id, value));
                }
              }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <small style={{ color: "#666" }}>
              created <RelativeTime date={todo.createdAt} />
              {todo.updatedAt !== todo.createdAt && (
                <>
                  {" · "}updated <RelativeTime date={todo.updatedAt} />
                </>
              )}
            </small>
            <button onClick={() => run(() => toggleTodoAction(todo.id, !todo.completed))} disabled={pending}>
              {todo.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => run(() => deleteTodoAction(todo.id))} disabled={pending}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
