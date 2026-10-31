import { panelOverlap, panelShape, stripSlope } from "@/components/HomeHero";
import Skeleton, { ProductGridSkeleton } from "@/components/Skeleton";

// Lives in a route group because app/loading.tsx would also wrap every other route,
// and this skeleton would flash on the way to them.
export default function Loading() {
  return (
    <main className="w-full">
      <section className="px-2.5 pt-2.5">
        <div className="border border-haze-deep bg-haze">
          <div className="flex flex-col lg:min-h-[600px] lg:flex-row lg:items-stretch">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10 sm:px-12 lg:items-start lg:gap-5 lg:py-12 lg:pl-[11%] lg:pr-8">
              <Skeleton className="h-8 w-40" />
              <div className="flex w-full max-w-md flex-col items-center gap-2 lg:items-start">
                <Skeleton className="h-8 w-full sm:h-10 lg:h-12" />
                <Skeleton className="h-8 w-3/4 sm:h-10 lg:h-12" />
              </div>
              <div className="flex w-full max-w-md flex-col items-center gap-2 lg:items-start">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <Skeleton className="mt-2 h-13 w-full sm:w-52" />
            </div>

            <div className={`flex h-[210px] w-full overflow-hidden sm:h-[320px] lg:mr-[8%] lg:h-auto lg:w-[46%] ${stripSlope}`}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-full min-w-0 flex-1 bg-white"
                  style={{ clipPath: panelShape, marginLeft: index > 0 ? panelOverlap : undefined }}
                >
                  <div className="absolute inset-x-[3px] inset-y-0" style={{ clipPath: panelShape }}>
                    <Skeleton className="h-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-280 px-2 py-10">
        <div className="grid items-center gap-6 md:grid-cols-[510px_1fr]">
          <Skeleton className="h-52.5" />
          <div className="flex flex-col items-start gap-3">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-280 px-2">
        <div className="rounded-sm border border-frost bg-mist px-2 py-4 sm:px-4">
          <div className="mb-8 flex flex-col items-center gap-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col rounded-sm border border-frost bg-white p-2.5">
                <Skeleton className="aspect-3/4" />
                <Skeleton className="mt-3 h-4 w-1/2" />
                <Skeleton className="mt-1 h-5 w-full" />
                <Skeleton className="mt-2 h-6 w-1/2" />
                <Skeleton className="mt-3 h-8.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-280 px-2 py-10">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-9 w-40" />
        </div>
        <ProductGridSkeleton />
      </section>
    </main>
  );
}
