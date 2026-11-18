// VERSION is a hash of the files below, written by `bun stamp.js`.
// A new VERSION is what makes browsers see an updated service worker.
const VERSION = "f49b324279ad";
const CACHE = "callme-" + VERSION;
const FILES = [
    "./",
    "index.html",
    "script.js",
    "links.js",
    "icons.js",
    "pwa.js",
    "css/pico.min.css",
    "favicon.ico",
    "manifest.webmanifest",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
    // "reload" bypasses the HTTP cache, so the new version never stores stale files.
    const requests = FILES.map((file) => new Request(file, { cache: "reload" }));
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(requests)));
});

self.addEventListener("activate", (event) => {
    const stale = (name) => name.startsWith("callme-") && name !== CACHE;
    event.waitUntil(
        caches.keys().then((names) => Promise.all(names.filter(stale).map((name) => caches.delete(name))))
    );
});

// The page sends this when the user presses "Update".
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;
    event.respondWith(
        caches
            .open(CACHE)
            .then((cache) => cache.match(request, { ignoreSearch: true }))
            .then((cached) => cached || fetch(request))
    );
});
