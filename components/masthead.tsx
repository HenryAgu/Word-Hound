import Link from "next/link";
import { longDate, romanYear } from "@/lib/dates";

const NAME = "Word Hoard";
const blackletter = "font-fraktur font-bold leading-[1.1] whitespace-nowrap";

/** Front-page masthead: dateline, boxed notices either side of the title. */
export function FrontMasthead({ now }: { now: Date }) {
  const date = longDate(now);
  const year = romanYear(now);

  return (
    <header>
      {/* Desktop dateline */}
      <div data-anim="rise" className="hidden items-center justify-between border-b border-ink pt-1 pb-2 font-sc text-[17px] tracking-[0.1em] text-ink-soft lg:flex">
        <span>Vol. I · Anno Domini {year}</span>
        <span>{date}</span>
        <span>Price: One Curiosity</span>
      </div>
      {/* Phone dateline */}
      <p data-anim="rise" className="border-b border-ink pb-1.5 text-center font-sc text-sm tracking-[0.1em] text-ink-soft lg:hidden">
        {date} · {year}
      </p>

      <div className="grid items-center gap-6 pt-2.5 pb-3 lg:grid-cols-[200px_minmax(0,1fr)_200px] lg:pt-5 lg:pb-4">
        <NoticeBox
          title="Weather of the Mind"
          text="Fair, with a fair chance of curiosity"
        />
        <div className="text-center">
          <h1 data-anim="title" className={`${blackletter} text-[46px] lg:text-[78px]`}>
            {NAME}
          </h1>
          <p data-anim="rise" className="mt-1 text-base text-ink-soft italic lg:text-xl">
            Being a Daily Gazette of Words, gathered from every Tongue and every Age
          </p>
        </div>
        <NoticeBox title="Publish’d Daily" text="at the ninth hour, wheresoever thou dwellest" />
      </div>
    </header>
  );
}

function NoticeBox({ title, text }: { title: string; text: string }) {
  return (
    <div data-anim="rise" className="hidden border border-ink px-3 py-2.5 text-center lg:block">
      <div className="font-sc text-[15px] tracking-[0.14em] text-accent">{title}</div>
      <div className="mt-1 text-lg leading-[1.3] italic">{text}</div>
    </div>
  );
}

/** Masthead for entry pages: title links home, with a back link and the entry's address. */
export function PageMasthead({ slug }: { slug: string }) {
  return (
    <header>
      <div
        data-anim="rise"
        className="hidden items-center justify-between border-b border-ink pt-1 pb-2 font-sc text-[17px] tracking-[0.1em] text-ink-soft lg:flex"
      >
        <span>Vol. I</span>
        <span>The Word of the Day, set down at length</span>
        <span>Price: One Curiosity</span>
      </div>

      <div className="border-b-4 border-double border-ink pt-2.5 pb-2 text-center lg:border-b-0 lg:pt-3.5 lg:pb-2.5">
        <Link
          href="/"
          data-anim="title"
          className={`lnk ${blackletter} text-[46px] text-ink no-underline lg:text-[62px]`}
        >
          {NAME}
        </Link>
      </div>

      <nav
        data-anim="rise"
        aria-label="Entry"
        className="flex flex-col items-start gap-0.5 border-b border-ink pt-1 pb-2.5 lg:mt-0.5 lg:flex-row lg:items-center lg:justify-between lg:border-t-4 lg:border-double lg:py-2"
      >
        <Link
          href="/"
          className="lnk inline-flex min-h-11 items-center font-sc text-[17px] tracking-[0.08em] text-accent hover:text-[#5c1a10] lg:text-lg"
        >
          ‹ Back to the Front Page
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden font-sc text-[15px] tracking-[0.14em] text-ink-soft lg:inline">
            Address
          </span>
          <span className="border border-ink px-2.5 py-[3px] font-pica text-base lg:px-3.5 lg:py-1 lg:text-lg">
            /word/{slug}
          </span>
        </div>
      </nav>
    </header>
  );
}
