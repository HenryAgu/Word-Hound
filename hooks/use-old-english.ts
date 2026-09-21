"use client";

import { useQuery } from "@tanstack/react-query";
import { buildOldEnglishWords, type RawEntry } from "@/lib/old-english";

async function fetchOldEnglish(): Promise<RawEntry[]> {
  // Written to public/ by scripts/fetch-old-english.mjs
  const res = await fetch("/old-english.json");
  if (!res.ok) throw new Error(`Could not load the Old English hoard (${res.status})`);
  return res.json();
}

/** The Old English dictionary entries, fetched once and kept for the life of the page. */
export function useOldEnglishWords() {
  return useQuery({
    queryKey: ["old-english"],
    queryFn: fetchOldEnglish,
    select: buildOldEnglishWords,
    staleTime: Infinity,
    retry: 1,
  });
}
