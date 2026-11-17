"use client";

import { primaryButton } from "../../components/ui";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-500">
        We couldn&apos;t load your board. Check your connection and try again.
      </p>
      <button type="button" onClick={reset} className={`${primaryButton} mt-6`}>
        Try again
      </button>
    </div>
  );
}
