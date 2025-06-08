self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/app-images/appicon-144.png',
                '/app-images/appicon-192.png',
                '/app-images/appicon-256.png',
                '/app-images/appicon-512.png',
                '/index.html',
                '/manifest.json',
                '/serviceworker.js',
                '/cleancab.png',
                '/styleph.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
