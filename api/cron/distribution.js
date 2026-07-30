import { authorize, publishDueItems, syncRss } from '../_lib/distribution.js'
import { json } from '../_lib/ebook.js'

export default async function handler(request, response) {
  if (!authorize(request, 'CRON_SECRET')) return json(response, 401, { error: 'Acesso não autorizado' })
  try {
    const sync = await syncRss()
    const publications = await publishDueItems()
    return json(response, 200, { sync, publications })
  } catch (error) {
    return json(response, 500, { error: error instanceof Error ? error.message : 'Erro inesperado' })
  }
}
