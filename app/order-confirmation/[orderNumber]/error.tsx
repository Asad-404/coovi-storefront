"use client";

import Link from "next/link";

interface OrderErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

// Reached when the order could not be loaded (a timeout, a network error or the API being down
// or busy). The order may well exist, so this must never read like "order not found".
export default function OrderConfirmationError({ retry }: OrderErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-3xl text-zinc-500"
      >
        ⚠
      </div>
      <h1 className="text-2xl text-zinc-900">
        We couldn&apos;t load your order right now
      </h1>
      <p className="text-zinc-600">
        This is usually brief. Check your connection and try again in a moment.
      </p>
      {/* retry() fetches the order again; reset() would only re-render the same failure */}
      <button
        type="button"
        onClick={() => retry()}
        className="btn btn-primary"
      >
        Try again
      </button>
      <Link
        href="/"
        className="btn btn-secondary"
      >
        Continue shopping
      </Link>
    </main>
  );
}
