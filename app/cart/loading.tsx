import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="py-8">
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col divide-y divide-zinc-200 lg:col-span-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex gap-4 py-4">
              <Skeleton className="h-24 w-20 shrink-0" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="mt-1 h-4 w-20" />
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-sm border border-zinc-200 p-6">
          <Skeleton className="h-7 w-24" />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="mt-2 flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="mt-6 h-12" />
          <Skeleton className="mx-auto mt-4 h-5 w-20" />
        </div>
      </div>
    </main>
  );
}
