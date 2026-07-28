import {
  EBOOK_PRICE,
  SITE_URL,
  accessHash,
  createOrderIdentity,
  json,
  readJson,
  supabase,
} from '../_lib/ebook.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })

  try {
    const { name = '', email = '' } = await readJson(request)
    const safeName = String(name).trim().slice(0, 120)
    const safeEmail = String(email).trim().toLowerCase().slice(0, 180)
    if (safeName.length < 3 || !emailPattern.test(safeEmail)) {
      return json(response, 400, { error: 'Informe nome e e-mail válidos.' })
    }

    const { id, token } = createOrderIdentity()
    const created = await supabase('/rest/v1/ebook_orders', {
      method: 'POST',
      headers: { prefer: 'return=minimal' },
      body: JSON.stringify({
        id,
        buyer_name: safeName,
        buyer_email: safeEmail,
        amount: EBOOK_PRICE,
        status: 'pending',
        access_token_hash: accessHash(token),
        privacy_notice_acknowledged: true,
      }),
    })
    if (!created.ok) throw new Error('Unable to create order')

    const query = `pedido=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
    const asaasResponse = await fetch(`${process.env.ASAAS_API_URL || 'https://api.asaas.com/v3'}/checkouts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        access_token: process.env.ASAAS_API_KEY || '',
        'content-type': 'application/json',
        'user-agent': 'PraxIA-Ebook/1.0 (Node.js; production)',
      },
      body: JSON.stringify({
        billingTypes: ['PIX', 'CREDIT_CARD'],
        chargeTypes: ['DETACHED'],
        minutesToExpire: 60,
        externalReference: id,
        callback: {
          successUrl: `${SITE_URL}/ebook/obrigado?${query}`,
          cancelUrl: `${SITE_URL}/ebook?pagamento=cancelado`,
          expiredUrl: `${SITE_URL}/ebook?pagamento=expirado`,
        },
        items: [{
          externalReference: 'ebook-ia-na-pratica-docente-01',
          name: 'IA na prática docente',
          description: 'Caderno PráxIA com 12 atividades, 3 sequências didáticas e instrumentos.',
          quantity: 1,
          value: EBOOK_PRICE,
        }],
        customerData: { name: safeName, email: safeEmail },
      }),
    })
    const checkout = await asaasResponse.json()
    if (!asaasResponse.ok || !checkout.id) {
      await supabase(`/rest/v1/ebook_orders?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'failed' }),
      })
      return json(response, 502, { error: 'Não foi possível iniciar o pagamento. Tente novamente.' })
    }

    const updated = await supabase(`/rest/v1/ebook_orders?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ checkout_id: checkout.id }),
    })
    if (!updated.ok) throw new Error('Unable to save checkout')

    const checkoutUrl = checkout.link || `https://asaas.com/checkoutSession/show?id=${encodeURIComponent(checkout.id)}`
    return json(response, 201, { checkoutUrl })
  } catch (error) {
    console.error('ebook checkout error', error)
    return json(response, 500, { error: 'Não foi possível iniciar o pagamento agora.' })
  }
}
