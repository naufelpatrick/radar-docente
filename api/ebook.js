import checkout from './_lib/ebook-routes/checkout.js'
import download from './_lib/ebook-routes/download.js'
import freeDownload from './_lib/ebook-routes/free-download.js'
import order from './_lib/ebook-routes/order.js'

const handlers = { checkout, download, 'free-download': freeDownload, order }

export default async function handler(request, response) {
  const action = String(request.query?.action || '')
  const route = handlers[action]
  if (!route) return response.status(404).json({ error: 'Endpoint não encontrado.' })
  return route(request, response)
}
