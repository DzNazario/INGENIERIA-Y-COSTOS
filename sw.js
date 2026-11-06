/* Service worker: guarda todo en el teléfono para usar la app sin internet.
   Si cambias archivos y no ves los cambios, sube el número de VERSION. */
const VERSION = "itc-v1";
const BASE = ["./", "index.html", "css/estilos.css", "js/datos.js", "js/calculadoras.js", "js/app.js", "manifest.webmanifest", "icono.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // Red primero (para ver tus cambios), caché si no hay internet. Los archivos que abres quedan guardados.
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.status === 200) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
