import { isValidTimeZone } from "./time";
import type { StoredSubscription } from "./store";

// The server will POST to whatever endpoint a client hands it, so only the
// browser vendors' own push services are accepted, never an arbitrary URL.
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/, // Chrome, Edge, Brave, Opera (and Android)
  /(^|\.)push\.services\.mozilla\.com$/, // Firefox
  /(^|\.)push\.apple\.com$/, // Safari and installed iOS web apps
  /(^|\.)notify\.windows\.com$/, // legacy Edge
];

export function isPushEndpoint(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PUSH_HOSTS.some((host) => host.test(url.hostname));
  } catch {
    return false;
  }
}

const isKey = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= 256;

/** Checks the body of a subscribe request; returns what to store, or null if it is malformed. */
export function parseSubscribeBody(body: unknown): Omit<StoredSubscription, "lastSent"> | null {
  if (typeof body !== "object" || body === null) return null;
  const { subscription, timeZone } = body as {
    subscription?: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
    timeZone?: unknown;
  };
  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;
  if (!isPushEndpoint(endpoint) || !isKey(p256dh) || !isKey(auth) || !isValidTimeZone(timeZone)) {
    return null;
  }
  return { endpoint, keys: { p256dh, auth }, timeZone };
}
