// Imported into the generated service worker (see workbox.importScripts in vite.config.ts).
self.addEventListener('push', (event) => {
  let data = { title: 'Ranked', body: 'Time for your daily quiz.', url: '/' };
  try { data = { ...data, ...event.data.json() }; } catch (e) { /* use the defaults */ }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'daily-quiz',
    data: { url: data.url }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
