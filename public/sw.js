/* global workbox */

// --- Lifecycle / updates ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// (optionnel) Réduire le bruit console en prod
// workbox.setConfig({ debug: false });

// --- Precaching ---
workbox.precaching.precacheAndRoute([
  { url: '/offline.html', revision: '1' },
  { url: '/manifest.webmanifest', revision: '1' },
  { url: '/icons/icon-192.png', revision: '1' },
  { url: '/icons/icon-512.png', revision: '1' }
]);

// Nettoyer les anciens precaches générés par Workbox
workbox.precaching.cleanupOutdatedCaches();

// Prendre la main dès l'activation
workbox.core.clientsClaim();
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// --- Pages HTML (SPA) : Network-First + fallback offline ---
workbox.routing.registerRoute(
  // Toutes les navigations (liens internes Next.js)
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 3600
      })
    ]
  })
);

// Fallback offline si la stratégie réseau échoue et qu'on n'a rien en cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method === 'GET' && req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(req);
        return response;
      } catch (_) {
        const cached = await caches.match(req);
        return cached || caches.match('/offline.html');
      }
    })());
  }
});

// --- Assets (images, styles, scripts) : SWR ---
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets-v1',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 3600
      })
    ]
  })
);

// --- API n8n (direct) : Network-First (GET) ---
workbox.routing.registerRoute(
  ({ url, request }) =>
    request.method === 'GET' &&
    url.origin === 'https://n8n.stereogram.me' &&
    url.pathname.startsWith('/webhook/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-n8n-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 3600
      })
    ]
  })
);

// --- API via proxy Next : /api/saq/* (GET) ---
workbox.routing.registerRoute(
  ({ url, request }) =>
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    url.pathname.startsWith('/api/saq'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-proxy-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 3600
      })
    ]
  })
);

// --- Tuiles OpenStreetMap (Leaflet) : SWR dédié ---
workbox.routing.registerRoute(
  ({ url }) => url.hostname.endsWith('tile.openstreetmap.org'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'tiles-osm-v1',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 3600
      })
    ]
  })
);

// NOTE: on ne cache pas les requêtes POST (réponses non réutilisables)
