import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Routing Exercises</h1>
      <ul>
        <li><Link href="/notifications">/notifications</Link></li>
        <li><Link href="/users/john">/users/john</Link></li>
        <li><Link href="/blog">/blog</Link></li>
        <li><Link href="/blog/2024/nextjs/routing">/blog/2024/nextjs/routing</Link></li>
        <li><Link href="/api/users/john">/api/users/john</Link></li>
      </ul>
    </main>
  );
}
