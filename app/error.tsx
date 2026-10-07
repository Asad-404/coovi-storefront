"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
      <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">
        ⚠
      </div>
      <h1 className="text-2xl text-zinc-900">
        This page could not load
      </h1>
      <p className="text-zinc-600">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "Check your connection and try again. If it keeps happening, message us on WhatsApp."}
      </p>
      <button
        onClick={reset}
        className="btn btn-primary"
      >
        Try again
      </button>
    </main>
  );
}
