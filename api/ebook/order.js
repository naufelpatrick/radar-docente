import { getOrder, json } from '../_lib/ebook.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido.' })
  try {
    const order = await getOrder(request.query?.pedido, request.query?.token)
    if (!order) return json(response, 404, { error: 'Pedido não encontrado.' })
    return json(response, 200, { status: order.status })
  } catch (error) {
    console.error('ebook order error', error)
    return json(response, 500, { error: 'Não foi possível consultar o pedido.' })
  }
}
