import { getPublicArticles, getSession } from '../_lib/cms.js'
import { json, supabase } from '../_lib/ebook.js'

const SITE_URL = 'https://www.radarpraxia.com'
const googleSwgTags = '<script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js"></script><script>self.__praxiaSwgBasicInitialized=true;(self.SWG_BASIC=self.SWG_BASIC||[]).push(basicSubscriptions=>{basicSubscriptions.init({type:"NewsArticle",isPartOfType:["Product"],isPartOfProductId:"CAowyK7hCw:openaccess",clientOptions:{theme:"light",lang:"pt-BR"}});});</script>'
const staticPaths = ['/', '/metodologia', '/fluencia-digital-para-professores', '/radar-docente', '/sobre', '/autores/patrick-naufel', '/autores/giovani-letti', '/blog', '/contato', '/privacidade', '/resultado', '/guias', '/competencias', '/ferramentas', '/para-instituicoes', '/ebook', '/mentoria']
const legacyArticlePaths = [
  '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
  '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
  '/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial',
  '/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
  '/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia',
  '/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia',
  '/blog/avaliacao/como-criar-criterios-de-avaliacao-para-atividades-com-ia',
  '/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
  '/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas',
  '/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores',
]

function escapeXml(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;') }
function escapeHtml(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;') }
function decodeXml(value = '') { return String(value).replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&amp;', '&') }

const knownAuthors = {
  'Patrick Naufel': { path: '/autores/patrick-naufel', sameAs: ['https://www.linkedin.com/in/patricknaufel', 'http://lattes.cnpq.br/0026328778886854'] },
  'Giovani Letti': { path: '/autores/giovani-letti', sameAs: ['https://www.linkedin.com/in/giovani-letti-1332a1/', 'http://lattes.cnpq.br/2124565480075229'] },
}

function renderCmsArticleContent(article, author) {
  const cover = article.cover_image_url ? `<figure><img src="${escapeHtml(article.cover_image_url)}" alt="${escapeHtml(article.cover_image_alt)}" width="1200" height="630"></figure>` : ''
  const body = article.content_html || `<p>${escapeHtml(article.excerpt)}</p>`
  return `<div id="root"><main data-prerendered-content><article><nav aria-label="Navegação estrutural"><a href="/">Início</a> / <a href="/blog">Blog</a> / <a href="/blog/categoria/${escapeHtml(article.cms_categories?.slug)}">${escapeHtml(article.cms_categories?.name)}</a></nav><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p><p>Por ${escapeHtml(author || 'PraxIA')}</p>${cover}<div>${body}</div></article></main></div>`
}

function cmsRssItems(articles) {
  return articles.map((article) => {
    const category = article.cms_categories?.name || ''
    const author = article.cms_profiles?.display_name || article.author?.display_name || ''
    return ['    <item>', `      <title>${escapeXml(article.title)}</title>`, `      <link>${escapeXml(article.canonical_url)}</link>`, `      <guid isPermaLink="true">${escapeXml(article.canonical_url)}</guid>`, `      <description>${escapeXml(article.excerpt)}</description>`, `      <category>${escapeXml(category)}</category>`, `      <dc:creator>${escapeXml(author)}</dc:creator>`, `      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>`, article.cover_image_url ? `      <media:content url="${escapeXml(article.cover_image_url)}" type="image/jpeg" medium="image" width="1200" height="630" />` : '', article.cover_image_alt ? `      <media:description>${escapeXml(article.cover_image_alt)}</media:description>` : '', `      <content:encoded><![CDATA[${article.content_html || ''}]]></content:encoded>`, '    </item>'].filter(Boolean).join('\n')
  }).join('\n')
}

async function rss(response) {
  const [legacyResponse, articles] = await Promise.all([fetch(`${SITE_URL}/feed.xml`, { headers: { accept: 'application/rss+xml' } }), getPublicArticles()])
  const legacy = legacyResponse.ok ? await legacyResponse.text() : ''
  const legacyItems = [...legacy.matchAll(/<item>[\s\S]*?<\/item>/gi)].map((match) => match[0]).join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">\n  <channel>\n    <title>Blog PraxIA</title>\n    <link>${SITE_URL}/blog</link>\n    <description>Conteúdos para professores sobre inteligência artificial, competências digitais e prática docente.</description>\n    <language>pt-BR</language>\n    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n${cmsRssItems(articles)}\n${legacyItems}\n  </channel>\n</rss>`
  response.status(200).setHeader('content-type', 'application/rss+xml; charset=utf-8').setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300').end(body)
}

function sitemapEntry(path, lastmod, priority = '0.7') { return `  <url><loc>${SITE_URL}${path}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}<changefreq>${path.startsWith('/blog') ? 'weekly' : 'monthly'}</changefreq><priority>${priority}</priority></url>` }

async function sitemap(response) {
  const articles = await getPublicArticles()
  const categoryPaths = [...new Set([
    ...legacyArticlePaths.map((path) => path.split('/')[2]),
    ...articles.map((article) => article.cms_categories?.slug).filter(Boolean),
  ])]
  const entries = new Map()
  const addEntry = (path, lastmod, priority) => entries.set(path, sitemapEntry(path, lastmod, priority))
  staticPaths.forEach((path) => addEntry(path, null, path === '/' ? '1.0' : '0.7'))
  categoryPaths.forEach((slug) => addEntry(`/blog/categoria/${slug}`, null, '0.7'))
  legacyArticlePaths.forEach((path) => addEntry(path, null, '0.8'))
  articles.forEach((article) => addEntry(new URL(article.canonical_url).pathname, article.updated_at, '0.8'))
  const rows = [...entries.values()]
  response.status(200).setHeader('content-type', 'application/xml; charset=utf-8').setHeader('cache-control', 'public, s-maxage=300').end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>`)
}

function rssField(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()) : ''
}

async function getLegacyBlogIndexItems() {
  try {
    const response = await fetch(`${SITE_URL}/feed.xml`, { headers: { accept: 'application/rss+xml' } })
    if (!response.ok) return []
    const xml = await response.text()
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
      const block = match[1]
      const link = rssField(block, 'link')
      let path = ''
      try { path = new URL(link).pathname } catch { path = link }
      return { path, title: rssField(block, 'title'), summary: rssField(block, 'description'), category: rssField(block, 'category') || 'Blog' }
    }).filter((item) => item.path && item.title)
  } catch {
    return []
  }
}

function renderBlogIndex(items) {
  const list = items.map((item) => `<li><article><p>${escapeHtml(item.category)}</p><h2><a href="${escapeHtml(item.path)}">${escapeHtml(item.title)}</a></h2>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}</article></li>`).join('')
  return `<div id="root"><main data-prerendered-content><header><h1>Ideias, critérios e perguntas para ensinar em contextos digitais e com IA.</h1><p>Conteúdos para professores sobre IA, competências digitais e prática docente.</p></header><section aria-labelledby="blog-artigos"><h2 id="blog-artigos">Artigos publicados</h2><ul>${list}</ul></section></main></div>`
}

async function blogPage(response) {
  const [shellResponse, cmsArticles, legacyArticles] = await Promise.all([
    fetch(`${SITE_URL}/index.html`, { headers: { accept: 'text/html' } }),
    getPublicArticles().catch(() => []),
    getLegacyBlogIndexItems(),
  ])
  if (!shellResponse.ok) throw new Error('Não foi possível carregar a aplicação')
  const itemsByPath = new Map(legacyArticles.map((item) => [item.path, item]))
  for (const article of cmsArticles) {
    let path = ''
    try { path = new URL(article.canonical_url).pathname } catch { continue }
    itemsByPath.set(path, { path, title: article.title, summary: article.excerpt || article.meta_description || '', category: article.cms_categories?.name || 'Blog' })
  }
  const title = 'Blog: IA, competências digitais e prática docente | PraxIA'
  const description = 'Conteúdos para professores sobre IA, competências digitais e prática docente.'
  const canonical = `${SITE_URL}/blog`
  const tags = `<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}">`
  let html = await shellResponse.text()
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta name="description"[^>]*>/i, '').replace(/<link rel="canonical"[^>]*>/i, '').replace('</head>', `${tags}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/i, renderBlogIndex([...itemsByPath.values()]))
  response.status(200).setHeader('content-type', 'text/html; charset=utf-8').setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300').end(html)
}

async function articlePage(request, response) {
  const { category, slug } = request.query || {}
  const articles = await getPublicArticles()
  const article = articles.find((item) => item.slug === slug && item.cms_categories?.slug === category)
  if (!article) return response.status(404).setHeader('content-type', 'text/html; charset=utf-8').end('<!doctype html><html lang="pt-BR"><title>Artigo não encontrado | PraxIA</title><body><h1>Artigo não encontrado</h1><p><a href="/blog">Voltar ao blog</a></p></body></html>')
  const shellResponse = await fetch(`${SITE_URL}/index.html`, { headers: { accept: 'text/html' } })
  if (!shellResponse.ok) throw new Error('Não foi possível carregar a aplicação')
  const canonical = article.canonical_url
  const author = article.cms_profiles?.display_name || article.author?.display_name
  const knownAuthor = knownAuthors[author]
  const faq = Array.isArray(article.faq_json) ? article.faq_json.filter((item) => item.question && item.answer) : []
  const graph = [
    { '@type': 'BlogPosting', headline: article.title, description: article.meta_description, image: { '@type': 'ImageObject', url: article.cover_image_url, width: 1200, height: 630 }, author: { '@type': 'Person', name: author, ...(knownAuthor ? { url: `${SITE_URL}${knownAuthor.path}`, sameAs: knownAuthor.sameAs } : {}) }, publisher: { '@type': 'Organization', name: 'PraxIA', url: `${SITE_URL}/`, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` } }, datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, articleSection: article.cms_categories?.name, inLanguage: 'pt-BR' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` }, { '@type': 'ListItem', position: 3, name: article.cms_categories?.name, item: `${SITE_URL}/blog/categoria/${category}` }, { '@type': 'ListItem', position: 4, name: article.title, item: canonical }] },
  ]
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  const tags = `<title>${escapeHtml(article.meta_title)}</title><meta name="description" content="${escapeHtml(article.meta_description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(article.title)}"><meta property="og:description" content="${escapeHtml(article.meta_description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(article.cover_image_url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(article.cover_image_alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(article.title)}"><meta name="twitter:description" content="${escapeHtml(article.meta_description)}"><meta name="twitter:url" content="${escapeHtml(canonical)}"><meta name="twitter:image" content="${escapeHtml(article.cover_image_url)}"><script id="page-json-ld" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>${googleSwgTags}`
  let html = await shellResponse.text()
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta name="description"[^>]*>/i, '').replace('</head>', `${tags}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/i, renderCmsArticleContent(article, author))
  response.status(200).setHeader('content-type', 'text/html; charset=utf-8').setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300').end(html)
}

async function articleBySlug(category, slug) {
  const response = await supabase(`/rest/v1/cms_articles?status=eq.published&deleted_at=is.null&slug=eq.${encodeURIComponent(slug)}&cms_categories.slug=eq.${encodeURIComponent(category)}&select=*,cms_categories!inner(id,name,slug),author:cms_profiles!cms_articles_author_id_fkey(id,display_name,bio,avatar_url,professional_links)&limit=1`)
  if (!response.ok) throw new Error('Não foi possível carregar o artigo')
  return (await response.json())[0] || null
}

async function previewArticle(request, id) {
  const session = await getSession(request)
  if (!session) return null
  const response = await supabase(`/rest/v1/cms_articles?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=*,cms_categories(id,name,slug),author:cms_profiles!cms_articles_author_id_fkey(id,display_name,bio,avatar_url,professional_links)&limit=1`)
  if (!response.ok) return null
  return (await response.json())[0] || null
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido' })
  try {
    if (request.query?.mode === 'rss') return await rss(response)
    if (request.query?.mode === 'sitemap') return await sitemap(response)
    if (request.query?.mode === 'blog-page') return await blogPage(response)
    if (request.query?.mode === 'article-page') return await articlePage(request, response)
    response.setHeader('cache-control', request.query?.preview ? 'private, no-store' : 'public, s-maxage=60, stale-while-revalidate=300')
    if (request.query?.preview && request.query?.id) {
      const article = await previewArticle(request, request.query.id)
      if (!article) return json(response, 401, { error: 'Pré-visualização não autorizada' })
      return json(response, 200, { article, preview: true })
    }
    if (request.query?.category && request.query?.slug) {
      const article = await articleBySlug(request.query.category, request.query.slug)
      if (!article) return json(response, 404, { error: 'Artigo não encontrado' })
      return json(response, 200, { article })
    }
    return json(response, 200, { articles: await getPublicArticles() })
  } catch (error) {
    return json(response, 500, { error: error instanceof Error ? error.message : 'Não foi possível carregar os artigos' })
  }
}
