const CACHE_NAME = 'coursera-clone-offline-v4';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['/']);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // We explicitly handle document navigations
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    // Cache successful navigation responses
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Priority: If the specific subpage is not cached, show a clear Offline Fallback
                    return new Response(
                        `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Offline - Coursera Clone</title>
                            <style>
                                body { font-family: system-ui; text-align: center; padding: 50px; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
                                h1 { color: #00419e; }
                                .btn { display: inline-block; background: #00419e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>You are currently offline</h1>
                                <p>The page you are trying to access has not been downloaded for offline viewing.</p>
                                <p>Please connect to the internet or go back to your downloaded courses.</p>
                                <a href="/" class="btn">Back to Home</a>
                            </div>
                        </body>
                        </html>`,
                        { headers: { 'Content-Type': 'text/html' } }
                    );
                })
        );
        return;
    }

    // Handle static assets & APIs
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Optional: Cache images / static assets as they load
                if (
                    url.pathname.startsWith('/_next/static') ||
                    url.pathname.match(/\.(png|jpg|jpeg|svg|gif)$/)
                ) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_ASSETS' && event.data.urls) {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(event.data.urls);
            }).catch(err => console.error('SW Cache pre-fetch failed:', err))
        );
    }
});
