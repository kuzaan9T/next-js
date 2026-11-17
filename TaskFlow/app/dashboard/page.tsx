import { redirect } from "next/navigation";
import Board from "../../components/Board";
import { getCurrentUser } from "../../lib/session";
import { getTasksForUser } from "../../lib/tasks";

export const metadata = { title: "Dashboard · TaskFlow" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tasks = await getTasksForUser(user.id);

  return <Board initialTasks={tasks} />;
}
