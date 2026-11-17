"use client";

import { useActionState } from "react";
import { createTodoAction } from "../app/actions";

export default function TodoForm() {
  const [state, formAction, pending] = useActionState(createTodoAction, null);

  return (
    <form action={formAction} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <input type="text" name="title" placeholder="What needs to be done?" required maxLength={200} />
      <select name="priority" defaultValue="medium">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add Todo"}
      </button>
      {state?.error && <p style={{ color: "crimson", width: "100%", margin: 0 }}>{state.error}</p>}
      {state?.success && <p style={{ color: "green", width: "100%", margin: 0 }}>{state.success}</p>}
    </form>
  );
}
