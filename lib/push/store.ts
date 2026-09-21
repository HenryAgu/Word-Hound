import { Redis } from "@upstash/redis";
import { localTime, isDeliveryWindow } from "./time";

/** What we keep of a browser's push subscription, plus when to reach the reader. */
export type StoredSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  /** IANA zone name, so "nine in the morning" means the reader's own nine. */
  timeZone: string;
  /** Local date ("2026-09-21") of the last delivery, so a word is never sent twice in a day. */
  lastSent?: string;
};

const HASH = "word-hoard:push-subscriptions";

let redis: Redis | undefined;

// Built on first use, so a build without the env vars still succeeds.
function db(): Redis {
  // `UPSTASH_*` is what Upstash's own console gives; `KV_*` is what Vercel's marketplace integration sets.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured (UPSTASH_REDIS_REST_URL / _TOKEN)");
  return (redis ??= new Redis({ url, token }));
}

/** Stores or refreshes a subscription, keyed by its endpoint. Returns nothing; throws if Redis is unreachable. */
export async function saveSubscription(
  sub: Omit<StoredSubscription, "lastSent">,
  now = new Date(),
): Promise<void> {
  const existing = await db().hget<StoredSubscription>(HASH, sub.endpoint);
  const local = localTime(now, sub.timeZone);
  await db().hset(HASH, {
    [sub.endpoint]: {
      ...sub,
      // Someone who joins after nine is not sent today's word on the spot: it is already on the page.
      lastSent: existing?.lastSent ?? (isDeliveryWindow(local.hour) ? local.date : undefined),
    } satisfies StoredSubscription,
  });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  await db().hdel(HASH, endpoint);
}

export async function listSubscriptions(): Promise<StoredSubscription[]> {
  const all = await db().hgetall<Record<string, StoredSubscription>>(HASH);
  return all ? Object.values(all) : [];
}

export async function markSent(sub: StoredSubscription, date: string): Promise<void> {
  await db().hset(HASH, { [sub.endpoint]: { ...sub, lastSent: date } satisfies StoredSubscription });
}
