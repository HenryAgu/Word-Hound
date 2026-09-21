import { daysSinceStart } from "./dates";
import { mod } from "./math";

export type Word = {
  slug: string;
  word: string;
  lang: string;
  /** Short span shown in the "Tongues in Rotation" list. */
  langSpan: string;
  /** Longer note shown beside the language stamp. */
  era: string;
  /** Pronunciation and part of speech, e.g. "/wyrd/ · noun". */
  pronLine: string;
  meaning: string;
  gloss?: string;
  example: { text: string; translation?: string; source: string };
  origin?: string;
  /** Attribution shown in place of an origin for entries drawn from a dictionary dump. */
  credit?: string;
};

export const words: Word[] = [
  {
    slug: "old-english-wyrd",
    word: "wyrd",
    lang: "Old English",
    langSpan: "c. 450–1150",
    era: "spoken c. 450–1150 A.D.",
    pronLine: "/wyrd/ · noun",
    meaning: "fate, destiny",
    gloss:
      "The power that shapes every life: the thread already spun before the hero draws his sword. To the Anglo-Saxons, wyrd was not luck but the way of things.",
    example: {
      text: "Gæð a wyrd swa hio scel.",
      translation: "“Fate goes ever as it must.”",
      source: "Beowulf, line 455",
    },
    origin:
      "From Proto-Germanic *wurdiz, kin to the verb weorþan, “to become”; wyrd is simply that which comes to pass. The word never quite died: as “weird” it first named the Fates themselves (Shakespeare’s Weird Sisters) before drifting toward mere strangeness.",
  },
  {
    slug: "welsh-hiraeth",
    word: "hiraeth",
    lang: "Welsh",
    langSpan: "living",
    era: "a living tongue",
    pronLine: "HEER-eyeth · noun",
    meaning: "longing for a home out of reach",
    gloss:
      "A homesickness braided with grief: a longing for a place that has changed, that is far away, or that never quite existed at all.",
    example: {
      text: "Hiraeth came over her each autumn, when the hills went copper in a country she had left.",
      source: "Example sentence",
    },
    origin:
      "Made of Welsh hir, “long”, and the noun-forming suffix -aeth: a long-ing, quite literally. Often said to resist translation, it names a homesickness tinged with grief for a place, or a time, that cannot be revisited.",
  },
  {
    slug: "portuguese-saudade",
    word: "saudade",
    lang: "Portuguese",
    langSpan: "living",
    era: "a living tongue",
    pronLine: "sow-DAH-deh · noun",
    meaning: "a tender longing for what is absent",
    gloss:
      "A bittersweet ache for a person, place or time now absent, held with affection rather than despair.",
    example: {
      text: "Tenho saudades tuas.",
      translation: "“I miss you.”",
      source: "A common Portuguese phrase",
    },
    origin:
      "Traced to Latin solitātem, “solitude”, and reshaped over the centuries in Old Portuguese. Poets and fado singers made it a national emblem: a longing held tenderly rather than in despair.",
  },
  {
    slug: "latin-lacuna",
    word: "lacuna",
    lang: "Latin",
    langSpan: "ancient",
    era: "an ancient tongue",
    pronLine: "la-KOO-na · noun",
    meaning: "a gap, a missing piece",
    gloss:
      "Once a pool or pit; now any blank in a manuscript, a record, or an argument where something should be.",
    example: {
      text: "The manuscript leaves a lacuna where the third chapter should be.",
      source: "Example sentence",
    },
    origin:
      "From Latin lacus, “lake, basin”: a lacuna was first a small pool or pit, then any hollow, and at last any blank in a text or an argument. Scholars still speak of lacunae in damaged manuscripts.",
  },
  {
    slug: "ancient-greek-eudaimonia",
    word: "eudaimonia",
    lang: "Ancient Greek",
    langSpan: "ancient",
    era: "an ancient tongue",
    pronLine: "εὐδαιμονία · yoo-dye-MOH-nee-ah · noun",
    meaning: "flourishing, a life well lived",
    gloss:
      "Not fleeting pleasure but a life well lived, measured across the whole of it rather than a single happy afternoon.",
    example: {
      text: "For the Greeks, eudaimonia was judged over a whole life, never a single day.",
      source: "Example sentence",
    },
    origin:
      "From Greek eu, “good”, and daimōn, “spirit”: to be watched over by a good guardian spirit. Aristotle made it the aim of all human life, and not pleasure but living and acting well.",
  },
];

/** The hand-written entry for `slug`. Dictionary entries are loaded in the browser instead. */
export function getWord(slug: string): Word | undefined {
  return words.find((w) => w.slug === slug);
}

/** The entry that follows `slug` in rotation: the next tongue, wrapping around at the end. */
export function getNextWord(slug: string): Word {
  let i = words.findIndex((w) => w.slug === slug);
  // A dictionary entry moves on from Old English to the next tongue.
  if (i < 0) i = words.findIndex((w) => w.lang === "Old English");
  return words[(i + 1) % words.length];
}

/** The line under "Another word" that says where this entry sits in the hoard. */
export function getEntryNote(slug: string, oldEnglishCount?: number): string {
  const i = words.findIndex((w) => w.slug === slug);
  return i >= 0
    ? `Entry ${i + 1} of ${words.length}, drawn in rotation`
    : `One of ${oldEnglishCount ?? "many"} Old English words in the hoard`;
}

/**
 * Each day belongs to one tongue, in turn. `word` is that tongue's hand-written
 * entry; on an Old English day, `visit` says how far into the Old English hoard
 * to step (see pickOldEnglishWord).
 */
export function tongueOfTheDay(now: Date): { word: Word; visit: number } {
  const day = daysSinceStart(now);
  return { word: words[mod(day, words.length)], visit: Math.floor(day / words.length) };
}
