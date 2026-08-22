/* Der Editor muss offline laufen. Nur die Pipeline-Aufrufe brauchen Netz —
   und die gehen nie durch den Cache. */
const CACHE = 'tf-v1';
const SHELL = [
  './', './index.html',
  './css/tokens.css', './css/app.css',
  './js/app.js', './js/trancescript.js', './js/harvest.js',
  './js/mixdown.js', './js/providers.js', './js/db.js', './js/recorder.js',
  './manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.includes('/api/')) return;
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit || fetch(e.request).then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit)
    )
  );
});
