import Link from "next/link";
import { Logo, primaryButton, secondaryButton } from "../components/ui";
import { getCurrentUser } from "../lib/session";

const features = [
  {
    title: "Drag-and-drop board",
    text: "Move tasks between To Do, In Progress and Done. Your order is saved automatically.",
  },
  {
    title: "Private by default",
    text: "Every task belongs to your account. Nobody else can see or change it.",
  },
  {
    title: "Sign in your way",
    text: "Use a password or get a one-time magic link sent to your inbox.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className={primaryButton}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              <Link href="/register" className={primaryButton}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-16 text-center sm:py-24">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Simple task management
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Keep your work moving with TaskFlow
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Capture tasks, track progress and drag them across your board until they are done.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={user ? "/dashboard" : "/register"} className={primaryButton}>
            {user ? "Open your board" : "Get started for free"}
          </Link>
          {!user && (
            <Link href="/login" className={secondaryButton}>
              I already have an account
            </Link>
          )}
        </div>

        <div className="mt-20 grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">TaskFlow</footer>
    </div>
  );
}
