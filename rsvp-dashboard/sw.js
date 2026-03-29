// Service Worker — RSVP Dashboard PWA
const CACHE = 'rsvp-v2';
const OFFLINE_ASSETS = ['/', '/manifest.json', '/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Navigation: serve from network, fall back to cached index
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }
  // Static assets: cache-first
  if (OFFLINE_ASSETS.includes(new URL(e.request.url).pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});

// Push notification from backend (Web Push / VAPID)
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data?.json() || {}; } catch { data = { title: 'Neue RSVP', body: e.data?.text() }; }

  const title = data.title || '🎉 Neue Anmeldung!';
  const options = {
    body: data.body || 'Jemand hat gerade eine RSVP eingereicht.',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'rsvp-notification',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: self.registration.scope }
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click → open/focus the dashboard
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || self.registration.scope;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
