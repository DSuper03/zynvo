// Kill switch for the retired next-pwa service worker.
// Browsers that installed the old worker keep running it until a new sw.js is
// served, so this one clears its caches and unregisters itself. Safe to delete
// once old installs have aged out.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
