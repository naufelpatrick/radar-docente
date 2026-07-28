import { json, readJson, supabase } from '../_lib/ebook.mjs'

const eventStatus = {
  CHECKOUT_PAID: 'paid',
  CHECKOUT_CANCELED: 'canceled',
  CHECKOUT_EXPIRED: 'expired',
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })
  if (!process.env.ASAAS_WEBHOOK_TOKEN || request.headers['asaas-access-token'] !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return json(response, 401, { error: 'Webhook não autorizado.' })
  }

  try {
    const payload = await readJson(request)
    const eventId = String(payload.id || '')
    const checkoutId = String(payload.checkout?.id || '')
    const status = eventStatus[payload.event]
    if (!eventId || !checkoutId || !status) return json(response, 200, { received: true })

    const eventInsert = await supabase('/rest/v1/ebook_webhook_events', {
      method: 'POST',
      headers: { prefer: 'return=minimal' },
      body: JSON.stringify({ id: eventId, event_type: payload.event, checkout_id: checkoutId }),
    })
    if (eventInsert.status === 409) return json(response, 200, { received: true, duplicate: true })
    if (!eventInsert.ok) throw new Error('Unable to register event')

    const updated = await supabase(`/rest/v1/ebook_orders?checkout_id=eq.${encodeURIComponent(checkoutId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        paid_at: status === 'paid' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!updated.ok) throw new Error('Unable to update order')
    return json(response, 200, { received: true })
  } catch (error) {
    console.error('asaas webhook error', error)
    return json(response, 500, { error: 'Falha ao processar webhook.' })
  }
}
