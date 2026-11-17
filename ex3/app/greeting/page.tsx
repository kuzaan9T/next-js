"use client";

import { useActionState } from "react";
import { submitName } from "../actions";

export default function GreetingPage() {
  const [state, formAction, pending] = useActionState(submitName, {});

  return (
    <main>
      <h1>Full Name Greeting</h1>
      <form action={formAction}>
        <input type="text" name="firstName" placeholder="First name" required />
        <input type="text" name="lastName" placeholder="Last name" required />
        <button type="submit" disabled={pending}>Submit</button>
      </form>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.message && <h2>{state.message}</h2>}
    </main>
  );
}
