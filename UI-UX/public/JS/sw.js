const CACHE_NAME = "uiux-tutorial-v1";
const urlsToCache = [
  "/UI-UX/",
  "/UI-UX/index.html",
  "/UI-UX/public/CSS/styles.css",
  "/UI-UX/public/JS/main.js",
  "/UI-UX/public/JS/utils.js",
  "/UI-UX/public/JS/sidebar.js",
  "/UI-UX/public/JS/sidebarToggle.js",
  "/UI-UX/public/JS/structureView.js",
  "/UI-UX/public/JS/search.js",
  "/UI-UX/public/JS/darkMode.js",
  "/UI-UX/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/marked/15.0.6/marked.min.js",
  "https://kit.fontawesome.com/b6a5c8db62.js",
  "/UI-UX/tutorials/intro.md",
  "/UI-UX/tutorials/about-course.md",
  "/UI-UX/tutorials/setting-up-figma.md",
  "/UI-UX/tutorials/setting-up-penpot.md",
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
