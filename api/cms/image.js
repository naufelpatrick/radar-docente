import sharp from 'sharp'
import { audit, getSettings, requireSession, slugify } from '../_lib/cms.js'
import { json, readJson, supabase } from '../_lib/ebook.js'

function escapeXml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function wrapTitle(title, max = 26) {
  const lines = []
  let current = ''
  for (const word of title.trim().split(/\s+/)) {
    const next = current ? `${current} ${word}` : word
    if (current && next.length > max) { lines.push(current); current = word } else current = next
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function coverOverlay(article) {
  const lines = wrapTitle(article.title)
  const title = lines.map((line, index) => `<text x="72" y="${220 + index * 58}" fill="#fff" font-family="Arial,sans-serif" font-size="48" font-weight="700">${escapeXml(line)}</text>`).join('')
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g"><stop stop-color="#080b11"/><stop offset=".48" stop-color="#080b11" stop-opacity=".94"/><stop offset=".78" stop-color="#080b11" stop-opacity=".08"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><text x="72" y="72" fill="#fff" font-family="Arial,sans-serif" font-size="34" font-weight="700">PraxIA</text><text x="72" y="107" fill="#c8f03e" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2">INTELIGÊNCIA APLICADA À DOCÊNCIA</text><circle cx="77" cy="156" r="5" fill="#23c8d0"/><text x="93" y="161" fill="#c8f03e" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2">${escapeXml((article.cms_categories?.name || article.category_name || 'PRÁTICA DOCENTE').toUpperCase())}</text>${title}<text x="72" y="558" fill="#8c94a3" font-family="Arial,sans-serif" font-size="13">radarpraxia.com · PraxIA</text></svg>`)
}

async function brandedImages(source, article) {
  const normalized = sharp(source).resize(1200, 630, { fit: 'cover', position: 'attention' }).composite([{ input: coverOverlay(article), top: 0, left: 0 }])
  return {
    jpeg: await normalized.clone().jpeg({ quality: 91, progressive: true }).toBuffer(),
    webp: await normalized.clone().webp({ quality: 88 }).toBuffer(),
  }
}

async function upload(buffer, path, contentType) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase não configurado para armazenar imagens')
  const response = await fetch(`${url}/storage/v1/object/article-covers/${path}`, { method: 'POST', headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': contentType, 'x-upsert': 'true' }, body: buffer })
  if (!response.ok) throw new Error(`Não foi possível armazenar a imagem: ${await response.text()}`)
  return `${url}/storage/v1/object/public/article-covers/${path}`
}

async function articleById(id) {
  const response = await supabase(`/rest/v1/cms_articles?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=*,cms_categories(name,slug)&limit=1`)
  if (!response.ok) throw new Error('Não foi possível carregar o artigo')
  return (await response.json())[0]
}

async function storeCover(article, source, session, prompt = null, status = 'generated') {
  const images = await brandedImages(source, article)
  const version = Date.now()
  const base = `${slugify(article.slug || article.title)}-1200x630-${version}`
  const coverImageUrl = await upload(images.jpeg, `${base}.jpg`, 'image/jpeg')
  const coverImageWebpUrl = await upload(images.webp, `${base}.webp`, 'image/webp')
  const response = await supabase(`/rest/v1/cms_articles?id=eq.${article.id}`, {
    method: 'PATCH', headers: { prefer: 'return=representation' },
    body: JSON.stringify({ cover_image_url: coverImageUrl, cover_image_webp_url: coverImageWebpUrl, cover_image_prompt: prompt, cover_image_generated_at: new Date().toISOString(), cover_image_generated_by: session.userId, cover_image_status: status, updated_by: session.userId, updated_at: new Date().toISOString() }),
  })
  if (!response.ok) throw new Error('A imagem foi criada, mas o artigo não pôde ser atualizado')
  await audit(status === 'uploaded' ? 'image_replaced' : 'image_generated', session.userId, 'article', article.id)
  return (await response.json())[0]
}

async function generate(article, session) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('A geração de imagem ainda não está configurada. Defina OPENAI_API_KEY no servidor.')
  const settings = await getSettings()
  const prompt = `${settings.image_directive || ''}\n\nTítulo do artigo: ${article.title}\nResumo: ${article.excerpt}\nInstrução específica: ${article.image_instruction}\n\nCrie somente a ilustração de base, sem nenhum texto ou logotipo. Reserve a metade esquerda com poucos detalhes para a composição editorial da PraxIA.`
  const generated = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt, size: '1536x1024', quality: 'high', output_format: 'png', n: 1 }),
  })
  if (!generated.ok) throw new Error(`Não foi possível gerar a imagem: ${(await generated.text()).slice(0, 260)}`)
  const data = await generated.json()
  const encoded = data.data?.[0]?.b64_json
  if (!encoded) throw new Error('O serviço de imagem não retornou um arquivo válido')
  return storeCover(article, Buffer.from(encoded, 'base64'), session, prompt, 'generated')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido' })
  const session = await requireSession(request, response, { csrf: true })
  if (!session) return
  try {
    const body = await readJson(request)
    const article = await articleById(body.id)
    if (!article) return json(response, 404, { error: 'Artigo não encontrado' })
    if (body.action === 'generate') return json(response, 200, { article: await generate(article, session) })
    if (body.action === 'upload') {
      const match = (body.data_url || '').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/)
      if (!match) throw new Error('Envie uma imagem JPEG, PNG ou WebP válida.')
      const buffer = Buffer.from(match[2], 'base64')
      if (buffer.length > 8 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 8 MB.')
      return json(response, 200, { article: await storeCover(article, buffer, session, null, 'uploaded') })
    }
    if (body.action === 'approve') {
      if (!article.cover_image_url) throw new Error('Gere ou envie uma imagem antes de aprovar.')
      const update = await supabase(`/rest/v1/cms_articles?id=eq.${article.id}`, { method: 'PATCH', headers: { prefer: 'return=representation' }, body: JSON.stringify({ cover_image_status: 'approved', updated_by: session.userId, updated_at: new Date().toISOString() }) })
      await audit('image_approved', session.userId, 'article', article.id)
      return json(response, 200, { article: (await update.json())[0] })
    }
    if (body.action === 'remove') {
      const update = await supabase(`/rest/v1/cms_articles?id=eq.${article.id}`, { method: 'PATCH', headers: { prefer: 'return=representation' }, body: JSON.stringify({ cover_image_url: null, cover_image_webp_url: null, cover_image_status: 'missing', cover_image_prompt: null, updated_by: session.userId, updated_at: new Date().toISOString() }) })
      await audit('image_removed', session.userId, 'article', article.id)
      return json(response, 200, { article: (await update.json())[0] })
    }
    return json(response, 400, { error: 'Ação inválida' })
  } catch (error) {
    return json(response, 400, { error: error instanceof Error ? error.message : 'Não foi possível processar a imagem. O artigo foi mantido como rascunho.' })
  }
}
