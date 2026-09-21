import Link from "next/link";
import { connection } from "next/server";
import { FrontMasthead } from "@/components/masthead";
import { ExampleQuote, Fleuron, SectionHeading, WordDisplay } from "@/components/ornaments";
import { SubscribeNotice } from "@/components/subscribe-notice";
import { wordOfTheDayIndex } from "@/lib/dates";
import { words } from "@/lib/words";

export default async function Home() {
  // The word changes daily, so render per request rather than at build time.
  await connection();
  const now = new Date();
  const today = words[wordOfTheDayIndex(now, words.length)];
  const archive = words.filter((w) => w.slug !== today.slug);

  return (
    <>
      <FrontMasthead now={now} />

      <main className="mt-0.5 grid grow border-t-4 border-double border-ink lg:grid-cols-[250px_minmax(0,1fr)_250px] lg:border-b lg:border-b-ink">
        {/* Notices: subscribe card and the rotation of tongues */}
        <aside className="order-2 flex flex-col gap-5 border-t border-ink pt-6 lg:order-none lg:gap-[22px] lg:border-t-0 lg:border-r lg:pr-[26px]">
          <SectionHeading>Notices to the Reader</SectionHeading>
          <SubscribeNotice />

          <section aria-labelledby="tongues-title">
            <h2
              id="tongues-title"
              data-anim="rise"
              className="border-b border-ink pb-2 text-center font-sc text-[17px] tracking-[0.12em] text-accent"
            >
              Tongues in Rotation
            </h2>
            <ul>
              {words.map((w) => (
                <li
                  key={w.slug}
                  data-anim="rise"
                  className="flex justify-between gap-3 border-b border-dotted border-ink-soft py-[9px] text-lg last:border-b-0"
                >
                  <span>{w.lang}</span>
                  <span className="text-ink-soft italic">{w.langSpan}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* The word of the day */}
        <article className="order-1 flex flex-col items-center px-0 pt-6 pb-7 text-center lg:order-none lg:px-8">
          <div className="flex w-full items-center gap-3.5">
            <div aria-hidden data-anim="rule" className="grow origin-right border-t border-ink" />
            <h2
              data-anim="rise"
              className="font-sc text-base tracking-[0.22em] text-accent lg:text-lg"
            >
              The Word of the Day
            </h2>
            <div aria-hidden data-anim="rule" className="grow origin-left border-t border-ink" />
          </div>

          <div className="mt-5 flex flex-col items-center gap-1.5 lg:mt-[22px] lg:flex-row lg:gap-3.5">
            <span
              data-anim="stamp"
              className="stamp px-3.5 pt-[5px] pb-1 text-lg lg:px-4 lg:pt-1.5 lg:text-xl"
            >
              {today.lang}
            </span>
            <span data-anim="rise" className="text-base text-ink-soft italic lg:text-lg">
              {today.era}
            </span>
          </div>

          <WordDisplay
            as="p"
            split
            word={today.word}
            maxClass="[--max:112px] lg:[--max:176px]"
            className="mt-2 lg:mt-1.5"
          />
          <p
            data-anim="rise"
            className="text-[19px] leading-snug text-ink-soft italic lg:text-[22px]"
          >
            {today.pronLine}
          </p>

          <p
            data-anim="rise"
            className="mt-4 w-full border-y border-ink pt-2.5 pb-3 text-3xl leading-[1.15] italic lg:mt-[18px] lg:text-[46px] lg:leading-[1.1]"
          >
            {today.meaning}
          </p>

          <Fleuron className="mt-[18px] w-3/5" />

          <p data-anim="rise" className="dropcap mt-4 text-justify text-[18px] leading-normal hyphens-auto lg:text-xl lg:leading-normal">
            {today.gloss}
          </p>

          <ExampleQuote
            label="As it was written"
            example={today.example}
            size="md"
            className="mt-5 w-full"
          />

          <Link
            href={`/word/${today.slug}`}
            data-anim="rise"
            className="btn btn-accent lnk mt-[22px] w-full px-7 text-[19px] sm:w-auto"
          >
            Read the full entry →
          </Link>
        </article>

        {/* From the archive */}
        <aside className="order-3 border-t border-ink pt-6 lg:order-none lg:border-t-0 lg:border-l lg:pl-[26px]">
          <SectionHeading className="mb-2">From the Archive</SectionHeading>
          <ul>
            {archive.map((w) => (
              <li
                key={w.slug}
                data-anim="rise"
                className="border-b border-ink-soft last:border-b-0"
              >
                <Link
                  href={`/word/${w.slug}`}
                  data-hover="nudge"
                  className="lnk group block py-[18px] text-ink no-underline"
                >
                  <span className="block font-sc text-[15px] tracking-[0.16em] text-accent">
                    {w.lang}
                  </span>
                  <WordDisplay
                    word={w.word}
                    maxClass="[--max:46px]"
                    charWidth={0.6}
                    className="mt-0.5 group-hover:underline decoration-1 underline-offset-4"
                  />
                  <span className="mt-0.5 block text-[19px] leading-[1.3] text-ink-soft italic">
                    {w.meaning}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  );
}
