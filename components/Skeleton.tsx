// Building blocks for the loading.tsx files. Each one copies the spacing of the real
// component it stands in for, so the page does not jump when the content arrives.
export default function Skeleton({ className = "", circle = false }: { className?: string; circle?: boolean }) {
  return <div className={`animate-pulse bg-frost ${circle ? "rounded-full" : "rounded-sm"} ${className}`} />;
}

export function SkeletonText({ lines, className = "" }: { lines: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={`h-4 ${index === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-3/4" />
      <div className="flex flex-col items-center gap-1 px-1 pt-3">
        <Skeleton className="h-7 w-3/4 sm:h-8" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      {/* ProductCard only reveals this button on hover where there is a mouse, but keeps its space */}
      <Skeleton className="mt-3 h-10.5 md:pointer-fine:invisible" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7.5 md:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageHeadingSkeleton({ description = false }: { description?: boolean }) {
  return (
    <div className="mx-auto max-w-[1170px] px-4 pb-6 pt-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-10 w-48 sm:h-12 sm:w-64" />
      {description && (
        <div className="mt-8 bg-mist px-5 py-6 sm:px-8">
          <Skeleton className="my-1 h-5 w-full" />
          {/* The description fits on one line once the screen is wide enough */}
          <Skeleton className="my-1 h-5 w-2/3 sm:hidden" />
        </div>
      )}
    </div>
  );
}

// The sort control, result count and grid shared by /saree and /sale
export function ProductListingSkeleton() {
  return (
    <main className="w-full pb-16">
      <PageHeadingSkeleton description />
      <div className="mx-auto max-w-[1170px] px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>
        <ProductGridSkeleton />
      </div>
    </main>
  );
}

export function PolicyPageSkeleton() {
  return (
    <main className="w-full pb-16">
      <PageHeadingSkeleton />
      <div className="mx-auto max-w-3xl px-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="mt-3 h-5 w-48" />

        <div className="mt-8 space-y-8">
          {[5, 4, 3].map((lines) => (
            <div key={lines}>
              <Skeleton className="h-7 w-56" />
              <SkeletonText lines={lines} className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="rounded-sm border border-zinc-200">
      <div className="flex flex-col divide-y divide-zinc-200">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            <Skeleton className="h-16 w-12 shrink-0" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 p-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>

      <div className="border-t border-zinc-200 p-4">
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}
