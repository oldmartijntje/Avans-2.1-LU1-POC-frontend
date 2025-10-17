const CACHE_NAME = 'avans-elective-hub-v1';
const BASE_PATH = '/Avans-2.1-LU1-POC-frontend';
const urlsToCache = [
    BASE_PATH + '/',
    BASE_PATH + '/static/js/bundle.js',
    BASE_PATH + '/static/css/main.css',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log('Failed to cache resources:', error);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a stream
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // If both cache and network fail, show offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match(BASE_PATH + '/offline.html');
                    }
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle background sync for when the app comes back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        // You can add logic here to sync data when the app comes back online
    }
});

// Handle push notifications (optional for future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: BASE_PATH + '/icons/icon-192x192.png',
            badge: BASE_PATH + '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                    icon: BASE_PATH + '/icons/icon-96x96.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: BASE_PATH + '/icons/icon-96x96.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app to a specific page
        event.waitUntil(
            clients.openWindow(BASE_PATH + '/subjects')
        );
    } else {
        // Open the app to the main page
        event.waitUntil(
            clients.openWindow(BASE_PATH + '/')
        );
    }
});