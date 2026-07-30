import { timingSafeEqual } from 'node:crypto'
import { supabase } from './ebook.js'

const RSS_URL = process.env.PRAXIA_RSS_URL || 'https://www.radarpraxia.com/rss.xml'
function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function tag(xml, name) {
  return decodeXml(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '')
}

function attr(xml, name, attribute) {
  return decodeXml(xml.match(new RegExp(`<${name}[^>]*${attribute}=["']([^"']+)["'][^>]*>`, 'i'))?.[1] || '')
}

export function parseRss(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1]
    const link = tag(item, 'link')
    return {
      guid: tag(item, 'guid') || link,
      title: tag(item, 'title'),
      url: link,
      summary: tag(item, 'description').replace(/<[^>]+>/g, '').trim(),
      category: tag(item, 'category'),
      imageUrl: attr(item, 'media:content', 'url') || attr(item, 'enclosure', 'url'),
      publishedAt: tag(item, 'pubDate') || null,
    }
  }).filter((item) => item.guid && item.title && item.url)
}

function campaignSlug(url) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1) || 'artigo'
}

function trackedUrl(url, source) {
  const target = new URL(url)
  target.searchParams.set('utm_source', source)
  target.searchParams.set('utm_medium', 'social')
  target.searchParams.set('utm_campaign', `artigo_${campaignSlug(url)}`)
  return target.toString()
}

export function createDraft(article) {
  return {
    article_guid: article.guid,
    article_title: article.title,
    article_url: article.url,
    article_summary: article.summary,
    article_category: article.category,
    article_image_url: article.imageUrl || null,
    published_at: article.publishedAt,
    instagram_caption: `${article.title}\n\n${article.summary}\n\nLeia o artigo completo no link da bio.\n\n#PráxIA #InteligênciaArtificial #Educação #Professores #PráticaDocente\n\nLink de campanha: ${trackedUrl(article.url, 'instagram')}`,
    facebook_caption: `${article.title}\n\n${article.summary}\n\nLeia o artigo completo: ${trackedUrl(article.url, 'facebook')}`,
    status: 'draft',
  }
}

export async function syncRss() {
  const response = await fetch(RSS_URL, { headers: { accept: 'application/rss+xml, application/xml' } })
  if (!response.ok) throw new Error(`RSS indisponível (${response.status})`)
  const articles = parseRss(await response.text())
  if (!articles.length) throw new Error('O RSS não retornou artigos válidos')
  const drafts = articles.map(createDraft)
  const result = await supabase('/rest/v1/content_distribution?on_conflict=article_guid', {
    method: 'POST',
    headers: { prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify(drafts),
  })
  if (!result.ok) throw new Error(`Não foi possível sincronizar a fila: ${await result.text()}`)
  return { found: articles.length, created: (await result.json()).length }
}

export async function listDistribution() {
  const response = await supabase('/rest/v1/content_distribution?select=*&order=created_at.desc')
  if (!response.ok) throw new Error('Não foi possível carregar a fila')
  return response.json()
}

export async function updateDistribution(id, changes) {
  const allowed = ['instagram_caption', 'facebook_caption', 'status', 'scheduled_for', 'error_message']
  const payload = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.includes(key)))
  payload.updated_at = new Date().toISOString()
  const response = await supabase(`/rest/v1/content_distribution?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Não foi possível atualizar a publicação: ${await response.text()}`)
  return (await response.json())[0]
}

export function authorize(request, envName = 'DISTRIBUTION_ADMIN_KEY') {
  const expected = process.env[envName]
  const received = (request.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!expected || !received) return false
  const first = Buffer.from(expected)
  const second = Buffer.from(received)
  return first.length === second.length && timingSafeEqual(first, second)
}

export async function sendToMake(item) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  const apiKey = process.env.MAKE_WEBHOOK_API_KEY
  if (!webhookUrl || !apiKey) throw new Error('Webhook do Make não configurado')

  let target
  try {
    target = new URL(webhookUrl)
  } catch {
    throw new Error('MAKE_WEBHOOK_URL inválida')
  }
  if (target.protocol !== 'https:') throw new Error('MAKE_WEBHOOK_URL deve usar HTTPS')

  const response = await fetch(target, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-make-apikey': apiKey,
    },
    body: JSON.stringify({
      content_id: item.id,
      article_title: item.article_title,
      article_url: item.article_url,
      image_url: item.article_image_url,
      instagram_caption: item.instagram_caption,
      facebook_caption: item.facebook_caption,
    }),
  })
  if (!response.ok) {
    const detail = (await response.text()).trim()
    throw new Error(`Make recusou a publicação (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`)
  }
  return { status: response.status }
}

export async function publishItem(item) {
  if (!item.article_image_url) throw new Error('O artigo não possui imagem pública para publicação')

  await updateDistribution(item.id, { status: 'publishing', error_message: null })
  try {
    await sendToMake(item)
    const response = await supabase(`/rest/v1/content_distribution?id=eq.${encodeURIComponent(item.id)}`, {
      method: 'PATCH',
      headers: { prefer: 'return=representation' },
      body: JSON.stringify({
        status: 'published',
        error_message: null,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!response.ok) throw new Error('Publicação concluída, mas o histórico não pôde ser atualizado')
    return (await response.json())[0]
  } catch (error) {
    await updateDistribution(item.id, { status: 'error', error_message: error.message })
    throw error
  }
}

export async function publishDueItems() {
  const now = encodeURIComponent(new Date().toISOString())
  const response = await supabase(`/rest/v1/content_distribution?status=eq.scheduled&scheduled_for=lte.${now}&select=*`)
  if (!response.ok) throw new Error('Não foi possível consultar publicações agendadas')
  const items = await response.json()
  const results = []
  for (const item of items) {
    try {
      results.push({ id: item.id, ok: true, item: await publishItem(item) })
    } catch (error) {
      results.push({ id: item.id, ok: false, error: error.message })
    }
  }
  return results
}
