"use client";

import { useActionState } from "react";
import { submitEmail } from "../actions";

export default function EmailPage() {
  const [state, formAction, pending] = useActionState(submitEmail, {});

  return (
    <main>
      <h1>Basic Form</h1>
      <form action={formAction}>
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit" disabled={pending}>Submit</button>
      </form>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.message && <p style={{ color: "green" }}>{state.message}</p>}
    </main>
  );
}
