"use client";

import { useActionState } from "react";
import { submitPassword } from "../actions";

export default function PasswordPage() {
  const [state, formAction, pending] = useActionState(submitPassword, {});

  return (
    <main>
      <h1>Required Field</h1>
      <form action={formAction}>
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={pending}>Submit</button>
      </form>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.message && <p style={{ color: "green" }}>{state.message}</p>}
    </main>
  );
}
