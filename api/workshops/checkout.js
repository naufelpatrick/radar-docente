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
    let { id, token } = createRegistrationIdentity()
    const created = await supabase('/rest/v1/workshop_registrations', {
      method: 'POST', headers: { prefer: 'return=minimal' }, body: JSON.stringify({
        id, workshop_id: edition.id, nome, email, cpf, telefone, valor: edition.valor,
        status_pagamento: 'aguardando_pagamento', access_token_hash: accessHash(token), access_token_secret: token,
      }),
    })
    let registrationReady = created.ok
    if (created.status === 409) {
      const lookup = await supabase(`/rest/v1/workshop_registrations?workshop_id=eq.${edition.id}&or=(email.eq.${encodeURIComponent(email)},cpf.eq.${cpf})&select=id,status_pagamento,asaas_payment_id&limit=1`)
      if (!lookup.ok) throw new Error('Unable to inspect existing workshop registration')
      const [existing] = await lookup.json()
      const retryable = existing && (
        ['falhou', 'cancelado', 'expirado'].includes(existing.status_pagamento)
        || (existing.status_pagamento === 'aguardando_pagamento' && !existing.asaas_payment_id)
      )
      if (!retryable) {
        return json(response, 409, { error: 'Já existe uma inscrição para este e-mail ou CPF nesta turma.' })
      }
      id = existing.id
      ;({ token } = createRegistrationIdentity())
      const reset = await supabase(`/rest/v1/workshop_registrations?id=eq.${id}`, {
        method: 'PATCH', body: JSON.stringify({
          nome, email, cpf, telefone, valor: edition.valor, status_pagamento: 'aguardando_pagamento',
          asaas_customer_id: null, asaas_payment_id: null, data_pagamento: null,
          access_token_hash: accessHash(token), access_token_secret: token, updated_at: new Date().toISOString(),
        }),
      })
      if (!reset.ok) throw new Error('Unable to reset failed workshop registration')
      registrationReady = true
    }
    if (!registrationReady) throw new Error(`Unable to create workshop registration: ${created.status}`)

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
    const paymentPayload = {
      customer: customerId, billingType: 'UNDEFINED', value: Number(edition.valor), dueDate: dueDate.toISOString().slice(0, 10),
      description: edition.titulo, externalReference: id,
      callback: { successUrl: `${SITE_URL}${WORKSHOP_RETURN_PATH}?inscricao=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`, autoRedirect: true },
    }
    let paymentResponse = await fetch(`${apiUrl}/payments`, { method: 'POST', headers, body: JSON.stringify(paymentPayload) })
    let payment = await paymentResponse.json()
    const callbackDomainRejected = paymentResponse.status === 400 && payment.errors?.some((error) => error.code === 'invalid_object' && /URL|domínio/i.test(error.description || ''))
    if (callbackDomainRejected) {
      const paymentWithoutCallback = { ...paymentPayload }
      delete paymentWithoutCallback.callback
      paymentResponse = await fetch(`${apiUrl}/payments`, { method: 'POST', headers, body: JSON.stringify(paymentWithoutCallback) })
      payment = await paymentResponse.json()
    }
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
