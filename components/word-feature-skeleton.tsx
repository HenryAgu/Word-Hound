import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for WordFeature while the Old English hoard is fetched; sized to match to avoid a jump. */
export function WordFeatureSkeleton() {
  return (
    <div role="status" aria-live="polite" className="contents">
      <span className="sr-only">Fetching today’s word…</span>

      <div className="flex w-full items-center gap-3.5">
        <div aria-hidden className="grow border-t border-ink" />
        <Skeleton className="h-4 w-44" />
        <div aria-hidden className="grow border-t border-ink" />
      </div>

      <div className="mt-5 flex flex-col items-center gap-1.5 lg:mt-[22px] lg:flex-row lg:gap-3.5">
        <Skeleton className="h-9 w-36 lg:h-10 lg:w-44" />
        <Skeleton className="h-4 w-40" />
      </div>

      <Skeleton className="mt-4 h-24 w-3/4 lg:h-36" />
      <Skeleton className="mt-3 h-5 w-28" />

      <div className="mt-4 w-full border-y border-ink py-3 lg:mt-[18px]">
        <Skeleton className="mx-auto h-9 w-2/3 lg:h-12" />
      </div>

      <div className="mt-6 flex w-full flex-col gap-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-5 flex w-full flex-col items-center gap-2.5 border-y-[3px] border-double border-ink py-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      <Skeleton className="mt-[22px] h-12 w-full sm:w-64" />
    </div>
  );
}
