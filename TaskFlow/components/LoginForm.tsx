"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { Alert, Spinner, inputClass, primaryButton } from "./ui";

type Mode = "password" | "magic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (mode === "password" && !password) {
      setError("Enter your password");
      return;
    }

    setLoading(true);
    try {
      if (mode === "password") {
        const { error } = await authClient.signIn.email({ email: trimmedEmail, password });
        if (error) {
          setError(error.message ?? "Invalid email or password");
          return;
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await authClient.signIn.magicLink({
          email: trimmedEmail,
          callbackURL: "/dashboard",
          errorCallbackURL: "/login?error=magic-link",
        });
        if (error) {
          setError(error.message ?? "Could not send the sign-in link");
          return;
        }
        setMessage(`We sent a sign-in link to ${trimmedEmail}. It expires in 5 minutes.`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to manage your tasks.</p>
      </div>

      <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
        {(["password", "magic"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => switchMode(option)}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option === "password" ? "Password" : "Magic link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            disabled={loading}
          />
        </label>

        {mode === "password" && (
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </label>
        )}

        {error && <Alert kind="error">{error}</Alert>}
        {message && <Alert kind="success">{message}</Alert>}

        <button type="submit" className={`${primaryButton} w-full`} disabled={loading}>
          {loading && <Spinner />}
          {mode === "password" ? "Log in" : "Email me a link"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Create one
        </Link>
      </p>
    </div>
  );
}
