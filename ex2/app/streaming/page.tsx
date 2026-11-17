import { Suspense } from "react";
import SlowComponent from "../../components/SlowComponent";

export const dynamic = "force-dynamic";

export default function StreamingPage() {
  return (
    <main>
      <h1>Streaming</h1>
      <Suspense fallback="Loading...">
        <SlowComponent />
      </Suspense>
    </main>
  );
}
