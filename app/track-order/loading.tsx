import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 sm:px-6">
      <div className="flex w-full flex-col items-center gap-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-6 w-72 max-w-full" />
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10.5" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10.5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-12" />
      </div>

      <Skeleton className="h-5 w-full" />
    </main>
  );
}
