import { json } from '../_lib/ebook.js'
import { getEdition } from '../_lib/workshop.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido.' })
  try {
    const edition = await getEdition(String(request.query?.slug || ''))
    if (!edition) return json(response, 404, { error: 'Turma não encontrada.' })
    return json(response, 200, { edition })
  } catch (error) {
    console.error('workshop edition error', error)
    return json(response, 503, { error: 'Não foi possível carregar esta turma.' })
  }
}

