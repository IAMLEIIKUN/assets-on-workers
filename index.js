addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

const ORIGIN_URL = `https://softakun.shop`
const BUCKET_URL = `https://softimgfile.s3.amazonaws.com`

async function serveAsset(event) {
  const url = new URL(event.request.url)
  const cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    response = await fetch(`${BUCKET_URL}${url.pathname}`)
    const headers = { 'cache-control': 'public, max-age=2592000' }
    response = new Response(response.body, { ...response, headers })
    event.waitUntil(cache.put(event.request, response.clone()))
  }
  return response
}

async function handleRequest(event) {
  if (event.request.method === 'GET') {
    let response = await serveAsset(event)
    if (response.status > 399) {
      const url = new URL(event.request.url)
      const cache = caches.default
      response = await fetch(`${ORIGIN_URL}${url.pathname}`)
      const headers = { 'cache-control': 'public, max-age=2592000' }
      response = new Response(response.body, { ...response, headers })
      event.waitUntil(cache.put(event.request, response.clone()))
      if (response.status > 399) {
        response = new Response(response.statusText, { status: response.status })
      }
    }
    return response
  } else {
    return new Response('Method not allowed', { status: 405 })
  }
}
