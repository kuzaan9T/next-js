import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Form Exercises</h1>
      <ul>
        <li><Link href="/email">Basic Form</Link></li>
        <li><Link href="/password">Required Field</Link></li>
        <li><Link href="/greeting">Full Name Greeting</Link></li>
      </ul>
    </main>
  );
}
