import { timingSafeEqual } from "node:crypto";
import webpush from "web-push";
import { listSubscriptions, markSent, removeSubscription, type StoredSubscription } from "@/lib/push/store";
import { isDeliveryWindow, localTime } from "@/lib/push/time";
import { wordOfTheDay } from "@/lib/push/word-of-the-day";

const BATCH_SIZE = 50;

function isAuthorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Delivers the word of the day to every reader for whom it is now morning.
 * Called hourly by an external scheduler with `Authorization: Bearer $CRON_SECRET`;
 * each run reaches the readers whose local clock has just struck nine.
 */
export async function POST(request: Request) {
  if (!isAuthorised(request)) return new Response("Unauthorized", { status: 401 });

  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !publicKey || !privateKey) {
    return Response.json({ error: "VAPID keys are not configured" }, { status: 500 });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const now = new Date();
  const due: { sub: StoredSubscription; date: string }[] = [];
  try {
    for (const sub of await listSubscriptions()) {
      const local = localTime(now, sub.timeZone);
      if (isDeliveryWindow(local.hour) && sub.lastSent !== local.date) due.push({ sub, date: local.date });
    }
  } catch (error) {
    console.error("push: could not read subscriptions", error);
    return Response.json({ error: "Could not read subscriptions" }, { status: 503 });
  }
  if (due.length === 0) return Response.json({ due: 0, sent: 0, removed: 0, failed: 0 });

  const word = await wordOfTheDay(now, new URL(request.url).origin);
  const payload = JSON.stringify({
    title: `${word.word} · ${word.lang}`,
    body: word.meaning,
    url: "/",
  });

  let sent = 0;
  let removed = 0;
  let failed = 0;
  for (let i = 0; i < due.length; i += BATCH_SIZE) {
    await Promise.all(
      due.slice(i, i + BATCH_SIZE).map(async ({ sub, date }) => {
        try {
          // A morning word is worthless by evening, so let the push service drop it after six hours.
          await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload, { TTL: 6 * 60 * 60 });
          await markSent(sub, date);
          sent++;
        } catch (error) {
          const status = (error as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) {
            // The reader unsubscribed or the browser revoked it; stop trying.
            await removeSubscription(sub.endpoint).catch(() => {});
            removed++;
          } else {
            console.error("push: delivery failed", status, error);
            failed++;
          }
        }
      }),
    );
  }

  return Response.json({ due: due.length, sent, removed, failed });
}
