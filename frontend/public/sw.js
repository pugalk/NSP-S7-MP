/**
 * Service Worker for National Scholarship Renewal & Eligibility Re-Verification Portal (EligiFind)
 * Provides comprehensive offline-first caching for low-bandwidth / rural student areas.
 */

const CACHE_NAME = 'eligifind-v1.0';
const DATA_CACHE_NAME = 'eligifind-data-v1.0';

// Shell resources to pre-cache immediately upon service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-maskable.svg'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core application shell');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some precache assets failed:', err);
      });
    })
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests for cache matching
  if (request.method !== 'GET') {
    // If offline and attempting an API mutation, return a graceful offline response
    if (url.pathname.startsWith('/api/') && !navigator.onLine) {
      event.respondWith(
        new Response(
          JSON.stringify({
            offline: true,
            queued: true,
            message: 'Application action saved locally. Changes will sync when network connectivity is restored.'
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          }
        )
      );
    }
    return;
  }

  // 1. Navigation requests (HTML pages / SPA routes)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: serve index.html shell so React Router handles routing
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. API Data Requests (GET /api/scholarships, GET /api/meta/constants, etc.)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[SW] Network failed for API. Serving cached data for:', url.pathname);
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Network offline. No cached data available.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        })
    );
    return;
  }

  // 3. Static Assets (CSS, JS chunks, Fonts, Icons)
  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fetch fails and there's no cache, return undefined
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Message Listener (for skipWaiting or manual cache purge)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
