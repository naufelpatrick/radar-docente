import { getPublicArticles } from './_lib/cms.js'

const SITE_URL = 'https://www.radarpraxia.com'
const BLOG_URL = `${SITE_URL}/blog`
const BLOG_TITLE = 'Blog: IA, competências digitais e prática docente | PraxIA'
const BLOG_DESCRIPTION = 'Conteúdos para professores sobre IA, competências digitais e prática docente.'

const legacyArticles = [
  {
    path: '/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores',
    category: 'Fluência Digital',
    title: 'O que é fluência digital para professores?',
    summary: 'Entenda por que fluência digital vai além de dominar ferramentas e como transformar tecnologia em escolhas pedagógicas mais conscientes.',
  },
  {
    path: '/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial',
    category: 'Planejamento',
    title: 'Como planejar uma atividade pedagógica com inteligência artificial',
    summary: 'Um roteiro prático para integrar IA ao planejamento sem perder de vista objetivo de aprendizagem, contexto e avaliação.',
  },
  {
    path: '/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas',
    category: 'Ética',
    title: 'Privacidade e dados no uso educacional de ferramentas generativas',
    summary: 'Critérios práticos para proteger dados de estudantes e tomar decisões mais seguras ao usar ferramentas generativas.',
  },
  {
    path: '/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
    category: 'Ferramentas',
    title: 'Como escolher uma ferramenta de IA para uma atividade pedagógica',
    summary: 'Compare objetivo, função, precisão, privacidade, acesso e custo antes de levar uma ferramenta de IA para a aula.',
  },
  {
    path: '/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia',
    category: 'Avaliação',
    title: 'Como avaliar atividades produzidas com apoio de IA',
    summary: 'Critérios para avaliar processo, autoria, decisões e aprendizagem em trabalhos produzidos com apoio de inteligência artificial.',
  },
  {
    path: '/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia',
    category: 'Competências Docentes',
    title: 'O que são competências docentes para uso de IA',
    summary: 'Capacidades que ajudam professores a integrar inteligência artificial com intenção pedagógica, senso crítico, ética e segurança.',
  },
  {
    path: '/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
    category: 'Ética',
    title: 'Como conversar sobre autoria em atividades com IA',
    summary: 'Perguntas e critérios para tornar o uso de inteligência artificial mais transparente e preservar a autoria dos estudantes.',
  },
  {
    path: '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
    category: 'Planejamento',
    title: 'Da possibilidade tecnológica ao objetivo de aprendizagem',
    summary: 'Um caminho para começar pelo que os estudantes precisam aprender antes de escolher a tecnologia ou a ferramenta de IA.',
  },
  {
    path: '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    category: 'IA para Professores',
    title: 'Usar IA com estudantes começa antes da ferramenta',
    summary: 'Decisões pedagógicas, éticas e de aprendizagem que precisam acontecer antes da escolha de uma ferramenta de inteligência artificial.',
  },
]

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function slugifyCategory(value) {
  return value
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function cmsArticleView(article) {
  let path = ''
  try {
    path = new URL(article.canonical_url).pathname
  } catch {
    path = `/blog/${article.cms_categories?.slug || 'conteudos'}/${article.slug}`
  }
  return {
    path,
    category: article.cms_categories?.name || 'Blog',
    title: article.title,
    summary: article.excerpt || article.meta_description || '',
  }
}

function renderFallback(articles) {
  const categoryLinks = [...new Map(articles.map((article) => [
    article.category,
    `/blog/categoria/${slugifyCategory(article.category)}`,
  ])).entries()]
    .map(([category, path]) => `<a href="${escapeHtml(path)}">${escapeHtml(category)}</a>`)
    .join(' ')

  const articleItems = articles.map((article) => `
    <li>
      <article>
        <p>${escapeHtml(article.category)}</p>
        <h3><a href="${escapeHtml(article.path)}">${escapeHtml(article.title)}</a></h3>
        <p>${escapeHtml(article.summary)}</p>
      </article>
    </li>`).join('')

  return `<div id="root"><main data-prerendered-content>
    <header>
      <h1>Ideias, critérios e perguntas para ensinar em contextos digitais e com IA.</h1>
      <p>${escapeHtml(BLOG_DESCRIPTION)}</p>
    </header>
    <nav aria-label="Categorias do blog">${categoryLinks}</nav>
    <section aria-labelledby="artigos-publicados">
      <h2 id="artigos-publicados">Artigos publicados</h2>
      <ul>${articleItems}</ul>
    </section>
  </main></div>`
}

function injectSeo(html) {
  const cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, '')
    .replace(/<meta\s+property=["']og:(?:title|description|url|type)["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:(?:title|description)["'][^>]*>/gi, '')

  const tags = [
    `<title>${escapeHtml(BLOG_TITLE)}</title>`,
    `<meta name="description" content="${escapeHtml(BLOG_DESCRIPTION)}">`,
    '<meta name="robots" content="index, follow">',
    `<link rel="canonical" href="${BLOG_URL}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="PraxIA">',
    `<meta property="og:title" content="${escapeHtml(BLOG_TITLE)}">`,
    `<meta property="og:description" content="${escapeHtml(BLOG_DESCRIPTION)}">`,
    `<meta property="og:url" content="${BLOG_URL}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(BLOG_TITLE)}">`,
    `<meta name="twitter:description" content="${escapeHtml(BLOG_DESCRIPTION)}">`,
  ].join('')

  return cleaned.replace('</head>', `${tags}</head>`)
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).setHeader('allow', 'GET').end('Método não permitido')
  }

  try {
    const shellResponse = await fetch(`${SITE_URL}/index.html`, { headers: { accept: 'text/html' } })
    if (!shellResponse.ok) throw new Error('Não foi possível carregar a aplicação')

    let cmsArticles = []
    try {
      cmsArticles = (await getPublicArticles()).map(cmsArticleView)
    } catch (error) {
      console.warn('[PraxIA blog] CMS indisponível durante fallback SEO', error)
    }

    const deduped = new Map(legacyArticles.map((article) => [article.path, article]))
    for (const article of cmsArticles) deduped.set(article.path, article)
    const articles = [...deduped.values()]

    let html = injectSeo(await shellResponse.text())
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, renderFallback(articles))

    return response
      .status(200)
      .setHeader('content-type', 'text/html; charset=utf-8')
      .setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300')
      .end(html)
  } catch (error) {
    console.error('[PraxIA blog] Falha ao renderizar hub editorial', error)
    return response.status(500).setHeader('content-type', 'text/plain; charset=utf-8').end('Não foi possível carregar o blog')
  }
}
