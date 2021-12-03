import { setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { RangeRequestPlugin } from 'workbox-range-requests';

setCacheNameDetails({ prefix: 'seedling' });

precacheAndRoute(self.__WB_MANIFEST);

// registerRoute(
//   ({ url }) => url.pathname.endsWith('.mp3'),
//   new CacheFirst({
//     plugins: [new RangeRequestPlugin()],
//   }),
// );

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', () => {
  self.clients.claim();
});
