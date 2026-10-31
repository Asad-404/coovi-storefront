import Skeleton, { OrderSummarySkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 py-12">
        <Skeleton circle className="h-16 w-16" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-6 w-80 max-w-full" />
        <Skeleton className="h-7 w-24" />
      </div>

      <OrderSummarySkeleton />

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    </main>
  );
}
