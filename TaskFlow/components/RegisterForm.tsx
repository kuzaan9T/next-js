"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { Alert, Spinner, inputClass, primaryButton } from "./ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!EMAIL_PATTERN.test(fields.email.trim())) errors.email = "Enter a valid email address";
  if (fields.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (fields.confirmPassword !== fields.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export default function RegisterForm() {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors = validate(fields);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
      if (error) {
        setError(error.message ?? "Could not create your account");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputs: { key: keyof Fields; label: string; type: string; autoComplete: string }[] = [
    { key: "name", label: "Name", type: "text", autoComplete: "name" },
    { key: "email", label: "Email", type: "email", autoComplete: "email" },
    { key: "password", label: "Password", type: "password", autoComplete: "new-password" },
    { key: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Start organizing your work in minutes.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {inputs.map(({ key, label, type, autoComplete }) => (
          <div key={key} className="space-y-1">
            <label htmlFor={`register-${key}`} className="block text-sm font-medium text-slate-700">
              {label}
            </label>
            <input
              id={`register-${key}`}
              type={type}
              autoComplete={autoComplete}
              value={fields[key]}
              onChange={(e) => update(key, e.target.value)}
              className={`${inputClass} ${fieldErrors[key] ? "border-red-400" : ""}`}
              aria-invalid={Boolean(fieldErrors[key])}
              aria-describedby={fieldErrors[key] ? `register-${key}-error` : undefined}
              disabled={loading}
            />
            {fieldErrors[key] && (
              <p id={`register-${key}-error`} className="text-xs text-red-600">
                {fieldErrors[key]}
              </p>
            )}
          </div>
        ))}

        {error && <Alert kind="error">{error}</Alert>}

        <button type="submit" className={`${primaryButton} w-full`} disabled={loading}>
          {loading && <Spinner />}
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Log in
        </Link>
      </p>
    </div>
  );
}
