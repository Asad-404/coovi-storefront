import Skeleton, { OrderSummarySkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-7 w-24" />
      </div>

      <div className="rounded-sm border border-zinc-200 p-4 sm:p-6">
        <Skeleton className="mx-auto h-7 w-2/3" />
        <div className="mt-6 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Skeleton circle className="h-8 w-8" />
              <Skeleton className="h-5 w-3/5" />
            </div>
          ))}
        </div>
      </div>

      <OrderSummarySkeleton />

      <div className="mt-2 flex justify-center">
        <Skeleton className="h-12 w-52" />
      </div>
    </main>
  );
}
