"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700 dark:bg-red-900 dark:text-red-300">
        ⚠
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Something went wrong
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "We encountered an unexpected error. Please try again."}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-800"
      >
        Try again
      </button>
    </main>
  );
}
