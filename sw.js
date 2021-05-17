// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests
let cacheName = 'lab7-entry-cache';
let cachedUrls = [
    // '/',
    // '/Lab7',
    'https://cse110lab6.herokuapp.com/entries',
    // 'https://drive.google.com/',
    // 'https://w7w5t4b3.rocketcdn.me/wp-content/uploads/2019/01/',
];

self.addEventListener('install', e => {
    var now = Date.now();
    console.log("starting prefetch");
    e.waitUntil(caches.open(cacheName).then(cache => {
        // let cachePromises = cachedUrls.map(urlToPrefetch => {
        //     let url = new URL(urlToPrefetch, location.href);
        //     url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

        //     var request = new Request(url, {mode: 'cors'});
        //     return fetch(request).then(response =>{
        //         if (response.status >= 400) {
        //             throw new Error('request for' + urlToPrefetch + 'failed with status ' + response.statusText);
        //         }

        //         return cache.put(request, response);
        //     }).catch(error => {
        //         console.error('Not caching ' + urlToPrefetch + 'due to ' + error);
        //     });
        // });

        // return Promise.all(cachePromises).then(() => {
        //     console.log('pre-fetching complete');
        // })
        // .catch(error => {
        //     console.error('pre-fetching failed ' + error);
        // });
        cache.addAll(cachedUrls);
    }
            // Tried to cache the images from google drive, but... the recommended workaround doesn't work
            // cache.addAll(URLS_TO_CACHE.map(function(urlToPrefetch) {
            //     return new Request(urlToPrefetch, { mode: 'no-cors' });
            //   })).then(function() {
            //     console.log('All resources have been fetched and cached.');
            //   })
    ));
              
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                console.log('got response from cache: ', response);
                return response;
            }

            return fetch(e.request).then(r => {

                console.log('got response from network: ', r);
                
                if (!r || r.status !== 200 || r.type !== 'basic') {
                    return r;
                }

                var responseToCache = r.clone();

                caches.open(cacheName).then((cache) => {
                    cache.put(e.request, responseToCache);
                });

                return r;
            }).catch(error => {
                console.error('fetching failed:', error);

                throw error;
            });

        })
    );
});