import Link from "next/link";
import { ExampleQuote, Fleuron, WordDisplay } from "@/components/ornaments";
import type { Word } from "@/lib/words";

/**
 * The word of the day as it appears in the front page's centre column. Renders
 * a fragment: the parent `<article>` supplies the centred flex column.
 */
export function WordFeature({ word }: { word: Word }) {
  return (
    <>
      <div className="flex w-full items-center gap-3.5">
        <div aria-hidden data-anim="rule" className="grow origin-right border-t border-ink" />
        <h2 data-anim="rise" className="font-sc text-base tracking-[0.22em] text-accent lg:text-lg">
          The Word of the Day
        </h2>
        <div aria-hidden data-anim="rule" className="grow origin-left border-t border-ink" />
      </div>

      <div className="mt-5 flex flex-col items-center gap-1.5 lg:mt-[22px] lg:flex-row lg:gap-3.5">
        <span
          data-anim="stamp"
          className="stamp px-3.5 pt-[5px] pb-1 text-lg lg:px-4 lg:pt-1.5 lg:text-xl"
        >
          {word.lang}
        </span>
        <span data-anim="rise" className="text-base text-ink-soft italic lg:text-lg">
          {word.era}
        </span>
      </div>

      <WordDisplay
        as="p"
        split
        word={word.word}
        maxClass="[--max:112px] lg:[--max:176px]"
        className="mt-2 lg:mt-1.5"
      />
      <p data-anim="rise" className="text-[19px] leading-snug text-ink-soft italic lg:text-[22px]">
        {word.pronLine}
      </p>

      <p
        data-anim="rise"
        className="mt-4 w-full border-y border-ink pt-2.5 pb-3 text-3xl leading-[1.15] italic lg:mt-[18px] lg:text-[46px] lg:leading-[1.1]"
      >
        {word.meaning}
      </p>

      {word.gloss && (
        <>
          <Fleuron className="mt-[18px] w-3/5" />

          <p
            data-anim="rise"
            className="dropcap mt-4 text-justify text-[18px] leading-normal hyphens-auto lg:text-xl lg:leading-normal"
          >
            {word.gloss}
          </p>
        </>
      )}

      <ExampleQuote
        label="As it was written"
        example={word.example}
        size="md"
        className="mt-5 w-full"
      />

      <Link
        href={`/word/${word.slug}`}
        data-anim="rise"
        className="btn btn-accent lnk mt-[22px] w-full px-7 text-[19px] sm:w-auto"
      >
        Read the full entry →
      </Link>
    </>
  );
}
