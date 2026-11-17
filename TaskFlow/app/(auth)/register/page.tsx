import { redirect } from "next/navigation";
import RegisterForm from "../../../components/RegisterForm";
import { getCurrentUser } from "../../../lib/session";

export const metadata = { title: "Create account · TaskFlow" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return <RegisterForm />;
}
