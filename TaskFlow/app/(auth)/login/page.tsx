import { redirect } from "next/navigation";
import LoginForm from "../../../components/LoginForm";
import { getCurrentUser } from "../../../lib/session";

export const metadata = { title: "Log in · TaskFlow" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");

  const { error } = await searchParams;
  const initialError = error ? "That sign-in link is invalid or has expired. Please request a new one." : null;

  return <LoginForm initialError={initialError} />;
}
