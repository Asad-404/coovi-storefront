export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="h-12 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-1/2 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="mb-6 h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

      <div className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="aspect-[3/4] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
