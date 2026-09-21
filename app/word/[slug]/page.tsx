import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageMasthead } from "@/components/masthead";
import { ExampleQuote, Fleuron, SectionHeading, WordDisplay } from "@/components/ornaments";
import { getEntryNumber, getNextWord, getWord, words } from "@/lib/words";

export function generateStaticParams() {
  return words.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/word/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWord(slug);
  if (!entry) return {};
  return {
    title: `${entry.word} · ${entry.lang}`,
    description: `${entry.word} (${entry.lang}): ${entry.meaning}. ${entry.gloss}`,
  };
}

export default async function WordPage({ params }: PageProps<"/word/[slug]">) {
  const { slug } = await params;
  const entry = getWord(slug);
  if (!entry) notFound();

  const next = getNextWord(entry.slug);

  return (
    <>
      <PageMasthead slug={entry.slug} />

      {/*
        One column on phones, in reading order; two columns on desktop. The two
        wrappers dissolve on phones (`contents`) so `order` can interleave their
        children; `lg:order-none` restores source order inside each column.
      */}
      <main className="flex grow flex-col gap-4 py-6 text-center lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0 lg:border-b lg:border-ink lg:py-0 lg:text-left">
        <div className="contents lg:flex lg:flex-col lg:border-r lg:border-ink lg:py-[30px] lg:pr-9">
          <div className="order-1 flex flex-col items-center lg:order-none lg:items-start">
            <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:gap-4">
              <span
                data-anim="stamp"
                className="stamp px-3.5 pt-[5px] pb-1 text-lg lg:px-[18px] lg:pt-[7px] lg:text-[22px]"
              >
                {entry.lang}
              </span>
              <span data-anim="rise" className="text-base text-ink-soft italic lg:text-xl">
                {entry.era}
              </span>
            </div>
            <WordDisplay
              as="h1"
              split
              word={entry.word}
              maxClass="[--max:112px] lg:[--max:200px]"
              className="mt-2.5 lg:mt-2"
            />
            <p
              data-anim="rise"
              className="text-[19px] leading-[1.3] text-ink-soft italic lg:text-2xl"
            >
              {entry.pronLine}
            </p>
          </div>

          <p
            data-anim="rise"
            className="order-2 border-y border-ink pt-2.5 pb-3 text-3xl leading-[1.15] italic lg:order-none lg:mt-5 lg:pt-3 lg:pb-3.5 lg:text-5xl lg:leading-[1.1]"
          >
            {entry.meaning}
          </p>

          <ExampleQuote
            label="In use"
            example={entry.example}
            className="order-5 mt-2 lg:order-none lg:mt-[26px]"
          />

          <div className="order-7 mt-2 flex flex-col items-stretch gap-2.5 lg:order-none lg:mt-7 lg:flex-row lg:items-center lg:gap-[22px]">
            <Link
              href={`/word/${next.slug}`}
              data-anim="rise"
              className="btn btn-solid lnk px-8 text-[21px] lg:min-h-14 lg:px-[34px]"
            >
              Another word
            </Link>
            <p data-anim="rise" className="text-base text-ink-soft italic lg:text-lg">
              Entry {getEntryNumber(entry.slug)} of {words.length}, drawn in rotation
            </p>
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-[30px] lg:py-[30px] lg:pl-9">
          <section className="order-3 lg:order-none">
            <SectionHeading className="hidden lg:block">In Brief</SectionHeading>
            <p data-anim="rise" className="text-[19px] leading-[1.45] italic lg:mt-4 lg:text-[23px]">
              {entry.gloss}
            </p>
          </section>

          <Fleuron className="order-4 mt-2 lg:order-none lg:mt-0" />

          <section className="order-6 mt-2 lg:order-none lg:mt-0">
            <SectionHeading className="text-lg">Of Its Origin</SectionHeading>
            <p data-anim="rise" className="dropcap mt-3.5 text-justify text-lg leading-normal hyphens-auto lg:mt-4 lg:text-[21px] lg:leading-normal">
              {entry.origin}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
