// Service worker do MindRich.
// O app é inteiramente client-side (estado no localStorage), então depois da
// primeira visita ele funciona offline — só faltava guardar os assets.
//
// Estratégias:
//   navegação  → rede primeiro, cai para o cache quando offline
//   estáticos  → cache primeiro, revalidando em segundo plano
//
// Ao mudar este arquivo, suba CACHE_VERSION: caches antigos são apagados no
// activate, evitando que alguém fique preso numa versão velha do app.
const CACHE_VERSION = "v1";
const CACHE_NAME = `mindrich-${CACHE_VERSION}`;

const SCOPE_PATH = new URL(self.registration.scope).pathname;
const OFFLINE_FALLBACK = SCOPE_PATH;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([OFFLINE_FALLBACK]))
      .catch(() => {
        // Falha de rede na instalação não deve impedir o SW de assumir.
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            (await caches.match(OFFLINE_FALLBACK)) ||
            Response.error()
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
