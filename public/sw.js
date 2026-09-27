// AS-MEDIX Service Worker - PWA & Web Push Notification Engine
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Web Push Event Listener (Delivers notification to Mobile Notification Bar even when app is closed)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Rappel AS-MEDIX ⏰', body: event.data.text() };
    }
  }

  const title = data.title || 'Rappel Médical AS-MEDIX ⏰';
  const options = {
    body: data.body || 'Vous avez une révision à effectuer.',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'asmedix-reminder',
    renotify: true,
    data: {
      url: data.url || '/reminders'
    },
    actions: [
      { action: 'open', title: '📖 Réviser maintenant' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Notification Click Event Handler (Opens course/QCM when user taps notification on mobile)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || '/reminders';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
