import { getRegistration, createIcs } from '../workshop.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).end('Método não permitido.')
  try {
    const registration = await getRegistration(request.query?.inscricao, request.query?.token, { includePrivate: true })
    if (!registration || registration.status_pagamento !== 'pago') return response.status(404).end('Agenda não disponível.')
    response.status(200)
    response.setHeader('content-type', 'text/calendar; charset=utf-8')
    response.setHeader('content-disposition', 'attachment; filename="workshop-ia-pratica-docente.ics"')
    response.setHeader('cache-control', 'private, no-store')
    response.end(createIcs(registration.workshop_editions))
  } catch (error) {
    console.error('workshop calendar error', error)
    response.status(500).end('Não foi possível gerar a agenda.')
  }
}
