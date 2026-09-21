"use client";

import { NotInHoard } from "@/components/not-in-hoard";
import { RevealBox } from "@/components/reveal-box";
import { WordEntry } from "@/components/word-entry";
import { WordEntrySkeleton } from "@/components/word-entry-skeleton";
import { useOldEnglishWords } from "@/hooks/use-old-english";
import { getEntryNote, getNextWord } from "@/lib/words";

/** An Old English dictionary entry, looked up in the hoard the browser fetches. */
export function DictionaryEntry({ slug }: { slug: string }) {
  const { data, isPending, isError, refetch } = useOldEnglishWords();

  if (isPending) return <WordEntrySkeleton />;

  if (isError) {
    return (
      <main className="flex grow flex-col items-center justify-center gap-5 py-16 text-center">
        <h1 className="text-3xl italic lg:text-4xl">The hoard could not be reached.</h1>
        <button type="button" onClick={() => refetch()} className="btn btn-solid px-7 text-[19px]">
          Try again
        </button>
      </main>
    );
  }

  const entry = data.find((w) => w.slug === slug);
  if (!entry) return <NotInHoard />;

  return (
    <RevealBox key={entry.slug}>
      <WordEntry
        entry={entry}
        next={getNextWord(entry.slug)}
        // +1 for the hand-written Old English entry that leads the hoard.
        note={getEntryNote(entry.slug, data.length + 1)}
      />
    </RevealBox>
  );
}
