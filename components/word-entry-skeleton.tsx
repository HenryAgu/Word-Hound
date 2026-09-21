import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for WordEntry while an Old English entry is fetched; mirrors its two-column layout. */
export function WordEntrySkeleton() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex grow flex-col gap-4 py-6 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0 lg:border-b lg:border-ink lg:py-0"
    >
      <span className="sr-only">Fetching this entry…</span>

      <div className="flex flex-col items-center gap-4 lg:items-start lg:border-r lg:border-ink lg:py-[30px] lg:pr-9">
        <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:gap-4">
          <Skeleton className="h-9 w-36 lg:h-11 lg:w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-24 w-3/4 lg:h-40" />
        <Skeleton className="h-5 w-28" />

        <div className="w-full border-y border-ink py-3">
          <Skeleton className="mx-auto h-9 w-2/3 lg:mx-0 lg:h-12" />
        </div>

        <div className="flex w-full flex-col gap-2.5 border-y-[3px] border-double border-ink py-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-11/12" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        <Skeleton className="h-12 w-full lg:h-14 lg:w-56" />
      </div>

      <div className="flex flex-col gap-4 lg:gap-[30px] lg:py-[30px] lg:pl-9">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </main>
  );
}
