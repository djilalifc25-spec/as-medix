// Service Worker Uninstaller / Cache Cleaner
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
      .then(() => {
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
          for (const client of clients) {
            client.navigate(client.url);
          }
        });
      })
  );
});

// Pass-through all fetch requests directly to the network - never intercept or show offline page
self.addEventListener('fetch', (event) => {
  return;
});
