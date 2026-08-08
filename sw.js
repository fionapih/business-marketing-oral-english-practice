/* 外企英语学习舱 — Service Worker（离线可用）
 * 注意：每次发布新版本务必 +1 这里的 CACHE 版本号，
 * 否则已安装 SW 的用户会一直命中旧缓存，看不到新功能。 */
const CACHE = 'ec-v0.9.0';
const CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/curriculum.js',
  './js/store.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // 音频：cache-first（真人录音体积大，命中即用）
  if (/\.(mp3|m4a|wav|ogg)$/i.test(new URL(req.url).pathname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req, { cache: 'reload' }).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // 其他：network-first（强制绕过 HTTP 缓存，确保拿到最新 JS/CSS/HTML），失败回落缓存
  e.respondWith(
    fetch(req, { cache: 'reload' })
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
