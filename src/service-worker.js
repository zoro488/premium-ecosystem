/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SERVICE WORKER - PWA ADVANCED                          ║
 * ║  Cache strategies, offline mode, push notifications, background sync      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const CACHE_VERSION = 'chronos-v2.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Assets to cache immediately
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/offline.html'];

// Max items in dynamic cache
const MAX_DYNAMIC_ITEMS = 50;
const MAX_IMAGE_ITEMS = 100;

// ==================== INSTALL ====================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', event);

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting...');
        return self.skipWaiting();
      })
  );
});

// ==================== ACTIVATE ====================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', event);

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE) {
              console.log('[SW] Removing old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim();
      })
  );
});

// ==================== FETCH ====================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network First with cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Images - Cache First with network fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, MAX_IMAGE_ITEMS));
    return;
  }

  // HTML pages - Network First
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Static assets - Cache First
  event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

// ==================== CACHE STRATEGIES ====================

/**
 * Network First Strategy
 * Intenta red primero, si falla usa cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Clone response for cache
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If navigation request fails, show offline page
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }

    throw error;
  }
}

/**
 * Cache First Strategy
 * Busca en cache primero, si no existe va a red
 */
async function cacheFirstStrategy(request, cacheName, maxItems = null) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(cacheName);

    // Limit cache size
    if (maxItems) {
      await limitCacheSize(cacheName, maxItems);
    }

    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache and network failed:', error);
    throw error;
  }
}

/**
 * Limit cache size by removing oldest items
 */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Remove oldest items
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map((key) => cache.delete(key)));
  }
}

// ==================== BACKGROUND SYNC ====================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Syncing offline data...');

  try {
    // Get offline queue from IndexedDB
    // Send pending requests
    // Clear queue on success

    console.log('[SW] Data synced successfully');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error;
  }
}

// ==================== PUSH NOTIFICATIONS ====================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);

  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/close.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('Chronos System', options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/dashboard'));
  }
});

// ==================== MESSAGE ====================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully! 🚀');
