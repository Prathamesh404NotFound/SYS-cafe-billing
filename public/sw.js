// SYS Cafe POS Service Worker with Offline Caching & Background Sync
const CACHE_NAME = 'sys-cafe-pos-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install: Cache critical shell assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for local assets, network-first for others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip Firebase Realtime DB, Firestore HTTP/WS streams, and analytics
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Fetch from network to update cache in background
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML document, return root index
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return cachedResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for Background Sync events (triggered when network recovers)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pos-orders') {
    event.waitUntil(notifyClientsToSync('background-sync'));
  }
});

// Listen for messages from client tabs
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'REQUEST_SYNC') {
    notifyClientsToSync('manual-request');
  }
});

// Notify active client tabs to trigger IndexedDB -> Firestore sync
async function notifyClientsToSync(source) {
  try {
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach(client => {
      client.postMessage({
        type: 'TRIGGER_FIRESTORE_SYNC',
        source,
        timestamp: Date.now()
      });
    });
  } catch (err) {
    console.error('SW failed to notify clients:', err);
  }
}
