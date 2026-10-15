// AvansMotor: zorgt dat het spel ook zonder internet werkt.
// Online haalt hij altijd de nieuwste versie op; offline speelt hij de laatst bewaarde.
const CACHE = 'avansmotor-v1';
const BESTANDEN = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(antwoord => {
        const kopie = antwoord.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopie));
        return antwoord;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
