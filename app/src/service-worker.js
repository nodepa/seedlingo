import { setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

setCacheNameDetails({ prefix: 'seedling' });

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', () => {
  self.clients.claim();
});
