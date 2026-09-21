const DAY_MS = 86_400_000;

// The design's front page shows the first entry on this day; rotation counts from here.
const ROTATION_START = Date.UTC(2026, 8, 21);

export function wordOfTheDayIndex(now: Date, length: number): number {
  const days = Math.floor((now.getTime() - ROTATION_START) / DAY_MS);
  return ((days % length) + length) % length;
}

function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}

/** "Monday, the 21st of September" (UTC, so server and client agree). */
export function longDate(now: Date): string {
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const month = now.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });
  return `${weekday}, the ${ordinal(now.getUTCDate())} of ${month}`;
}

export function romanYear(now: Date): string {
  const numerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = now.getUTCFullYear();
  let out = "";
  for (const [value, glyph] of numerals) {
    while (n >= value) {
      out += glyph;
      n -= value;
    }
  }
  return out;
}
