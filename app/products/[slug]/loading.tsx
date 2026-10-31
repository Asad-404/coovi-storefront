import Skeleton, { ProductCardSkeleton, SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="w-full">
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-[1170px] px-4 pb-14">
          <div className="py-4">
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:gap-12">
            <div className="flex flex-col gap-3">
              <Skeleton className="aspect-3/4" />
              <div className="flex gap-2 pb-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-3/4 w-16 shrink-0 sm:w-20" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-11 w-3/4 sm:h-14" />
                <Skeleton className="h-7 w-1/2" />
              </div>

              <Skeleton className="h-7 w-1/3" />

              <div className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 py-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="contents">
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5 w-2/5" />
                  </div>
                ))}
              </div>

              <SkeletonText lines={3} />

              <div className="mt-2 flex items-stretch gap-3">
                <Skeleton className="h-13 w-28.5" />
                <Skeleton className="h-13 flex-1" />
              </div>

              <Skeleton className="h-12" />

              <div className="rounded-sm border border-frost bg-white p-4">
                <Skeleton className="h-5 w-2/3" />
                <SkeletonText lines={2} className="mt-2" />
              </div>

              <div className="mt-2 border-t border-zinc-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-zinc-200 py-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1170px] px-4">
        <div className="flex flex-col items-start gap-6 border-b border-zinc-200 py-3 sm:flex-row sm:justify-center sm:gap-8 sm:py-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-40" />
        </div>

        <SkeletonText lines={3} className="mx-auto max-w-4xl py-10" />

        <div className="pb-16 pt-6">
          <Skeleton className="mb-6 h-7 w-40" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7.5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={index === 2 ? "hidden md:block" : undefined}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
