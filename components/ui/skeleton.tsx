import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // shadcn's default is bg-accent; here accent is the masthead red, so a faint ink wash stands in.
      className={cn("animate-pulse rounded-md bg-ink/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
