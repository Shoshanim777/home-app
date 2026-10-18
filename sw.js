// בדרך לסופר — service worker: offline shell + (next step) push notifications
const VERSION = 'v1.0.1';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname.endsWith('supabase.co')) return; // live data never comes from cache
  const isShell = url.origin === location.origin;
  const isLib = /cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.hostname);
  if (!isShell && !isLib) return;
  // network first for our own files (fresh updates), cache fallback offline; cache first for libraries & fonts
  if (isShell) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })));
  }
});

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'בדרך לסופר', body: e.data?.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'בדרך לסופר', {
    body: d.body || '', icon: 'icon-192.png', badge: 'badge-96.png', dir: 'rtl', lang: 'he',
    tag: d.tag, renotify: !!d.tag, vibrate: [100, 60, 100], data: { url: d.url || './' },
    actions: d.actions || []
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.startsWith(self.registration.scope));
    return c ? c.focus() : self.clients.openWindow(target);
  }));
});
