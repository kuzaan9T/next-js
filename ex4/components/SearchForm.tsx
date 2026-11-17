import Link from "next/link";
import { searchTodosAction } from "../app/actions";
import type { StatusFilter } from "../lib/types";

export default function SearchForm({ q, status }: { q: string; status: StatusFilter }) {
  return (
    <form
      key={`${q}-${status}`}
      action={searchTodosAction}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
    >
      <input type="search" name="q" placeholder="Search todos..." defaultValue={q} />
      <select name="status" defaultValue={status}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Search</button>
      {(q || status !== "all") && <Link href="/">Clear</Link>}
    </form>
  );
}
