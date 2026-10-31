const CACHE='starray-v10';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png','./maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // app files: network first so updates arrive, cache as fallback for offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  } else if(u.hostname.endsWith('fonts.googleapis.com')||u.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res})));
  }
});
// push: "Dotan answered" notification
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'החללית',{body:d.body||'יש לך הודעה חדשה',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'starray',dir:'rtl',lang:'he',data:{url:d.url||'./#agent'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const target=new URL((e.notification.data&&e.notification.data.url)||'./#agent',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    const w=ws.find(c=>c.url.startsWith(self.registration.scope));
    if(w){w.focus();return w.navigate?w.navigate(target):null}
    return self.clients.openWindow(target);
  }));
});
