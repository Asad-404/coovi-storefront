"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Recoverable error state for the product list. The listing is a Server Component that fetches on
// render, so the only way to re-fetch from the browser is to ask the router to refresh the current
// route, which re-renders the server component and runs getFirstProducts again. Keep this a separate
// Client Component: the parent must stay a Server Component so the list is server-rendered and cached.
export default function ProductListingError() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md border border-amber-300 bg-amber-50 p-6 text-center text-amber-800">
      <p className="font-medium">Could not load products.</p>
      <p className="mt-1 text-sm">Check your connection and try again.</p>
      <button
        type="button"
        onClick={handleRetry}
        disabled={retrying}
        className="btn btn-secondary mt-4"
      >
        {retrying ? "Loading…" : "Try again"}
      </button>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-3 text-sm">
          Is the backend running? Start it with{" "}
          <code className="bg-amber-100 px-1.5 py-0.5 font-mono text-xs">cd coovi-api && pnpm dev</code>
        </p>
      )}
    </div>
  );
}
