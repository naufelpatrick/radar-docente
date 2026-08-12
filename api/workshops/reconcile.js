import { json, supabase } from '../_lib/ebook.js'
import { processWorkshopPayment, removePaidRegistrantFromWaitlist } from '../webhooks/asaas.js'

const paidEvents = {
  RECEIVED: 'PAYMENT_RECEIVED',
  CONFIRMED: 'PAYMENT_CONFIRMED',
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })
  const authorization = String(request.headers.authorization || '')
  if (!process.env.WORKSHOP_RECONCILE_TOKEN || authorization !== `Bearer ${process.env.WORKSHOP_RECONCILE_TOKEN}`) {
    return json(response, 401, { error: 'Não autorizado.' })
  }

  try {
    const paidResponse = await supabase('/rest/v1/workshop_registrations?status_pagamento=eq.pago&select=email&order=created_at.desc&limit=1000')
    if (!paidResponse.ok) throw new Error('Unable to list paid workshop registrations')
    const paidRegistrations = await paidResponse.json()
    let removedFromWaitlist = 0
    for (const registration of paidRegistrations) {
      removedFromWaitlist += await removePaidRegistrantFromWaitlist(registration.email)
    }

    const pendingResponse = await supabase('/rest/v1/workshop_registrations?status_pagamento=eq.aguardando_pagamento&asaas_payment_id=not.is.null&select=id,asaas_payment_id&order=created_at.desc&limit=20')
    if (!pendingResponse.ok) throw new Error('Unable to list pending workshop registrations')
    const pending = await pendingResponse.json()
    const apiUrl = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3'
    const headers = { accept: 'application/json', access_token: process.env.ASAAS_API_KEY || '', 'user-agent': 'PraxIA-Workshop/1.0' }
    let confirmed = 0

    for (const registration of pending) {
      const paymentResponse = await fetch(`${apiUrl}/payments/${encodeURIComponent(registration.asaas_payment_id)}`, { headers })
      if (!paymentResponse.ok) continue
      const payment = await paymentResponse.json()
      const event = paidEvents[payment.status]
      if (!event) continue
      payment.externalReference ||= registration.id
      await processWorkshopPayment({ event, payment }, `reconcile-${payment.id}-${payment.status}`)
      confirmed += 1
    }

    return json(response, 200, { checked: pending.length, confirmed, removedFromWaitlist })
  } catch (error) {
    console.error('workshop reconciliation error', error)
    return json(response, 500, { error: 'Falha ao reconciliar inscrições.' })
  }
}
