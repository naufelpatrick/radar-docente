import calendar from './_lib/workshop-routes/calendar.js'
import checkout from './_lib/workshop-routes/checkout.js'
import edition from './_lib/workshop-routes/edition.js'
import registration from './_lib/workshop-routes/registration.js'

const handlers = { calendar, checkout, edition, registration }

export default async function handler(request, response) {
  const action = String(request.query?.action || '')
  const route = handlers[action]
  if (!route) return response.status(404).json({ error: 'Endpoint não encontrado.' })
  return route(request, response)
}
