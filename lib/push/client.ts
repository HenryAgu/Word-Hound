/** Browser-side half of web push: registering the service worker and (un)subscribing. */

export function isPushSupported(): boolean {
  return (
    typeof Notification !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

// The push service wants the VAPID public key as bytes, but it is shipped as URL-safe base64.
function keyToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
}

async function registration() {
  await navigator.serviceWorker.register("/sw.js");
  return navigator.serviceWorker.ready;
}

/**
 * Subscribes this browser to push and tells the server where and when to reach it.
 * Safe to call again: it reuses an existing subscription and just refreshes the
 * server's copy (which also picks up a change of time zone). Needs notification
 * permission to have been granted already. Throws if any step fails.
 */
export async function enablePush(): Promise<void> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set");

  const reg = await registration();
  const existing = await reg.pushManager.getSubscription();
  const subscription =
    existing ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) }));

  try {
    await post("/api/push/subscribe", {
      subscription: subscription.toJSON(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch (error) {
    // Don't leave a browser-side subscription the server has never heard of.
    if (!existing) await subscription.unsubscribe().catch(() => {});
    throw error;
  }
}

/** Drops this browser's push subscription, here and on the server. Best effort: the local one is always dropped. */
export async function disablePush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await reg?.pushManager.getSubscription();
  if (!subscription) return;
  const { endpoint } = subscription;
  await subscription.unsubscribe();
  await post("/api/push/unsubscribe", { endpoint }).catch(() => {});
}
