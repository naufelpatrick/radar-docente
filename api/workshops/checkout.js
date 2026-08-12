import { SITE_URL, json, readJson, supabase } from '../_lib/ebook.js'
import { WORKSHOP_RETURN_PATH, WORKSHOP_SLUG, accessHash, cleanEmail, cleanText, createRegistrationIdentity, digits, getEdition, validCpf, validEmail } from '../_lib/workshop.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })
  try {
    const body = await readJson(request)
    const nome = cleanText(body.nome, 160)
    const email = cleanEmail(body.email)
    const cpf = digits(body.cpf)
    const telefone = digits(body.telefone).slice(0, 13)
    if (nome.length < 3) return json(response, 400, { error: 'Informe seu nome completo.' })
    if (!validEmail(email)) return json(response, 400, { error: 'Informe um e-mail válido.' })
    if (!validCpf(cpf)) return json(response, 400, { error: 'Informe um CPF válido.' })
    if (telefone.length < 10) return json(response, 400, { error: 'Informe um telefone com DDD.' })

    const edition = await getEdition(String(body.workshopSlug || WORKSHOP_SLUG), { includePrivate: true })
    if (!edition || edition.status !== 'inscricoes_abertas') return json(response, 409, { error: 'As inscrições para esta turma não estão abertas.' })
    const { id, token } = createRegistrationIdentity()
    const created = await supabase('/rest/v1/workshop_registrations', {
      method: 'POST', headers: { prefer: 'return=minimal' }, body: JSON.stringify({
        id, workshop_id: edition.id, nome, email, cpf, telefone, valor: edition.valor,
        status_pagamento: 'aguardando_pagamento', access_token_hash: accessHash(token), access_token_secret: token,
      }),
    })
    if (created.status === 409) return json(response, 409, { error: 'Já existe uma inscrição para este e-mail ou CPF nesta turma.' })
    if (!created.ok) throw new Error(`Unable to create workshop registration: ${created.status}`)

    const apiUrl = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3'
    const headers = { accept: 'application/json', access_token: process.env.ASAAS_API_KEY || '', 'content-type': 'application/json', 'user-agent': 'PraxIA-Workshop/1.0' }
    let customers = await fetch(`${apiUrl}/customers?cpfCnpj=${encodeURIComponent(cpf)}&limit=1`, { headers })
    let customerPayload = await customers.json()
    let customerId = customerPayload.data?.[0]?.id
    if (!customers.ok) throw new Error(`ASAAS customer lookup failed: ${customers.status}`)
    if (!customerId) {
      customers = await fetch(`${apiUrl}/customers`, { method: 'POST', headers, body: JSON.stringify({ name: nome, email, cpfCnpj: cpf, mobilePhone: telefone, externalReference: id }) })
      customerPayload = await customers.json()
      customerId = customerPayload.id
      if (!customers.ok || !customerId) throw new Error(`ASAAS customer creation failed: ${customers.status}`)
    }

    const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 2)
    const paymentResponse = await fetch(`${apiUrl}/payments`, {
      method: 'POST', headers, body: JSON.stringify({
        customer: customerId, billingType: 'UNDEFINED', value: Number(edition.valor), dueDate: dueDate.toISOString().slice(0, 10),
        description: edition.titulo, externalReference: id,
        callback: { successUrl: `${SITE_URL}${WORKSHOP_RETURN_PATH}?inscricao=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`, autoRedirect: true },
      }),
    })
    const payment = await paymentResponse.json()
    if (!paymentResponse.ok || !payment.id || !payment.invoiceUrl) {
      console.error('asaas workshop payment rejected', { status: paymentResponse.status, errors: payment.errors })
      await supabase(`/rest/v1/workshop_registrations?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status_pagamento: 'falhou' }) })
      return json(response, 502, { error: 'Não foi possível iniciar o pagamento. Tente novamente.' })
    }
    const updated = await supabase(`/rest/v1/workshop_registrations?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ asaas_customer_id: customerId, asaas_payment_id: payment.id }) })
    if (!updated.ok) throw new Error('Unable to link ASAAS payment')
    return json(response, 201, { checkoutUrl: payment.invoiceUrl, confirmationUrl: `${WORKSHOP_RETURN_PATH}?inscricao=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}` })
  } catch (error) {
    console.error('workshop checkout error', error)
    return json(response, 500, { error: 'Não foi possível iniciar sua inscrição agora.' })
  }
}

