var CACHE = 'mandalachart-v1';
var APP = [
  './',
  './index.html',
  './%E6%9B%BC%E9%99%80%E7%BD%97%E4%B9%9D%E5%AE%AB%E6%A0%BC.html',
  './html2canvas.min.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(APP); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(event.request).then(function (response) {
      caches.open(CACHE).then(function (cache) { cache.put(event.request, response.clone()); });
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) { return cached || caches.match('./index.html'); });
    })
  );
});
