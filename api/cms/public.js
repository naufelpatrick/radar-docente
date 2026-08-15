import { getPublicArticles, getSession } from '../_lib/cms.js'
import { json, supabase } from '../_lib/ebook.js'

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.radarpraxia.com'
const staticPaths = ['/', '/metodologia', '/fluencia-digital-para-professores', '/radar-docente', '/sobre', '/blog', '/contato', '/privacidade', '/resultado', '/guias', '/competencias', '/ferramentas', '/para-instituicoes', '/ebook', '/mentoria']
const legacyArticlePaths = [
  '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
  '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
  '/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
  '/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia',
  '/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia',
  '/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
  '/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas',
  '/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores',
]

function escapeXml(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;') }
function escapeHtml(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;') }

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
  const rows = [...staticPaths.map((path) => sitemapEntry(path, null, path === '/' ? '1.0' : '0.7')), ...categoryPaths.map((slug) => sitemapEntry(`/blog/categoria/${slug}`)), ...legacyArticlePaths.map((path) => sitemapEntry(path, null, '0.8')), ...articles.map((article) => sitemapEntry(new URL(article.canonical_url).pathname, article.updated_at, '0.8'))]
  response.status(200).setHeader('content-type', 'application/xml; charset=utf-8').setHeader('cache-control', 'public, s-maxage=300').end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>`)
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
  const faq = Array.isArray(article.faq_json) ? article.faq_json.filter((item) => item.question && item.answer) : []
  const graph = [
    { '@type': 'BlogPosting', headline: article.title, description: article.meta_description, image: { '@type': 'ImageObject', url: article.cover_image_url, width: 1200, height: 630 }, author: { '@type': 'Person', name: author }, publisher: { '@type': 'Organization', name: 'PraxIA', url: `${SITE_URL}/`, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` } }, datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, articleSection: article.cms_categories?.name, inLanguage: 'pt-BR' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` }, { '@type': 'ListItem', position: 3, name: article.cms_categories?.name, item: `${SITE_URL}/blog/categoria/${category}` }, { '@type': 'ListItem', position: 4, name: article.title, item: canonical }] },
  ]
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  const tags = `<title>${escapeHtml(article.meta_title)}</title><meta name="description" content="${escapeHtml(article.meta_description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(article.title)}"><meta property="og:description" content="${escapeHtml(article.meta_description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(article.cover_image_url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(article.cover_image_alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(article.title)}"><meta name="twitter:description" content="${escapeHtml(article.meta_description)}"><meta name="twitter:image" content="${escapeHtml(article.cover_image_url)}"><script id="page-json-ld" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>`
  let html = await shellResponse.text()
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta name="description"[^>]*>/i, '').replace('</head>', `${tags}</head>`)
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
