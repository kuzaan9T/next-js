export const dynamic = "force-dynamic";

export default function TimePage() {
  return (
    <main>
      <h1>Current Time</h1>
      <p>{new Date().toLocaleTimeString()}</p>
    </main>
  );
}
