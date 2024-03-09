let CACHE_VERSION = "app-v1.0";
let CACHE_FILES = [
  "/",
  "index.html",
  "script.js",
  "utils.js",
  "style.css",
  "favicon.ico",
  "manifest.json",
  "icon-192x192.png",
  "icon-256x256.png",
  "icon-384x384.png",
  "icon-512x512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key, i) {
          if (key !== CACHE_VERSION) {
            return caches.delete(keys[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  let online = navigator.onLine;

  if (!online) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }

        requestBackend(event);
      })
    );
  }
});

function requestBackend(event) {
  var url = event.request.clone();
  return fetch(url).then(function (response) {
    if (!response || response.status !== 200 || response.type !== "basic") {
      return response;
    }

    var responseObj = response.clone();

    caches.open(CACHE_VERSION).then(function (cache) {
      cache.put(event.request, responseObj);
    });

    return response;
  });
}
