"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">
        ⚠
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        Something went wrong
      </h1>
      <p className="text-zinc-600">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "We encountered an unexpected error. Please try again."}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Try again
      </button>
    </main>
  );
}
