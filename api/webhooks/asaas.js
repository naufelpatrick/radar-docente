import { json, readJson, supabase } from '../_lib/ebook.js'
import { sendConfirmationEmail } from '../_lib/workshop.js'

const eventStatus = {
  CHECKOUT_PAID: 'paid',
  CHECKOUT_CANCELED: 'canceled',
  CHECKOUT_EXPIRED: 'expired',
}

const workshopEventStatus = {
  PAYMENT_CONFIRMED: 'pago',
  PAYMENT_RECEIVED: 'pago',
  PAYMENT_OVERDUE: 'expirado',
  PAYMENT_DELETED: 'cancelado',
  PAYMENT_REFUNDED: 'cancelado',
}

export async function processWorkshopPayment(payload, eventId) {
  const paymentId = String(payload.payment?.id || '')
  const status = workshopEventStatus[payload.event]
  if (!paymentId || !status) return false
  const eventInsert = await supabase('/rest/v1/workshop_webhook_events', {
    method: 'POST', headers: { prefer: 'return=minimal' },
    body: JSON.stringify({ id: eventId, event_type: payload.event, asaas_payment_id: paymentId }),
  })
  if (eventInsert.status !== 409 && !eventInsert.ok) throw new Error('Unable to register workshop event')

  const paidAt = status === 'pago' ? (payload.payment?.confirmedDate ? `${payload.payment.confirmedDate}T12:00:00Z` : new Date().toISOString()) : null
  const fields = 'id,nome,email,status_pagamento,valor,data_pagamento,access_token_secret,workshop_editions(*)'
  const updateBody = { status_pagamento: status, data_pagamento: paidAt, updated_at: new Date().toISOString() }
  let updated = await supabase(`/rest/v1/workshop_registrations?asaas_payment_id=eq.${encodeURIComponent(paymentId)}&select=${fields}`, {
    method: 'PATCH', headers: { prefer: 'return=representation' },
    body: JSON.stringify(updateBody),
  })
  if (!updated.ok) throw new Error('Unable to update workshop registration')
  let [registration] = await updated.json()
  const externalReference = String(payload.payment?.externalReference || '')
  if (!registration && externalReference) {
    updated = await supabase(`/rest/v1/workshop_registrations?id=eq.${encodeURIComponent(externalReference)}&select=${fields}`, {
      method: 'PATCH', headers: { prefer: 'return=representation' },
      body: JSON.stringify({ ...updateBody, asaas_payment_id: paymentId }),
    })
    if (!updated.ok) throw new Error('Unable to recover workshop registration from external reference')
    ;[registration] = await updated.json()
  }
  if (!registration || status !== 'pago') return true

  const claimed = await supabase(`/rest/v1/workshop_registrations?id=eq.${registration.id}&confirmation_email_sent_at=is.null&confirmation_email_claimed_at=is.null&select=id,nome,email,status_pagamento,valor,data_pagamento,access_token_secret,workshop_editions(*)`, {
    method: 'PATCH', headers: { prefer: 'return=representation' },
    body: JSON.stringify({ confirmation_email_claimed_at: new Date().toISOString(), confirmation_email_error: null }),
  })
  if (!claimed.ok) throw new Error('Unable to claim workshop confirmation email')
  const [emailRegistration] = await claimed.json()
  if (!emailRegistration) return true
  try {
    await sendConfirmationEmail(emailRegistration)
    await supabase(`/rest/v1/workshop_registrations?id=eq.${registration.id}`, { method: 'PATCH', body: JSON.stringify({ confirmation_email_sent_at: new Date().toISOString(), confirmation_email_claimed_at: null, confirmation_email_error: null }) })
  } catch (error) {
    await supabase(`/rest/v1/workshop_registrations?id=eq.${registration.id}`, { method: 'PATCH', body: JSON.stringify({ confirmation_email_claimed_at: null, confirmation_email_error: String(error).slice(0, 1000) }) })
    throw error
  }
  return true
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })
  if (!process.env.ASAAS_WEBHOOK_TOKEN || request.headers['asaas-access-token'] !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return json(response, 401, { error: 'Webhook não autorizado.' })
  }

  try {
    const payload = await readJson(request)
    const eventId = String(payload.id || '')
    if (eventId && await processWorkshopPayment(payload, eventId)) return json(response, 200, { received: true })
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
