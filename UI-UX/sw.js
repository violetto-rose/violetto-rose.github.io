const CACHE_NAME = "uiux-tutorial-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/public/CSS/styles.css",
  "/public/JS/main.js",
  "/public/JS/utils.js",
  "/public/JS/sidebar.js",
  "/public/JS/sidebarToggle.js",
  "/public/JS/structureView.js",
  "/public/JS/search.js",
  "/public/JS/darkMode.js",
  "/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/marked/15.0.6/marked.min.js",
  "https://kit.fontawesome.com/b6a5c8db62.js",
  "/tutorials/intro.md",
  "/tutorials/about-course.md",
  "/tutorials/setting-up-figma.md",
  "/tutorials/setting-up-penpot.md",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
