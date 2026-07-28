import { EBOOK_FILE, getOrder, json, supabase } from '../_lib/ebook.mjs'

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido.' })
  try {
    const order = await getOrder(request.query?.pedido, request.query?.token)
    if (!order || order.status !== 'paid') {
      return json(response, 403, { error: 'O download ainda não está disponível.' })
    }

    const signed = await supabase(`/storage/v1/object/sign/paid-assets/${EBOOK_FILE}`, {
      method: 'POST',
      body: JSON.stringify({ expiresIn: 300 }),
    })
    if (!signed.ok) throw new Error('Unable to sign file')
    const { signedURL } = await signed.json()
    const storageUrl = process.env.SUPABASE_URL
    response.status(302).setHeader('location', `${storageUrl}/storage/v1${signedURL}`)
    response.setHeader('cache-control', 'no-store')
    response.end()
  } catch (error) {
    console.error('ebook download error', error)
    return json(response, 500, { error: 'Não foi possível preparar o download.' })
  }
}
