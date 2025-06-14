//Reference: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers

const VERSION = "v1"
const APP_NAME = "cleancab-app";
const CACHE_NAME = `${APP_NAME}-${VERSION}`;

const APP_STATIC_RESOURCES = [
    '/cleancab/app-images/appicon-144.png',
    '/cleancab/app-images/appicon-192.png',
    '/cleancab/app-images/appicon-256.png',
    '/cleancab/app-images/appicon-512.png',
    '/cleancab/index.html',
    '/cleancab/fallback.html',
    '/cleancab/manifest.json',
    '/cleancab/cleancab.png',
    '/cleancab/styleph.css'];
                
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES).catch((err) => {
        console.error("Failed to cache resources during install:", err);
      });
    })(),
  );
});

self.addEventListener("activate", (event) => {
  console.log("Handling activate event");
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
        .filter((name) => name !== CACHE_NAME && name.startsWith(APP_NAME))
        .map((name) => {
          console.log("Handling activate. Delete cache:", name);
          return caches.delete(name);
        }),
      );
      await clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => 
{
  console.log("Handling fetch event for", event.request.url);   

  if (event.request.mode === "navigate") 
  {
    event.respondWith(
      caches.match('/cleancab/index.html').then((cachedResponse) => 
        cachedResponse || fetch(event.request).catch(() => caches.match('/cleancab/index.html'))
      )
    );
    return;
  }

  // Handle other requests with caching updates
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      const requestUrl = new URL(event.request.url);
      const normalizedRequest = requestUrl.pathname;

      console.log("Normalized fetch event for", normalizedRequest); 
  
      const cachedResponse = await cache.match(event.request) || await cache.match(normalizedRequest);

      if (cachedResponse) {
        console.log("Found response in cache:", cachedResponse);
        return cachedResponse;
      }

      console.log("No response found in cache. Fetching from network...");
      
      try {
        const response = await fetch(event.request);
        console.log("Response from network:", response);

        const responseClone = response.clone();
        cache.put(normalizedRequest, responseClone);

        return response;
      } catch (error) {
        console.error("Fetching failed:", error);
        return caches.match('/cleancab/fallback.html').then((fallback) =>
            fallback || new Response("Offline", { status: 503 })
        );
      }
    })()
  );
});
