// Xanthus dashboard service worker: receives Web Push alerts and opens the dashboard on click.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("push", (event) => {
  let data = { title: "Xanthus", body: "", url: "./", tag: "xanthus" };
  try { data = { ...data, ...event.data.json() }; } catch { data.body = event.data ? event.data.text() : ""; }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, tag: data.tag, renotify: true, data: { url: data.url },
    icon: "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='#1F3864'/><path d='M12 44 L28 24 L40 36 L52 16' stroke='#7CFC98' stroke-width='6' fill='none'/></svg>"),
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "./", self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    const existing = list.find((c) => c.url.startsWith(self.registration.scope));
    return existing ? existing.focus() : self.clients.openWindow(url);
  }));
});
