//if we wanted to cache the resources on install, we would have to provie a list of urls
//which in our case we dont know
self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker 🤙')
})

self.addEventListener('fetch', function async(event) {
  console.log(event.request.url)

  if (!event.request.url.includes('api')) {
    event.respondWith(
      (async function () {
        // Try to get the response from a cache.
        const cacheTodos = await caches.open('todos-static-files')
        const cachedResponse = await cacheTodos.match(event.request)
        // Return it if we found one.
        if (cachedResponse) return cachedResponse

        // If we didn't find a match in the cache, use the network and then cache the result
        const networkResponse = await fetch(event.request)
        if (event.request.url.indexOf('http') === 0) {
          await cacheTodos.put(event.request, networkResponse)
        }

        return fetch(event.request)
      })()
    )
  }

  //PROBLEM: after set the app offline and turning it again online this request is not done again
  //it stays in a pending state which never ends. It does not happen always though
  // another way of stumbling into this problem is opening another tab with the same site. In this
  // case the problem always appears.

  if (event.request.url.includes('/api/getTodos')) {
    event.respondWith(
      (async function () {
        //we open the cache
        const cacheTodos = await caches.open('todos-static-files')
        //we make the network response first
        let networkResponse
        try {
          networkResponse = await fetch(event.request)
          await cacheTodos.put(event.request, networkResponse)
          return fetch(event.request)
        } catch (err) {
          return cacheTodos.match(event.request)
        }
      })()
    )
  }
})
