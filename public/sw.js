self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'ColegaPoints', body: event.data.text() };
  }

  const options = {
    body: payload.body,
    icon: payload.icon ?? '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: payload.url ? { url: payload.url } : undefined,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(url));
});
