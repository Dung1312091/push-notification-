console.log("Service Worker Loaded...");

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/'
];
//install service worker
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
//active service worker
self.addEventListener('activate', event => {
  console.log('begin activate servie worker ')
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName)); //update cache
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() =>{
      console.log('service worker is activated')
      return  self.clients.claim()
    }) //active service worker
  );
});
self.addEventListener('fetch', event => {
  //check origin and method for caching data
  console.log("event==>",event);
  if (event.request.url.startsWith(self.location.origin) && event.request.method === 'GET' &&(event.request.url !== 'http://localhost:3000/test')) {
    event.respondWith(
      caches.match(event.request).then(res => {
        console.log('respone catching',res);
        if (res) {
          return res;
        }
 
        return caches.open(CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              console.log('fetch request',response)
              return response;
            });
          });
        });
      })
    );
  }
});
self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  const options = {
    body: 'This notification has data attached to it that is printed ' +
      'to the console when it\'s clicked.',
    tag: 'data-notification',
    data: {
      time: new Date(Date.now()).toString(),
      message: 'Hello, World!'
    }
  };
  self.registration.showNotification(data.title, {
    body: "Notified by test demo1!",
    icon: "data:image/png;base64,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"
  });
});

self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();
  
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
      type: "window"
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow('/');
    }));
  });