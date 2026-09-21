export function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-1 border-t border-ink pt-4 text-center text-[15px] text-ink-soft italic lg:mt-0 lg:flex-row lg:justify-between lg:gap-4 lg:border-t-0 lg:pt-3 lg:text-base">
      <span className="hidden lg:inline">Printed daily at the Press of Word Hoard</span>
      <span aria-hidden className="text-lg text-accent not-italic lg:text-xl">
        ⁂
      </span>
      <span>
        Delivered <span className="hidden lg:inline">by post-rider </span>at the ninth hour, thy time,
        not ours
      </span>
    </footer>
  );
}
