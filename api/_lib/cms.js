import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import sanitizeHtml from 'sanitize-html'
import { supabase } from './ebook.js'

const scrypt = promisify(scryptCallback)
export const SESSION_COOKIE = 'praxia_cms_session'
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.radarpraxia.com'

export const DEFAULT_DOC = { type: 'doc', content: [{ type: 'paragraph', content: [] }] }

export function hashToken(value) {
  return createHash('sha256').update(value).digest('hex')
}

export async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  if (typeof password !== 'string' || password.length < 12) throw new Error('A senha precisa ter pelo menos 12 caracteres')
  const derived = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })
  return { hash: Buffer.from(derived).toString('hex'), salt }
}

export async function verifyPassword(password, salt, expectedHash) {
  const derived = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })
  const actual = Buffer.from(derived)
  const expected = Buffer.from(expectedHash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const separator = part.indexOf('=')
    return [decodeURIComponent(part.slice(0, separator)), decodeURIComponent(part.slice(separator + 1))]
  }))
}

export function clientIp(request) {
  return (request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim()
}

export function clientFingerprint(request) {
  return hashToken(`${clientIp(request)}:${process.env.CMS_AUDIT_PEPPER || 'praxia-cms'}`)
}

export function sessionCookie(token, expiresAt) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly${secure}; SameSite=Strict; Expires=${expiresAt.toUTCString()}`
}

export function clearSessionCookie() {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`
}

export function validateMutationOrigin(request) {
  const origin = request.headers.origin
  if (!origin) return true
  try {
    const parsed = new URL(origin)
    const configured = new URL(SITE_URL)
    const productionHosts = new Set(['radarpraxia.com', 'www.radarpraxia.com', 'radarpraxia.com.br', 'www.radarpraxia.com.br'])
    if (parsed.protocol === 'https:' && (parsed.hostname === configured.hostname || productionHosts.has(parsed.hostname))) return true
    return parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname) && parsed.port === '5173'
  } catch {
    return false
  }
}

export async function audit(action, userId = null, entityType = null, entityId = null, metadata = {}) {
  await supabase('/rest/v1/cms_audit_logs', {
    method: 'POST',
    headers: { prefer: 'return=minimal' },
    body: JSON.stringify({ user_id: userId, action, entity_type: entityType, entity_id: entityId, metadata }),
  })
}

export async function getSession(request, { csrf = false, roles } = {}) {
  const token = parseCookies(request)[SESSION_COOKIE]
  if (!token) return null
  const response = await supabase(`/rest/v1/cms_sessions?token_hash=eq.${hashToken(token)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=id,user_id,csrf_token_hash,expires_at,cms_profiles(id,username,display_name,role,is_active)&limit=1`)
  if (!response.ok) return null
  const [session] = await response.json()
  const profile = session?.cms_profiles
  if (!session || !profile?.is_active || (roles && !roles.includes(profile.role))) return null
  if (csrf) {
    const supplied = request.headers['x-csrf-token']
    if (!supplied || hashToken(supplied) !== session.csrf_token_hash || !validateMutationOrigin(request)) return null
  }
  return { id: session.id, userId: session.user_id, csrfHash: session.csrf_token_hash, expiresAt: session.expires_at, user: profile }
}

export async function requireSession(request, response, options) {
  const session = await getSession(request, options)
  if (!session) {
    response.status(401).setHeader('content-type', 'application/json; charset=utf-8').end(JSON.stringify({ error: 'Sua sessão expirou. Entre novamente.' }))
    return null
  }
  return session
}

export function slugify(value = '') {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-')
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function renderMarks(text, marks = []) {
  return marks.reduce((result, mark) => {
    if (mark.type === 'bold') return `<strong>${result}</strong>`
    if (mark.type === 'italic') return `<em>${result}</em>`
    if (mark.type === 'highlight') return `<mark>${result}</mark>`
    if (mark.type === 'link' && /^https?:\/\//.test(mark.attrs?.href || '') || mark.type === 'link' && (mark.attrs?.href || '').startsWith('/')) return `<a href="${escapeHtml(mark.attrs.href)}">${result}</a>`
    return result
  }, escapeHtml(text))
}

export function plainTextFromDoc(node) {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.type === 'hardBreak') return '\n'
  return (node.content || []).map(plainTextFromDoc).join(node.type === 'paragraph' || node.type === 'heading' ? '\n' : '')
}

function renderNode(node) {
  const children = (node.content || []).map(renderNode).join('')
  if (node.type === 'text') return renderMarks(node.text || '', node.marks)
  if (node.type === 'doc') return children
  if (node.type === 'paragraph') return `<p>${children}</p>`
  if (node.type === 'heading') {
    const level = node.attrs?.level === 3 ? 3 : 2
    const id = node.attrs?.id || slugify(plainTextFromDoc(node))
    return `<h${level} id="${escapeHtml(id)}">${children}</h${level}>`
  }
  if (node.type === 'bulletList') return `<ul>${children}</ul>`
  if (node.type === 'orderedList') return `<ol>${children}</ol>`
  if (node.type === 'listItem') return `<li>${children}</li>`
  if (node.type === 'blockquote') return `<blockquote>${children}</blockquote>`
  if (node.type === 'horizontalRule') return '<hr>'
  if (node.type === 'hardBreak') return '<br>'
  if (node.type === 'table') return `<div class="article-table-scroll"><table>${children}</table></div>`
  if (node.type === 'tableRow') return `<tr>${children}</tr>`
  if (node.type === 'tableHeader') return `<th>${children}</th>`
  if (node.type === 'tableCell') return `<td>${children}</td>`
  return children
}

export function sanitizeArticleHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'mark', 'a', 'hr', 'br', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: { h2: ['id'], h3: ['id'], a: ['href', 'target', 'rel'], div: ['class'] },
    allowedSchemes: ['http', 'https'],
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  })
}

export function renderContentJson(contentJson) {
  const doc = structuredClone(contentJson?.doc || contentJson || DEFAULT_DOC)
  const used = new Map()
  for (const node of doc.content || []) {
    if (node.type !== 'heading' || ![2, 3].includes(node.attrs?.level)) continue
    const base = slugify(plainTextFromDoc(node)) || 'secao'
    const count = (used.get(base) || 0) + 1
    used.set(base, count)
    node.attrs = { ...(node.attrs || {}), id: count === 1 ? base : `${base}-${count}` }
  }
  return sanitizeArticleHtml(renderNode(doc).replace(/<p>\s*\[IMAGEM DE CAPA[^<]*<\/p>/giu, ''))
}

export function extractHeadings(contentJson) {
  const doc = contentJson?.doc || contentJson || DEFAULT_DOC
  const used = new Map()
  return (doc.content || []).filter((node) => node.type === 'heading' && [2, 3].includes(node.attrs?.level)).map((node) => {
    const label = plainTextFromDoc(node).trim()
    const base = slugify(label) || 'secao'
    const count = (used.get(base) || 0) + 1
    used.set(base, count)
    return { id: count === 1 ? base : `${base}-${count}`, label, level: node.attrs.level }
  })
}

function paragraphText(node) {
  return plainTextFromDoc(node).trim()
}

function paragraphWithoutPrefix(node, pattern) {
  const copy = structuredClone(node)
  const first = copy.content?.find((item) => item.type === 'text')
  if (first) first.text = (first.text || '').replace(pattern, '')
  return copy
}

export function standardizeArticleStructure(contentJson) {
  const source = structuredClone(contentJson?.doc || contentJson || DEFAULT_DOC)
  const output = []
  const changes = []
  const content = Array.isArray(source.content) ? source.content : []
  for (let index = 0; index < content.length; index += 1) {
    const node = content[index]
    const text = paragraphText(node)
    if (node.type === 'heading') {
      const current = Number(node.attrs?.level || 2)
      const level = current <= 2 ? 2 : 3
      if (level !== current) changes.push(`Hierarquia de título ajustada para H${level}`)
      output.push({ ...node, attrs: { ...(node.attrs || {}), level } })
      continue
    }
    if (node.type === 'paragraph' && /^###\s+/.test(text)) {
      output.push({ ...paragraphWithoutPrefix(node, /^###\s+/), type: 'heading', attrs: { level: 3 } })
      changes.push('Marcador ### convertido em subtítulo H3')
      continue
    }
    if (node.type === 'paragraph' && /^##\s+/.test(text)) {
      output.push({ ...paragraphWithoutPrefix(node, /^##\s+/), type: 'heading', attrs: { level: 2 } })
      changes.push('Marcador ## convertido em título H2')
      continue
    }
    if (node.type === 'paragraph' && /^>\s+/.test(text)) {
      output.push({ type: 'blockquote', content: [{ ...paragraphWithoutPrefix(node, /^>\s+/), type: 'paragraph' }] })
      changes.push('Marcador > convertido em citação')
      continue
    }
    const bullet = node.type === 'paragraph' && /^[-*]\s+/.test(text)
    const ordered = node.type === 'paragraph' && /^\d+[.)]\s+/.test(text)
    if (bullet || ordered) {
      const items = []
      let cursor = index
      const pattern = bullet ? /^[-*]\s+/ : /^\d+[.)]\s+/
      while (cursor < content.length && content[cursor].type === 'paragraph' && pattern.test(paragraphText(content[cursor]))) {
        items.push({ type: 'listItem', content: [{ ...paragraphWithoutPrefix(content[cursor], pattern), type: 'paragraph' }] })
        cursor += 1
      }
      output.push({ type: bullet ? 'bulletList' : 'orderedList', content: items })
      changes.push(`${items.length} item(ns) convertido(s) em lista ${bullet ? 'com marcadores' : 'numerada'}`)
      index = cursor - 1
      continue
    }
    if (node.type === 'paragraph' && !text && output.at(-1)?.type === 'paragraph' && !paragraphText(output.at(-1))) {
      changes.push('Espaçamento vazio duplicado removido')
      continue
    }
    output.push(node)
  }
  return { doc: { ...source, type: 'doc', content: output }, changes }
}

const CATEGORY_RULES = [
  ['etica', /privacidade|dados|ética|segurança|viés|autoria/i],
  ['avaliacao', /avaliação|rubrica|nota|evidência|feedback/i],
  ['planejamento', /planejamento|objetivo|atividade|sequência didática/i],
  ['ferramentas', /ferramenta|plataforma|aplicativo|software/i],
  ['competencias-docentes', /competência|formação docente|desenvolvimento profissional/i],
  ['pesquisa', /pesquisa|estudo|evidência científica|referência/i],
]

export function prepareArticle({ title = '', content_json: contentJson, content_text = '', categories = [] }) {
  const text = (content_text || plainTextFromDoc(contentJson?.doc || contentJson)).replace(/\[IMAGEM DE CAPA[^\]]*\]/giu, '').trim()
  const categorySlug = CATEGORY_RULES.find(([, pattern]) => pattern.test(`${title} ${text}`))?.[0] || 'ia-para-professores'
  const category = categories.find((item) => item.slug === categorySlug) || categories[0]
  const paragraphs = text.split(/\n+/).map((item) => item.trim()).filter((item) => item.length > 50)
  const excerpt = (paragraphs[0] || text).slice(0, 230).replace(/\s+\S*$/, '').trim()
  const metaDescription = (excerpt || `Entenda ${title.toLowerCase()} e conheça critérios para aplicar esse tema à prática docente.`).slice(0, 160)
  const questions = []
  const lines = text.split(/\n+/).map((item) => item.trim()).filter(Boolean)
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (lines[index].endsWith('?') && !lines[index + 1].endsWith('?') && lines[index + 1].length > 25) questions.push({ question: lines[index], answer: lines[index + 1] })
  }
  return {
    category_id: category?.id || null,
    category_slug: category?.slug || categorySlug,
    slug: slugify(title),
    meta_title: `${title.slice(0, 52).trim()} | PraxIA`,
    meta_description: metaDescription,
    excerpt,
    cover_image_alt: `Capa do artigo ${title}, da PraxIA`,
    faq_json: questions.slice(0, 8),
  }
}

export function normalizeArticlePayload(body, session, current = null) {
  const contentJson = body.content_json?.type === 'doc' ? { doc: body.content_json } : body.content_json || { doc: DEFAULT_DOC }
  const text = plainTextFromDoc(contentJson.doc)
  const title = (body.title || '').trim()
  const slug = slugify(body.slug || title)
  const publishedAt = body.status === 'published' ? current?.published_at || body.published_at || new Date().toISOString() : body.published_at || current?.published_at || null
  return {
    title,
    slug,
    excerpt: (body.excerpt || '').trim(),
    content_json: contentJson,
    content_html: renderContentJson(contentJson),
    image_instruction: (body.image_instruction || '').trim(),
    cover_image_alt: (body.cover_image_alt || '').trim(),
    category_id: body.category_id || null,
    author_id: body.author_id || current?.author_id || session.userId,
    status: body.status || current?.status || 'draft',
    meta_title: (body.meta_title || '').trim(),
    meta_description: (body.meta_description || '').trim(),
    canonical_url: body.category_slug && slug ? `${SITE_URL}/blog/${slugify(body.category_slug)}/${slug}` : '',
    keywords: Array.isArray(body.keywords) ? body.keywords.filter(Boolean).slice(0, 20) : [],
    show_table_of_contents: body.show_table_of_contents !== false,
    show_editorial_notice: Boolean(body.show_editorial_notice),
    editorial_notice_text: body.editorial_notice_text || null,
    cta_heading_id: body.cta_heading_id || null,
    cta_json: body.cta_json || null,
    protocol_json: body.protocol_json || null,
    checklist_json: Array.isArray(body.checklist_json) ? body.checklist_json : [],
    faq_json: Array.isArray(body.faq_json) ? body.faq_json.filter((item) => item?.question?.trim() && item?.answer?.trim()) : [],
    related_article_ids: Array.isArray(body.related_article_ids) ? body.related_article_ids.slice(0, 3) : [],
    legacy_related_paths: Array.isArray(body.legacy_related_paths) ? body.legacy_related_paths.slice(0, 3) : [],
    reading_time_minutes: Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 210)),
    published_at: publishedAt,
    published_by: body.status === 'published' ? session.userId : current?.published_by || null,
    updated_by: session.userId,
    updated_at: new Date().toISOString(),
  }
}

export async function getSettings() {
  const response = await supabase('/rest/v1/cms_editorial_settings?select=key,value,version')
  if (!response.ok) throw new Error('Não foi possível carregar as configurações editoriais')
  return Object.fromEntries((await response.json()).map((item) => [item.key, item.value]))
}

export async function getPublicArticles() {
  const response = await supabase('/rest/v1/cms_articles?status=eq.published&deleted_at=is.null&published_at=not.is.null&select=*,cms_categories(id,name,slug),cms_profiles!cms_articles_author_id_fkey(id,display_name,bio,avatar_url,professional_links)&order=published_at.desc')
  if (!response.ok) throw new Error('Não foi possível carregar os artigos')
  return response.json()
}
