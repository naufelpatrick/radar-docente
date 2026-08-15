import { audit, getSettings, normalizeArticlePayload, prepareArticle, requireSession, standardizeArticleStructure } from '../_lib/cms.js'
import { json, readJson, supabase } from '../_lib/ebook.js'

const articleSelect = '*,cms_categories(id,name,slug),author:cms_profiles!cms_articles_author_id_fkey(id,username,display_name,role),creator:cms_profiles!cms_articles_created_by_fkey(id,display_name),updater:cms_profiles!cms_articles_updated_by_fkey(id,display_name),publisher:cms_profiles!cms_articles_published_by_fkey(id,display_name)'

async function categories() {
  const response = await supabase('/rest/v1/cms_categories?is_active=eq.true&select=*&order=name')
  if (!response.ok) throw new Error('Não foi possível carregar as categorias')
  return response.json()
}

async function profiles() {
  const response = await supabase('/rest/v1/cms_profiles?is_active=eq.true&select=id,username,display_name,role&order=display_name')
  if (!response.ok) throw new Error('Não foi possível carregar os autores')
  return response.json()
}

async function listArticles() {
  const response = await supabase(`/rest/v1/cms_articles?deleted_at=is.null&select=${encodeURIComponent(articleSelect)}&order=updated_at.desc`)
  if (!response.ok) throw new Error(`Não foi possível carregar os artigos: ${await response.text()}`)
  return response.json()
}

async function getArticle(id) {
  const response = await supabase(`/rest/v1/cms_articles?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=${encodeURIComponent(articleSelect)}&limit=1`)
  if (!response.ok) throw new Error('Não foi possível carregar o artigo')
  return (await response.json())[0] || null
}

function publicationErrors(article) {
  const errors = []
  if (!article.title) errors.push('Informe o título.')
  if (!article.category_id) errors.push('Selecione uma categoria.')
  if (!article.meta_title || !article.meta_description || !article.excerpt) errors.push('Revise os dados de SEO e publicação.')
  if (!article.cover_image_url || !['approved', 'uploaded'].includes(article.cover_image_status)) errors.push('Aprove ou envie uma imagem de capa antes de publicar.')
  if (!article.cover_image_alt) errors.push('Informe o texto alternativo da imagem.')
  if (!article.content_html || article.content_html.length < 100) errors.push('O texto do artigo está incompleto.')
  return errors
}

async function saveArticle(body, session) {
  const current = body.id ? await getArticle(body.id) : null
  if ((body.status === 'archived' || current?.status === 'archived') && session.user.role !== 'admin') throw new Error('Somente administradores podem arquivar ou restaurar artigos.')
  if (session.user.role !== 'admin' && body.author_id && body.author_id !== (current?.author_id || session.userId)) throw new Error('Somente administradores podem alterar a autoria.')
  const categoryList = await categories()
  const category = categoryList.find((item) => item.id === body.category_id)
  const payload = normalizeArticlePayload({ ...body, category_slug: category?.slug }, session, current)
  if (!payload.title && body.status === 'published') throw new Error('Informe o título antes de publicar.')
  if (current?.status === 'published' && current.canonical_url && payload.canonical_url && current.canonical_url !== payload.canonical_url) {
    const oldPath = new URL(current.canonical_url).pathname
    await supabase('/rest/v1/cms_article_redirects?on_conflict=old_path', { method: 'POST', headers: { prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ old_path: oldPath, article_id: current.id, created_by: session.userId }) })
  }
  if (payload.status === 'published') {
    const candidate = { ...current, ...payload }
    const errors = publicationErrors(candidate)
    if (errors.length) throw new Error(errors.join(' '))
  }
  let response
  if (current) {
    response = await supabase(`/rest/v1/cms_articles?id=eq.${current.id}`, { method: 'PATCH', headers: { prefer: 'return=representation' }, body: JSON.stringify(payload) })
  } else {
    response = await supabase('/rest/v1/cms_articles', {
      method: 'POST', headers: { prefer: 'return=representation' },
      body: JSON.stringify({ ...payload, author_id: session.userId, created_by: session.userId, updated_by: session.userId }),
    })
  }
  if (!response.ok) {
    const detail = await response.text()
    if (detail.includes('cms_articles_category_id_slug_key')) throw new Error('Este slug já está sendo utilizado nesta categoria.')
    throw new Error(`Não foi possível salvar o artigo: ${detail.slice(0, 240)}`)
  }
  const [saved] = await response.json()
  const action = !current ? 'article_created' : payload.status === 'published' && current.status !== 'published' ? 'article_published' : current.status === 'published' && payload.status === 'draft' ? 'article_unpublished' : payload.status === 'archived' ? 'article_archived' : 'article_updated'
  await audit(action, session.userId, 'article', saved.id, { status: saved.status })
  return getArticle(saved.id)
}

async function duplicateArticle(id, session) {
  const source = await getArticle(id)
  if (!source) throw new Error('Artigo não encontrado')
  const copy = normalizeArticlePayload({ ...source, title: `${source.title} — cópia`, slug: `${source.slug}-copia`, status: 'draft', published_at: null, category_slug: source.cms_categories?.slug }, session)
  const response = await supabase('/rest/v1/cms_articles', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify({ ...copy, author_id: session.userId, created_by: session.userId, updated_by: session.userId, cover_image_status: 'missing', cover_image_url: null, cover_image_webp_url: null }) })
  if (!response.ok) throw new Error('Não foi possível duplicar o artigo')
  const [saved] = await response.json()
  await audit('article_created', session.userId, 'article', saved.id, { duplicated_from: id })
  return getArticle(saved.id)
}

async function saveSettings(body, session) {
  if (session.user.role !== 'admin') throw new Error('Somente administradores podem alterar as configurações.')
  for (const [key, value] of Object.entries(body.settings || {})) {
    await supabase('/rest/v1/cms_editorial_settings?on_conflict=key', { method: 'POST', headers: { prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ key, value, updated_by: session.userId, updated_at: new Date().toISOString() }) })
  }
  await audit('settings_updated', session.userId, 'settings')
  return getSettings()
}

export default async function handler(request, response) {
  const mutation = request.method !== 'GET'
  const session = await requireSession(request, response, { csrf: mutation })
  if (!session) return
  try {
    if (request.method === 'GET') {
      const id = request.query?.id
      return json(response, 200, { article: id ? await getArticle(id) : null, articles: await listArticles(), categories: await categories(), profiles: await profiles(), settings: await getSettings(), user: session.user })
    }
    if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido' })
    const body = await readJson(request)
    if (body.action === 'prepare') return json(response, 200, { suggestions: prepareArticle({ ...body.article, categories: await categories() }) })
    if (body.action === 'standardize') return json(response, 200, standardizeArticleStructure(body.article?.content_json))
    if (body.action === 'save') return json(response, 200, { article: await saveArticle(body.article || {}, session) })
    if (body.action === 'duplicate') return json(response, 200, { article: await duplicateArticle(body.id, session) })
    if (body.action === 'settings') return json(response, 200, { settings: await saveSettings(body, session) })
    if (body.action === 'category') {
      if (session.user.role !== 'admin') return json(response, 403, { error: 'Somente administradores podem criar categorias.' })
      const categoryResponse = await supabase('/rest/v1/cms_categories', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify({ name: body.name, slug: body.slug, description: body.description || '', created_by: session.userId }) })
      if (!categoryResponse.ok) throw new Error('Não foi possível criar a categoria')
      return json(response, 200, { category: (await categoryResponse.json())[0] })
    }
    if (body.action === 'delete') {
      if (session.user.role !== 'admin') return json(response, 403, { error: 'Somente administradores podem excluir artigos.' })
      const deleteResponse = await supabase(`/rest/v1/cms_articles?id=eq.${encodeURIComponent(body.id)}`, { method: 'PATCH', headers: { prefer: 'return=minimal' }, body: JSON.stringify({ deleted_at: new Date().toISOString(), updated_by: session.userId, updated_at: new Date().toISOString() }) })
      if (!deleteResponse.ok) throw new Error('Não foi possível excluir o artigo')
      await audit('article_deleted', session.userId, 'article', body.id)
      return json(response, 200, { ok: true })
    }
    return json(response, 400, { error: 'Ação inválida' })
  } catch (error) {
    return json(response, 400, { error: error instanceof Error ? error.message : 'Não foi possível concluir a ação' })
  }
}
