const CACHE_NAME = "muscle-diet-v1";
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network First for API calls
  if (url.pathname.includes('/api/') || url.host.includes('localhost:8000')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If it's a successful response and it's the generate-plan or get-plan, cache it
          if (response.ok && (url.pathname.includes('generate-plan') || url.pathname.includes('get-plan'))) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put('last-diet-plan', clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If it's trying to get the plan, return the last generated plan
            return caches.match('last-diet-plan');
          });
        })
    );
  } else {
    // Cache First for everything else
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
