import { getPublicArticles } from './_lib/cms.js'

const SITE_URL = 'https://www.radarpraxia.com'

const staticPaths = [
  '/',
  '/metodologia',
  '/fluencia-digital-para-professores',
  '/radar-docente',
  '/sobre',
  '/autores/patrick-naufel',
  '/autores/giovani-letti',
  '/blog',
  '/contato',
  '/privacidade',
  '/resultado',
  '/guias',
  '/competencias',
  '/ferramentas',
  '/para-instituicoes',
  '/ebook',
  '/mentoria',
]

const legacyArticlePaths = [
  '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
  '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
  '/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
  '/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia',
  '/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia',
  '/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
  '/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas',
  '/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial',
  '/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores',
]

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function sitemapEntry(path, lastmod, priority = '0.7') {
  return `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : ''}<changefreq>${path.startsWith('/blog') ? 'weekly' : 'monthly'}</changefreq><priority>${priority}</priority></url>`
}

function articlePath(article) {
  try {
    return article?.canonical_url ? new URL(article.canonical_url).pathname : null
  } catch {
    return null
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).setHeader('allow', 'GET').end('Método não permitido')
  }

  try {
    const articles = await getPublicArticles()
    const cmsArticles = articles
      .map((article) => ({ article, path: articlePath(article) }))
      .filter(({ path }) => Boolean(path))

    const categorySlugs = [...new Set([
      ...legacyArticlePaths.map((path) => path.split('/')[2]),
      ...articles.map((article) => article.cms_categories?.slug).filter(Boolean),
    ])]

    const rows = new Map()
    for (const path of staticPaths) rows.set(path, sitemapEntry(path, null, path === '/' ? '1.0' : '0.7'))
    for (const slug of categorySlugs) {
      const path = `/blog/categoria/${slug}`
      rows.set(path, sitemapEntry(path))
    }
    for (const path of legacyArticlePaths) rows.set(path, sitemapEntry(path, null, '0.8'))
    for (const { article, path } of cmsArticles) rows.set(path, sitemapEntry(path, article.updated_at, '0.8'))

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...rows.values()].join('\n')}\n</urlset>`
    return response
      .status(200)
      .setHeader('content-type', 'application/xml; charset=utf-8')
      .setHeader('cache-control', 'public, s-maxage=300, stale-while-revalidate=600')
      .end(body)
  } catch (error) {
    console.error('[PraxIA sitemap] Falha ao gerar sitemap', error)
    return response.status(500).setHeader('content-type', 'text/plain; charset=utf-8').end('Não foi possível gerar o sitemap')
  }
}
