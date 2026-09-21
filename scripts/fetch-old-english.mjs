import fs from "node:fs";
import readline from "node:readline";

// Check the exact filename on https://kaikki.org/dictionary/Old%20English/index.html
const URL =
  "https://kaikki.org/dictionary/Old%20English/kaikki.org-dictionary-OldEnglish.jsonl";

const res = await fetch(URL);
const text = await res.text();

const words = [];
for (const line of text.split("\n")) {
  if (!line.trim()) continue;
  const entry = JSON.parse(line);

  // find a sense that has both a meaning and an example
  for (const sense of entry.senses ?? []) {
    const meaning = sense.glosses?.[0];
    const example = sense.examples?.[0];
    if (meaning && example?.text) {
      words.push({
        word: entry.word,
        pos: entry.pos,
        meaning,
        example: example.text,
        translation: example.english ?? example.translation ?? null,
      });
      break;
    }
  }
}

fs.writeFileSync("public/old-english.json", JSON.stringify(words));
console.log(`Saved ${words.length} words`);
