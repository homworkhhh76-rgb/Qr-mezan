const BUILD='7841';
const CACHE=`almezan-phone-scanner-v${BUILD}`;
const CORE=[
  './mobile-scanner.html',
  './phone-scanner-v7841.js?v='+BUILD,
  './scanner-manifest.webmanifest?v='+BUILD,
  './brand-logo.png?v='+BUILD,
  './barcode-scan.mp3?v='+BUILD,
  './app-icon-192.png',
  './app-icon-512.png'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await Promise.allSettled(CORE.map(async url=>{try{const r=await fetch(url,{cache:'no-cache'});if(r.ok||r.type==='opaque')await c.put(url,r.clone())}catch(_){}}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('almezan-phone-scanner-v')&&k!==CACHE)await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);if(u.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const c=await caches.open(CACHE),cached=(await c.match(event.request))||(await c.match(event.request,{ignoreSearch:true}));
    try{const r=await fetch(new Request(event.request,{cache:'no-cache'}));if(r.ok||r.type==='opaque')await c.put(event.request,r.clone());return r}catch(_){return cached||new Response('Offline',{status:503})}
  })());
});
