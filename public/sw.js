// Word Hoard service worker: its only job is to show the daily word when a push arrives.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // Not JSON: fall through to a generic notice rather than showing nothing (browsers require a shown notification).
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Word Hoard", {
      body: data.body || "Thy word for the day hath arrived.",
      icon: "/favicon.ico",
      // One notice at a time: a new word replaces yesterday's unread one.
      tag: "word-of-the-day",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // Reuse a tab that is already on the site rather than piling up windows.
      const existing = open.find((client) => new URL(client.url).origin === self.location.origin);
      if (existing) {
        await existing.focus();
        if (existing.url !== target && "navigate" in existing) await existing.navigate(target);
        return;
      }
      await self.clients.openWindow(target);
    })(),
  );
});
