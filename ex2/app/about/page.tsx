export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build fast and simple web apps with Next.js.</p>
      <p>Built at: {new Date().toLocaleTimeString()}</p>
    </main>
  );
}
