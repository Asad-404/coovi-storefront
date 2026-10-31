import Skeleton, { SkeletonText } from "@/components/Skeleton";

function Field({ inputClass = "h-10.5" }: { inputClass?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-5 w-28" />
      <Skeleton className={inputClass} />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="py-8">
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="mb-2 h-7 w-40" />
            <Field />
            <div className="flex flex-col gap-1">
              <Field />
              <Skeleton className="h-5 w-3/5" />
            </div>
            <Field />
            <Field inputClass="h-22.5" />
            <Field inputClass="h-16.5" />
          </div>

          <Skeleton className="mt-6 h-12 w-full sm:w-52" />
          <SkeletonText lines={2} className="mt-4" />
        </div>

        <div className="h-fit rounded-sm border border-zinc-200 p-6">
          <Skeleton className="h-7 w-36" />

          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-2">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-5 w-14" />
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-200 pt-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="mt-2 flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
