export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-1 gap-8 py-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] animate-pulse rounded-sm bg-zinc-200" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse rounded-sm bg-zinc-200"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 animate-pulse rounded-sm bg-zinc-200" />
          <div className="h-10 w-3/4 animate-pulse rounded-sm bg-zinc-200" />
          <div className="h-8 w-1/3 animate-pulse rounded-sm bg-zinc-200" />
          <div className="h-4 w-1/4 animate-pulse rounded-sm bg-zinc-200" />
          <div className="h-24 w-full animate-pulse rounded-sm bg-zinc-200" />
          <div className="h-12 w-48 animate-pulse rounded-full bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
