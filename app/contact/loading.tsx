import Skeleton, { SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Skeleton className="h-10 w-56" />

      <div className="mt-8 space-y-8">
        <SkeletonText lines={2} />

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-sm border border-zinc-200 bg-white p-6">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="mt-2 h-6 w-3/5" />
              <Skeleton className="mt-4 h-12 w-48" />
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="mt-4 h-6 w-4/5" />
          <Skeleton className="mt-1 h-6 w-32" />
          <Skeleton className="mt-4 h-5 w-3/5" />
        </div>
      </div>
    </main>
  );
}
