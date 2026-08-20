import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPublishedBlogArticles } from '../src/data/blogArticles.ts'

const SITE_URL = 'https://www.radarpraxia.com'
const distDirectory = path.resolve('dist')
const articles = getPublishedBlogArticles()
const categories = [...new Set(articles.map((article) => article.categorySlug))]
const staticPaths = ['/', '/sobre', '/autores/patrick-naufel', '/autores/giovani-letti', '/blog', '/contato', '/privacidade', '/resultado', '/guias', '/competencias', '/ferramentas', '/metodologia', '/fluencia-digital-para-professores', '/radar-docente', '/ebook', '/mentoria', '/para-instituicoes']
const indexablePaths = [...staticPaths, ...categories.map((slug) => `/blog/categoria/${slug}`), ...articles.map((article) => article.path)]

function fileFor(pathname) {
  return pathname === '/' ? path.join(distDirectory, 'index.html') : path.join(distDirectory, `${pathname}.html`)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function headValue(html, pattern) {
  return html.match(pattern)?.[1] || ''
}

function schemaTypes(value, types = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => schemaTypes(item, types))
  else if (value && typeof value === 'object') {
    if (typeof value['@type'] === 'string') types.add(value['@type'])
    Object.values(value).forEach((item) => schemaTypes(item, types))
  }
  return types
}

function samePaths(first, second) {
  return first.size === second.size && [...first].every((item) => second.has(item))
}

const editorialPaths = new Set(articles.map((article) => article.path))
const appSource = await readFile(path.resolve('src/App.tsx'), 'utf8')
const staticArticleRoutes = new Set(
  [...appSource.matchAll(/<Route path="(\/blog\/[^":]+\/[^":]+)"/g)]
    .map((match) => match[1])
    .filter((pathname) => !pathname.includes(':')),
)
assert(samePaths(editorialPaths, staticArticleRoutes), 'Blog: rotas estáticas e fonte editorial estão divergentes')

const cmsPublicSource = await readFile(path.resolve('api/cms/public.js'), 'utf8')
const legacyBlock = cmsPublicSource.match(/const legacyArticlePaths = \[([\s\S]*?)\]/)?.[1] || ''
const sitemapLegacyPaths = new Set([...legacyBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]))
assert(samePaths(editorialPaths, sitemapLegacyPaths), 'Blog: fonte editorial e sitemap legado estão divergentes')

const vercelConfig = JSON.parse(await readFile(path.resolve('vercel.json'), 'utf8'))
const rewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : []
const cmsArticleRewriteIndex = rewrites.findIndex((rewrite) => rewrite.source === '/blog/:category/:slug')
assert(cmsArticleRewriteIndex >= 0, 'Blog: rewrite genérico do CMS ausente')
for (const article of articles) {
  const rewriteIndex = rewrites.findIndex((rewrite) => rewrite.source === article.path && rewrite.destination === `${article.path}.html`)
  assert(rewriteIndex >= 0, `Blog: rewrite pré-renderizado ausente para ${article.path}`)
  assert(rewriteIndex < cmsArticleRewriteIndex, `Blog: rewrite pré-renderizado precisa preceder o CMS em ${article.path}`)
}

for (const pathname of indexablePaths) {
  const html = await readFile(fileFor(pathname), 'utf8')
  const expectedCanonical = new URL(pathname, SITE_URL).toString()
  assert(/<title>[^<]+<\/title>/i.test(html), `${pathname}: title ausente`)
  assert(/<meta name="description" content="[^"]+"/i.test(html), `${pathname}: description ausente`)
  assert(headValue(html, /<link rel="canonical" href="([^"]+)"/i) === expectedCanonical, `${pathname}: canonical incorreta`)
  assert(headValue(html, /<meta property="og:url" content="([^"]+)"/i) === expectedCanonical, `${pathname}: og:url incorreta`)
  assert(headValue(html, /<meta name="twitter:url" content="([^"]+)"/i) === expectedCanonical, `${pathname}: twitter:url incorreta`)
  assert(/<meta property="og:title" content="[^"]+"/i.test(html), `${pathname}: og:title ausente`)
  assert(/<meta property="og:description" content="[^"]+"/i.test(html), `${pathname}: og:description ausente`)
  assert(/<meta property="og:image" content="https:\/\/www\.radarpraxia\.com\/[^"]+"/i.test(html), `${pathname}: og:image inválida`)
  assert(/<main[\s>]/i.test(html), `${pathname}: main ausente`)
  assert(/<h1[\s>]/i.test(html), `${pathname}: H1 ausente`)
  assert(/<a [^>]*href="[^"]+"/i.test(html), `${pathname}: links HTML ausentes`)
  assert(!/[?&]utm_|#.+["']/i.test(expectedCanonical), `${pathname}: canonical contaminada`)
  assert(!/(?:\.vercel\.app|localhost)/i.test(html), `${pathname}: host técnico no HTML público`)
}

const blogHtml = await readFile(fileFor('/blog'), 'utf8')
for (const article of articles) assert(blogHtml.includes(`href="${article.path}"`), `/blog: link ausente para ${article.path}`)

const methodologyHtml = await readFile(fileFor('/metodologia'), 'utf8')
assert((methodologyHtml.match(/<h2[\s>]/g) || []).length >= 5, '/metodologia: conteúdo principal incompleto')
assert(/fundamentação metodológica/i.test(methodologyHtml), '/metodologia: fundamentação ausente')

for (const article of articles) {
  const html = await readFile(fileFor(article.path), 'utf8')
  assert((html.match(/<h2[\s>]/g) || []).length >= 2, `${article.path}: headings do artigo ausentes`)
  assert(/<a [^>]*href="\/(?:blog|radar|metodologia|ferramentas|competencias|fluencia-digital-para-professores)/i.test(html), `${article.path}: links internos ausentes`)
  const json = headValue(html, /<script id="page-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/i)
  assert(json, `${article.path}: JSON-LD ausente`)
  const schema = JSON.parse(json)
  const types = schemaTypes(schema)
  assert(types.has('BlogPosting'), `${article.path}: BlogPosting ausente`)
  assert(types.has('BreadcrumbList'), `${article.path}: BreadcrumbList ausente`)
  if (types.has('FAQPage')) for (const item of article.faq || []) assert(html.includes(item.question), `${article.path}: FAQ invisível no conteúdo`)
}

const radarDocenteHtml = await readFile(fileFor('/radar-docente'), 'utf8')
const radarHtml = await readFile(fileFor('/radar'), 'utf8')
assert(radarDocenteHtml.includes('href="/radar"'), '/radar-docente: CTA para /radar ausente')
assert(/<meta name="robots" content="noindex, follow"/i.test(radarHtml), '/radar: noindex ausente')
assert(!/rel="canonical"/i.test(radarHtml), '/radar: canonical não deveria existir')
assert(headValue(radarDocenteHtml, /<title>([^<]+)<\/title>/i) !== headValue(radarHtml, /<title>([^<]+)<\/title>/i), '/radar e /radar-docente: titles idênticos')

const robots = await readFile(path.join(distDirectory, 'robots.txt'), 'utf8')
assert(robots.includes('Allow: /'), 'robots.txt: páginas públicas não liberadas')
assert(robots.includes('Disallow: /admin'), 'robots.txt: área administrativa não protegida')
assert(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'robots.txt: sitemap incorreto')

const rss = await readFile(path.join(distDirectory, 'feed.xml'), 'utf8')
for (const article of articles) assert(rss.includes(article.canonicalUrl), `RSS: artigo ausente ${article.path}`)
assert(!/(?:\.vercel\.app|localhost|[?&]utm_)/i.test(rss), 'RSS: URL técnica ou contaminada')

console.log(`SEO do build validado em ${indexablePaths.length} páginas indexáveis e ${articles.length} artigos.`)
