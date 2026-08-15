import { timingSafeEqual } from 'node:crypto'
import { supabase } from './ebook.js'
import { IMAGE_GENERATION_VERSION, uploadChannelImage } from './distribution-images.js'

const RSS_URL = process.env.PRAXIA_RSS_URL || 'https://www.radarpraxia.com/rss.xml'
const SOCIAL_CHANNELS = ['instagram', 'facebook', 'linkedin']
const HASHTAG_LIMITS = { instagram: 10, facebook: 5, linkedin: 5 }

const CATEGORY_HASHTAGS = {
  avaliacao: ['#AvaliaçãoDaAprendizagem', '#AvaliaçãoComIA'],
  competencias: ['#CompetênciasDocentes', '#DesenvolvimentoDocente'],
  etica: ['#ÉticaNaIA', '#AutoriaDigital'],
  ferramentas: ['#FerramentasDigitais', '#PráticaDocente'],
  planejamento: ['#PlanejamentoPedagógico', '#ObjetivosDeAprendizagem'],
  pesquisa: ['#PesquisaEmEducação', '#InovaçãoEducacional'],
}
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

function normalizedCategory(category = '') {
  return category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function generateChannelHashtags(article, channel) {
  const category = normalizedCategory(article.category)
  const topic = Object.entries(CATEGORY_HASHTAGS)
    .find(([key]) => category.includes(key))?.[1] || ['#PráticaDocente', '#IAnaEducação']
  const recurring = channel === 'instagram'
    ? ['#PraxIA', '#InteligênciaArtificial', '#Educação', '#TecnologiaNaEducação', '#FormaçãoDocente']
    : channel === 'facebook'
      ? ['#PraxIA', '#Educação', '#TecnologiaNaEducação']
      : ['#PraxIA', '#InteligênciaArtificial', '#FormaçãoDocente']
  const unique = [...new Set([...topic, ...recurring])]
  return unique.slice(0, HASHTAG_LIMITS[channel] || 5)
}

export function createLinkedinCaption(article) {
  const hashtags = generateChannelHashtags(article, 'linkedin').join(' ')
  return `${article.title}\n\n${article.summary}\n\nEsta reflexão apoia professores, gestores escolares e instituições de ensino na integração pedagogicamente intencional da inteligência artificial.\n\nLeia o conteúdo completo e compartilhe com sua equipe: ${trackedUrl(article.url, 'linkedin')}\n\n${hashtags}`
}

export function createDraft(article) {
  const instagramHashtags = generateChannelHashtags(article, 'instagram').join(' ')
  const facebookHashtags = generateChannelHashtags(article, 'facebook').join(' ')
  return {
    article_guid: article.guid,
    article_title: article.title,
    article_url: article.url,
    article_summary: article.summary,
    article_category: article.category,
    article_image_url: article.imageUrl || null,
    instagram_image_url: null,
    facebook_image_url: null,
    published_at: article.publishedAt,
    instagram_caption: `${article.title}\n\n${article.summary}\n\nLeia o artigo completo no link da bio.\n\n${instagramHashtags}\n\nLink de campanha: ${trackedUrl(article.url, 'instagram')}`,
    facebook_caption: `${article.title}\n\n${article.summary}\n\nLeia o artigo completo: ${trackedUrl(article.url, 'facebook')}\n\n${facebookHashtags}`,
    linkedin_caption: createLinkedinCaption(article),
    instagram_enabled: true,
    facebook_enabled: true,
    linkedin_enabled: true,
    status: 'draft',
    instagram_status: 'pending',
    facebook_status: 'pending',
    linkedin_status: 'pending',
  }
}

export function withGeneratedLinkedinCaption(item) {
  if (item.linkedin_caption?.trim() || item.linkedin_status === 'published') return item
  return {
    ...item,
    linkedin_caption: createLinkedinCaption({
      title: item.article_title,
      summary: item.article_summary,
      category: item.article_category,
      url: item.article_url,
    }),
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
  const created = (await result.json()).length
  const articleGuids = new Set(articles.map((article) => article.guid))
  const items = (await listDistribution()).filter((item) => articleGuids.has(item.article_guid))
  let generated = 0
  const imageErrors = []

  for (const item of items) {
    for (const channel of missingImageChannels(item)) {
      try {
        await generateChannelImage(item, channel)
        generated += 1
      } catch (error) {
        imageErrors.push({
          id: item.id,
          channel,
          error: error instanceof Error ? error.message : 'Erro ao gerar imagem',
        })
      }
    }
  }

  if (imageErrors.length) {
    throw new Error(`RSS sincronizado, mas ${imageErrors.length} imagem(ns) não puderam ser geradas: ${imageErrors[0].error}`)
  }
  return { found: articles.length, created, generated }
}

export function missingImageChannels(item) {
  return ['instagram', 'facebook'].filter((channel) => {
    if (item.status === 'published' || item[`${channel}_status`] === 'published') return false
    const imageUrl = item[`${channel}_image_url`]
    if (!imageUrl) return true
    return imageUrl.includes('/distribution-images/')
      && !imageUrl.includes(`-${IMAGE_GENERATION_VERSION}-`)
  })
}

export async function listDistribution() {
  const response = await supabase('/rest/v1/content_distribution?select=*&order=created_at.desc')
  if (!response.ok) throw new Error('Não foi possível carregar a fila')
  return (await response.json()).map(withGeneratedLinkedinCaption)
}

export async function updateDistribution(id, changes) {
  const allowed = [
    'instagram_caption', 'facebook_caption', 'linkedin_caption', 'instagram_image_url', 'facebook_image_url',
    'instagram_enabled', 'facebook_enabled', 'linkedin_enabled',
    'instagram_status', 'facebook_status', 'linkedin_status',
    'instagram_error', 'facebook_error', 'linkedin_error',
    'status', 'scheduled_for', 'error_message',
  ]
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

export function createMakePublicationPayload(item) {
  return {
    content_id: item.id,
    article_title: item.article_title,
    article_url: item.article_url,
    instagram_image_url: item.instagram_image_url,
    facebook_image_url: item.facebook_image_url,
    linkedin_image_url: item.instagram_image_url,
    instagram_caption: item.instagram_caption,
    facebook_caption: item.facebook_caption,
    linkedin_caption: item.linkedin_caption,
    publish_instagram: item.publish_channels?.includes('instagram') ?? true,
    publish_facebook: item.publish_channels?.includes('facebook') ?? true,
    publish_linkedin: item.publish_channels?.includes('linkedin') ?? true,
  }
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
    body: JSON.stringify(createMakePublicationPayload(item)),
  })
  if (!response.ok) {
    const detail = (await response.text()).trim()
    throw new Error(`Make recusou a publicação (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`)
  }
  let result = {}
  try {
    result = await response.json()
  } catch {
    // A webhook without a JSON response means the requested routes were accepted.
  }
  return { status: response.status, result }
}

export function validatePublicImageUrl(value, label) {
  if (!value) throw new Error(`${label}: adicione a imagem antes de publicar`)
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${label}: a URL da imagem é inválida`)
  }
  if (url.protocol !== 'https:') throw new Error(`${label}: a imagem deve usar uma URL HTTPS`)
  return url.toString()
}

export function validateChannelImages(item, channels = SOCIAL_CHANNELS) {
  if (channels.includes('instagram')) validatePublicImageUrl(item.instagram_image_url, 'Instagram')
  if (channels.includes('facebook')) validatePublicImageUrl(item.facebook_image_url, 'Facebook')
  if (channels.includes('linkedin')) validatePublicImageUrl(item.instagram_image_url, 'LinkedIn')
  if (
    item.instagram_image_url
    && item.facebook_image_url
    && item.instagram_image_url.trim() === item.facebook_image_url.trim()
  ) {
    throw new Error('Instagram e Facebook precisam de artes diferentes; as URLs não podem ser iguais')
  }
}

export function selectedPublicationChannels(item, requestedChannels) {
  const requested = requestedChannels || SOCIAL_CHANNELS
  return requested
    .filter((channel) => SOCIAL_CHANNELS.includes(channel))
    .filter((channel) => item[`${channel}_enabled`] !== false)
}

function channelUpdate(channels, status, error = null) {
  const changes = {}
  for (const channel of channels) {
    changes[`${channel}_status`] = status
    changes[`${channel}_error`] = error
  }
  return changes
}

export async function generateChannelImage(item, channel) {
  if (!['instagram', 'facebook'].includes(channel)) throw new Error('Canal de imagem inválido')
  const imageUrl = await uploadChannelImage(item, channel)
  return updateDistribution(item.id, {
    [`${channel}_image_url`]: imageUrl,
    [`${channel}_status`]: 'pending',
    [`${channel}_error`]: null,
    status: item.status === 'published' ? 'approved' : item.status,
  })
}

export async function publishItem(item, requestedChannels) {
  const channels = selectedPublicationChannels(item, requestedChannels)
    .filter((channel) => item[`${channel}_status`] !== 'published')
  if (!channels.length) throw new Error('Os canais selecionados já foram publicados')
  validateChannelImages(item, channels)

  await updateDistribution(item.id, {
    ...channelUpdate(channels, 'pending'),
    status: 'publishing',
    error_message: null,
  })
  try {
    const makeResponse = await sendToMake({ ...item, publish_channels: channels })
    const reported = makeResponse.result || {}
    const succeeded = channels.filter((channel) => reported[`${channel}_status`] !== 'error')
    const failed = channels.filter((channel) => reported[`${channel}_status`] === 'error')
    const nextStatuses = Object.fromEntries(SOCIAL_CHANNELS.map((channel) => [
      channel,
      succeeded.includes(channel) ? 'published' : failed.includes(channel) ? 'error' : item[`${channel}_status`],
    ]))
    const enabledChannels = selectedPublicationChannels(item)
    const fullyPublished = enabledChannels.every((channel) => nextStatuses[channel] === 'published')
    const response = await supabase(`/rest/v1/content_distribution?id=eq.${encodeURIComponent(item.id)}`, {
      method: 'PATCH',
      headers: { prefer: 'return=representation' },
      body: JSON.stringify({
        ...Object.fromEntries(SOCIAL_CHANNELS.flatMap((channel) => [
          [`${channel}_status`, nextStatuses[channel]],
          [`${channel}_error`, failed.includes(channel) ? (reported[`${channel}_error`] || `O Make informou erro no ${channel}`) : null],
        ])),
        status: fullyPublished ? 'published' : failed.length ? 'error' : 'approved',
        error_message: failed.length ? 'Uma rota do Make requer nova tentativa' : null,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!response.ok) throw new Error('Publicação concluída, mas o histórico não pôde ser atualizado')
    return (await response.json())[0]
  } catch (error) {
    await updateDistribution(item.id, {
      ...channelUpdate(channels, 'error', error.message),
      status: 'error',
      error_message: error.message,
    })
    throw error
  }
}

export async function publishDueItems() {
  const now = encodeURIComponent(new Date().toISOString())
  const response = await supabase(`/rest/v1/content_distribution?status=eq.scheduled&scheduled_for=lte.${now}&select=*`)
  if (!response.ok) throw new Error('Não foi possível consultar publicações agendadas')
  const items = (await response.json()).map(withGeneratedLinkedinCaption)
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
