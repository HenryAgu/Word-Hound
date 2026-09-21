import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DictionaryEntry } from "@/components/dictionary-entry";
import { PageMasthead } from "@/components/masthead";
import { WordEntry } from "@/components/word-entry";
import { getEntryNote, getNextWord, getWord, words } from "@/lib/words";

// Old English dictionary entries live in the browser-fetched hoard, so their slugs share this prefix.
const DICTIONARY_PREFIX = "old-english-";

// Only the hand-written entries are prerendered; other slugs render on demand.
export function generateStaticParams() {
  return words.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/word/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWord(slug);
  if (!entry) return slug.startsWith(DICTIONARY_PREFIX) ? { title: "Old English" } : {};
  return {
    title: `${entry.word} · ${entry.lang}`,
    description: `${entry.word} (${entry.lang}): ${entry.meaning}.${entry.gloss ? ` ${entry.gloss}` : ""}`,
  };
}

export default async function WordPage({ params }: PageProps<"/word/[slug]">) {
  const { slug } = await params;
  const entry = getWord(slug);

  if (!entry && !slug.startsWith(DICTIONARY_PREFIX)) notFound();

  return (
    <>
      <PageMasthead slug={slug} />
      {entry ? (
        <WordEntry entry={entry} next={getNextWord(slug)} note={getEntryNote(slug)} />
      ) : (
        <DictionaryEntry slug={slug} />
      )}
    </>
  );
}
