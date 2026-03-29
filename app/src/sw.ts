/// <reference lib="WebWorker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// __WB_MANIFEST is injected by vite-plugin-pwa at build time
const manifest = self.__WB_MANIFEST;

// BroadcastChannel works across all same-origin pages regardless of whether
// the SW controls them yet — unlike clients.matchAll() which misses
// uncontrolled clients during the install phase on first load.
const bc = new BroadcastChannel('sw-cache-progress');

// Install: cache all precache entries and broadcast progress
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('precache-v1');
      const total = manifest.length;
      let loaded = 0;

      await Promise.all(
        manifest.map(async (entry) => {
          const url = typeof entry === 'string' ? entry : entry.url;
          try {
            const request = new Request(url, { cache: 'no-cache' });
            const response = await fetch(request);
            await cache.put(url, response);
          } catch {
            // If a single asset fails, don't block install
          }
          loaded += 1;
          bc.postMessage({ type: 'CACHE_PROGRESS', loaded, total });
        }),
      );

      bc.close();
      await self.skipWaiting();
    })(),
  );
});

// Activate: claim all clients immediately
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached ?? fetch(event.request)),
  );
});

// Register precache routes so navigation requests are handled correctly
precacheAndRoute(manifest);
