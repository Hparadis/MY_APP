// Custom service worker logic — merged into the Vite PWA generated SW
// Handles: receiving scheduled reminders, firing notifications at the right time,
// and routing taps back into the app.

const TIMERS = new Map();

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  if (type === 'SCHEDULE_REMINDER') {
    const { id, text, fireAt } = payload;
    const delay = fireAt - Date.now();

    // Clear any existing timer for this id (in case it was rescheduled)
    if (TIMERS.has(id)) {
      clearTimeout(TIMERS.get(id));
    }

    if (delay <= 0) return;

    const timer = setTimeout(() => {
      self.registration.showNotification('Reminder', {
        body: text,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: id,
        data: { id },
        requireInteraction: false,
        vibrate: [120, 60, 120],
      });
      TIMERS.delete(id);
    }, delay);

    TIMERS.set(id, timer);
  }

  if (type === 'CANCEL_REMINDER') {
    const { id } = payload;
    if (TIMERS.has(id)) {
      clearTimeout(TIMERS.get(id));
      TIMERS.delete(id);
    }
  }
});

// Tapping the notification opens (or focuses) the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
