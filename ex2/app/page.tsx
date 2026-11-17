import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Rendering Exercises</h1>
      <ul>
        <li><Link href="/products">Server Component - Products</Link></li>
        <li><Link href="/counter">Client Component - Counter</Link></li>
        <li><Link href="/time">SSR - Time</Link></li>
        <li><Link href="/about">Static - About Us</Link></li>
        <li><Link href="/streaming">Streaming</Link></li>
      </ul>
    </main>
  );
}
