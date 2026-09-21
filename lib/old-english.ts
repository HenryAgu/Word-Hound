import { mod } from "./math";
import { words, type Word } from "./words";

// Shape written by scripts/fetch-old-english.mjs into public/old-english.json
export type RawEntry = {
  word: string;
  pos: string;
  meaning: string;
  example: string;
  translation: string | null;
};

const POS_NAMES: Record<string, string> = {
  noun: "noun",
  verb: "verb",
  adj: "adjective",
  adv: "adverb",
};

// Glosses that only point at another spelling or a grammatical form make poor words of the day.
const NOT_A_MEANING =
  /\b(alternative|variant|obsolete|spelling|form of|inflection|singular|plural|genitive|dative|accusative|nominative|instrumental|participle|person|imperative|subjunctive|indicative|comparative|superlative|Anglian|Mercian|Northumbrian|Kentish|Saxon|dialectal|nonstandard|misspelling|abbreviation|contraction)\b/i;

const CREDIT =
  "Drawn from Wiktionary, the free dictionary, and gathered by kaikki.org. The text is available under the CC BY-SA 4.0 licence.";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[þð]/g, "th")
    .replace(/æ/g, "ae")
    .replace(/ƿ/g, "w")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isUsable(e: RawEntry): e is RawEntry & { translation: string } {
  return (
    e.pos in POS_NAMES &&
    /^\p{L}{3,14}$/u.test(e.word) &&
    !!e.translation &&
    !e.example.includes("\n") &&
    e.example.length <= 140 &&
    e.translation.length <= 140 &&
    e.meaning.length <= 70 &&
    !NOT_A_MEANING.test(e.meaning)
  );
}

/**
 * Turns the raw dictionary dump into entries, keeping only short, clear,
 * translated examples. Hand-written entries win over dictionary ones.
 */
export function buildOldEnglishWords(raw: RawEntry[]): Word[] {
  const seen = new Set(words.map((w) => w.slug));
  const out: Word[] = [];
  for (const e of raw) {
    if (!isUsable(e)) continue;
    const slug = `old-english-${slugify(e.word)}`;
    if (seen.has(slug)) continue; // hand-written, or the same headword under another part of speech
    seen.add(slug);
    const pos = POS_NAMES[e.pos];
    out.push({
      slug,
      word: e.word,
      lang: "Old English",
      langSpan: "c. 450–1150",
      era: "spoken c. 450–1150 A.D.",
      pronLine: pos,
      meaning: e.meaning,
      gloss: `An Old English ${pos}, meaning “${e.meaning}”.`,
      example: {
        text: e.example.trim(),
        translation: `“${e.translation.trim()}”`,
        source: "Wiktionary",
      },
      credit: CREDIT,
    });
  }
  return out;
}

/**
 * Steps through the whole Old English hoard (the hand-written entry first, then
 * the dictionary) in a scrambled but fixed order, so consecutive visits never
 * feel alphabetical.
 */
export function pickOldEnglishWord(curated: Word, dictionary: Word[], visit: number): Word {
  const hoard = [curated, ...dictionary];
  return hoard[mod(visit * 7919, hoard.length)];
}
