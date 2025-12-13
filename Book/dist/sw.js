
const CACHE_NAME = 'shabrang-v1';
const urlsToCache = ["/", "/index.html", "/css/base.css", "/css/experience.css", "/css/viral.css", "/js/book.js", "/js/experience.js", "/js/viral.js", "/preface.html", "/introduction.html", "/chapter1.html", "/chapter2.html", "/chapter3.html", "/chapter4.html", "/chapter5.html", "/chapter6.html", "/chapter7.html", "/chapter8.html", "/chapter9.html", "/chapter10.html", "/chapter11.html", "/chapter12.html", "/chapter13.html", "/chapter14.html", "/chapter15.html", "/chapter16.html", "/chapter17.html", "/chapter18.html", "/chapter19.html", "/chapter20.html", "/chapter21.html", "/chapter22.html", "/chapter23.html", "/chapter24.html", "/chapter25.html", "/chapter26.html", "/chapter27.html", "/chapter28.html", "/chapter29.html", "/chapter30.html", "/appendix-a.html", "/appendix-b.html", "/appendix-c.html", "/appendix-d.html", "/appendix-e.html", "/conclusion.html", "/app.html"];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
