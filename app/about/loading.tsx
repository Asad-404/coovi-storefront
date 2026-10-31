import Skeleton, { SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Skeleton className="h-10 w-56" />

      <div className="mt-8 space-y-6">
        <SkeletonText lines={2} />
        <SkeletonText lines={4} />
        <Skeleton className="mt-12 h-8 w-44" />
        <SkeletonText lines={5} />
        <Skeleton className="mt-12 h-8 w-44" />
        <SkeletonText lines={4} />
      </div>
    </main>
  );
}
