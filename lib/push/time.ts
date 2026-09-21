/** The hour of the morning at which the daily word is delivered, in the reader's own time. */
export const DELIVERY_HOUR = 9;

/**
 * Hours after `DELIVERY_HOUR` during which a missed delivery is still made up.
 * The hourly trigger is best-effort, so a late or dropped run should not cost a reader their word.
 */
export const GRACE_HOURS = 3;

export function isValidTimeZone(timeZone: unknown): timeZone is string {
  if (typeof timeZone !== "string" || timeZone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date ("2026-09-21") and hour (0-23) it is right now in `timeZone`. */
export function localTime(now: Date, timeZone: string): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

/** Is it morning-delivery time for a reader in `timeZone` (from 9:00 until the grace period ends)? */
export function isDeliveryWindow(hour: number): boolean {
  return hour >= DELIVERY_HOUR && hour < DELIVERY_HOUR + GRACE_HOURS;
}
