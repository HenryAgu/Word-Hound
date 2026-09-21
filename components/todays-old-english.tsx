"use client";

import { RevealBox } from "@/components/reveal-box";
import { WordFeature } from "@/components/word-feature";
import { WordFeatureSkeleton } from "@/components/word-feature-skeleton";
import { useOldEnglishWords } from "@/hooks/use-old-english";
import { pickOldEnglishWord } from "@/lib/old-english";
import type { Word } from "@/lib/words";

/**
 * Today's word on an Old English day: it is drawn from the whole hoard, which
 * the browser fetches, so a skeleton stands in until it arrives.
 */
export function TodaysOldEnglish({ curated, visit }: { curated: Word; visit: number }) {
  const { data, isPending } = useOldEnglishWords();

  if (isPending) return <WordFeatureSkeleton />;

  // If the hoard can't be reached, fall back to the hand-written entry rather than an empty page.
  const word = data ? pickOldEnglishWord(curated, data, visit) : curated;
  return (
    <RevealBox key={word.slug}>
      <WordFeature word={word} />
    </RevealBox>
  );
}
