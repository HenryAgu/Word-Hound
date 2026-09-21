import { buildOldEnglishWords, pickOldEnglishWord } from "@/lib/old-english";
import { tongueOfTheDay, type Word } from "@/lib/words";

/**
 * The word the front page is showing right now, worked out on the server.
 *
 * On an Old English day the page draws from the dictionary, which the browser
 * fetches from `/old-english.json`; this fetches the same file from `origin`, so
 * the notification names the word the reader will find when they open the site.
 */
export async function wordOfTheDay(now: Date, origin: string): Promise<Word> {
  const { word, visit } = tongueOfTheDay(now);
  if (word.lang !== "Old English") return word;

  try {
    const res = await fetch(new URL("/old-english.json", origin));
    if (!res.ok) return word;
    return pickOldEnglishWord(word, buildOldEnglishWords(await res.json()), visit);
  } catch {
    // Same fallback as the page: the hand-written entry rather than nothing.
    return word;
  }
}
