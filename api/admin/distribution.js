import { authorize, listDistribution, publishItem, syncRss, updateDistribution } from '../_lib/distribution.js'
import { json, readJson } from '../_lib/ebook.js'

export default async function handler(request, response) {
  if (!authorize(request)) return json(response, 401, { error: 'Acesso não autorizado' })
  try {
    if (request.method === 'GET') return json(response, 200, { items: await listDistribution() })
    if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido' })
    const body = await readJson(request)
    if (body.action === 'sync') return json(response, 200, await syncRss())
    if (body.action === 'update' && body.id) {
      return json(response, 200, { item: await updateDistribution(body.id, body.changes || {}) })
    }
    if (body.action === 'publish' && body.id) {
      const item = (await listDistribution()).find((candidate) => candidate.id === body.id)
      if (!item) return json(response, 404, { error: 'Publicação não encontrada' })
      return json(response, 200, { item: await publishItem(item) })
    }
    return json(response, 400, { error: 'Ação inválida' })
  } catch (error) {
    return json(response, 500, { error: error instanceof Error ? error.message : 'Erro inesperado' })
  }
}
