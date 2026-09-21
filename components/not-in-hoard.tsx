import Link from "next/link";

/** Shown when a requested entry isn't in the hoard (unknown address, or a missing dictionary word). */
export function NotInHoard() {
  return (
    <main className="flex grow flex-col items-center justify-center gap-5 py-16 text-center">
      <p className="stamp px-4 pt-1.5 pb-1 text-xl">Not in the Hoard</p>
      <h1 className="text-4xl italic lg:text-5xl">No such entry hath been printed.</h1>
      <p className="max-w-md text-xl text-ink-soft">
        The word thou seekest is not among our pages, or it hath wandered off into another tongue.
      </p>
      <Link href="/" className="btn btn-accent lnk px-7 text-[19px]">
        Return to the Front Page
      </Link>
    </main>
  );
}
