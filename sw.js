const staticCacheName = 'site-static-v1'
const dynamicCacheName = 'site-dynamic-v2'
const assets = [
  '', // home page
  '/index.html',
  '/pages/fallback.html',
  '/js/app.js',
  '/js/main.js',
  '/css/reset.css',
  '/css/style.css',
  '/img/icons/icon-128x128.png'
]

// cache size limits
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install the service worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
   .then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets)
    })
  )
})

// listen for activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
})

// fetch event
self.addEventListener('fetch', evt => {
  if (!(evt.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(async fetchRes => {
          const cache = await caches.open(dynamicCacheName)
          cache.put(evt.request.url, fetchRes.clone())
          limitCacheSize(dynamicCacheName, 15)
          return fetchRes
        })
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){ // if the pages isn't an html
          return caches.match('/pubic/pages/fallback.html')
        }
        // if(evt.request.url.indexOf('.png') > -1) {
        //   return caches.match('/img/.....') // find a fallback image to use
        // }
      })
    )
  }
})