import { json } from '../ebook.js'
import { getRegistration, googleCalendarUrl } from '../workshop.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido.' })
  try {
    const registration = await getRegistration(request.query?.inscricao, request.query?.token, { includePrivate: true })
    if (!registration) return json(response, 404, { error: 'Inscrição não encontrada.' })
    const paid = registration.status_pagamento === 'pago'
    const edition = registration.workshop_editions
    return json(response, 200, { registration: {
      id: registration.id, nome: registration.nome, statusPagamento: registration.status_pagamento,
      valor: registration.valor, dataPagamento: registration.data_pagamento,
      edition: { id: edition.id, slug: edition.slug, titulo: edition.titulo, inicioEm: edition.inicio_em, fimEm: edition.fim_em, timezone: edition.timezone, cargaHoraria: edition.carga_horaria,
        ...(paid ? { meetingUrl: edition.meeting_url, telefoneAlternativo: edition.telefone_alternativo, meetingPin: edition.meeting_pin, googleCalendarUrl: googleCalendarUrl(edition) } : {}) },
    } })
  } catch (error) {
    console.error('workshop registration status error', error)
    return json(response, 503, { error: 'Não foi possível consultar sua inscrição.' })
  }
}
