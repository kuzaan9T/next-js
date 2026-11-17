import SearchForm from "../components/SearchForm";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { getTodos } from "../lib/todos";
import { isStatusFilter } from "../lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = isStatusFilter(params.status) ? params.status : "all";
  const todos = await getTodos(q, status);

  return (
    <main>
      <h1>Todos</h1>
      <TodoForm />
      <hr />
      <SearchForm q={q} status={status} />
      <TodoList todos={todos} />
    </main>
  );
}
