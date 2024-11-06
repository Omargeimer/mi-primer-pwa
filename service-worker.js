const cacheName = 'todo-cache-v1';
const assets = [
    '/',                   // Página de inicio
    '/index.html',         // Archivo HTML principal
    '/style.css',          // Estilos CSS
    '/app.js',             // Archivo JavaScript principal
    '/manifest.json',      // Archivo de manifest de la aplicación
    '/images/icon-192.png', // Ícono de 192px para dispositivos
    '/images/icon-512.png'  // Ícono de 512px para dispositivos
];

// Evento de instalación: ocurre la primera vez que el Service Worker se registra
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assets)
                    .then(() => self.skipWaiting());
            })
            .catch(err => console.log('Falló registro de cache', err))
    );
});

// Evento de activación: se ejecuta después de que el SW se instala y toma el control de la aplicación
self.addEventListener('activate', e => {
    const cacheWhitelist = [cacheName];

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cName => {
                        if (!cacheWhitelist.includes(cName)) {
                            return caches.delete(cName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Intercepta las solicitudes de red y responde con los recursos en caché si están disponibles
self.addEventListener('fetch', e => {
    e.respondWith(  // Asegúrate de que estás usando e.respondWith, no e.responseWith
        caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            }
            return fetch(e.request);
        })
    );
});
