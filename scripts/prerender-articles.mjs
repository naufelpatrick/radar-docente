import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPublishedBlogArticles } from '../src/data/blogArticles.ts'
import { team } from '../src/data/team.ts'
import { praxiaOrganizationSchema, praxiaWebsiteSchema } from '../src/services/siteStructuredData.ts'

const distDirectory = path.resolve('dist')
const baseHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8')
const digitalFluencyPath = '/fluencia-digital-para-professores'
const digitalFluencyUrl = `https://www.radarpraxia.com${digitalFluencyPath}`
const digitalFluencyTitle = 'Fluência digital para professores: descubra seu nível | PraxIA'
const digitalFluencyDescription = 'Entenda o que é fluência digital para professores, conheça suas dimensões e faça gratuitamente o Radar PraxIA para orientar seu desenvolvimento.'
const defaultSocialImage = 'https://www.radarpraxia.com/social-graph-praxia.png'
const defaultSocialImageAlt = 'PraxIA — fluência digital e inteligência artificial para a prática docente'
const googleSwgTags = [
  '<script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js"></script>',
  '<script>self.__praxiaSwgBasicInitialized=true;(self.SWG_BASIC=self.SWG_BASIC||[]).push(basicSubscriptions=>{basicSubscriptions.init({type:"NewsArticle",isPartOfType:["Product"],isPartOfProductId:"CAowyK7hCw:openaccess",clientOptions:{theme:"light",lang:"pt-BR"}});});</script>',
]

const staticPages = [
  ['/', 'Radar de Fluência Digital e IA | PraxIA', 'Descubra forças, pontos de atenção e um próximo passo possível para sua prática docente.', 'Transforme fluência digital e inteligência artificial em prática docente.', 'index, follow', {
    '@context': 'https://schema.org',
    '@graph': [praxiaWebsiteSchema, praxiaOrganizationSchema],
  }],
  ['/sobre', 'Sobre a PraxIA', 'Conheça a história, o propósito e os valores da PraxIA.', 'Sobre a PraxIA'],
  ['/blog', 'Blog: IA, competências digitais e prática docente | PraxIA', 'Conteúdos para professores sobre IA, competências digitais e prática docente.', 'Ideias, critérios e perguntas para ensinar em contextos digitais e com IA.'],
  ['/contato', 'Contato | PraxIA', 'Entre em contato com a PraxIA.', 'Entre em contato com a PraxIA'],
  ['/privacidade', 'Política de Privacidade | PraxIA', 'Entenda como a PraxIA trata dados pessoais, utiliza cookies e protege a privacidade de professores e representantes de instituições.', 'Política de Privacidade da PraxIA'],
  ['/radar-docente', 'Radar Docente: fluência digital e IA na prática | PraxIA', 'Conheça o Radar Docente PraxIA e descubra seu nível de fluência digital e em IA.', 'Radar Docente: um olhar organizado sobre sua prática.'],
  ['/metodologia', 'Metodologia do Radar Docente | PraxIA', 'Entenda as dimensões, o cálculo e os limites metodológicos do Radar Docente.', 'Metodologia do Radar Docente'],
  ['/para-instituicoes', 'Palestras e workshops para professores | PraxIA', 'Soluções para instituições sobre fluência digital, IA e prática docente.', 'Soluções para instituições de ensino'],
  ['/competencias', 'Competências docentes digitais e em IA | PraxIA', 'Conheça as seis dimensões da fluência digital e em IA na prática docente.', 'Competências docentes digitais e em IA'],
  ['/guias', 'Guias para a prática docente | PraxIA', 'Percursos práticos para planejar, avaliar e utilizar tecnologia e IA.', 'Guias para a prática docente'],
  ['/ferramentas', 'Ferramentas digitais e IA para professores | PraxIA', 'Avalie ferramentas digitais e de IA por critérios pedagógicos e éticos.', 'Ferramentas digitais e IA com critérios'],
  ['/ebook', 'E-book IA na prática docente | PraxIA', 'Conheça o e-book da PraxIA para integrar IA à prática docente.', 'IA na prática docente'],
  ['/mentoria', 'Mentoria para professores | PraxIA', 'Mentoria para transformar fluência digital e IA em prática docente.', 'Mentoria para a prática docente'],
  ['/resultado', 'Resultado demonstrativo do Radar | PraxIA', 'Conheça a estrutura do resultado do Radar Docente.', 'Resultado demonstrativo do Radar Docente'],
  ['/radar', 'Radar Docente | PraxIA', 'Aplicação de autorreflexão do Radar Docente PraxIA.', 'Radar Docente', 'noindex, follow'],
  ...team.map((member) => {
    const pathname = `/autores/${member.id}`
    return [pathname, `${member.name} — autor | PraxIA`, member.shortBio, member.name, 'index, follow', {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: `${member.name} — autor na PraxIA`,
      url: `https://www.radarpraxia.com${pathname}`,
      inLanguage: 'pt-BR',
      mainEntity: {
        '@type': 'Person',
        name: member.name,
        description: member.fullBio,
        image: `https://www.radarpraxia.com${member.photo.src}`,
        url: `https://www.radarpraxia.com${pathname}`,
        sameAs: member.links.map((link) => link.href),
      },
    }]
  }),
]

const removableHeadMarkers = [
  '<title>',
  'name="description"',
  'rel="canonical"',
  'property="og:',
  'name="twitter:',
  'id="page-json-ld"',
]

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function injectFallbackContent(html, heading, description) {
  const content = `<main data-prerendered-content><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><nav aria-label="Links principais"><a href="/radar-docente">Radar Docente</a> <a href="/blog">Blog</a> <a href="/metodologia">Metodologia</a></nav></main>`
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
}

function renderStaticPage(pathname, title, description, heading, robots = 'index, follow', jsonLd) {
  const canonical = `https://www.radarpraxia.com${pathname === '/' ? '/' : pathname}`
  const cleanedHtml = baseHtml.split('\n').filter((line) => !removableHeadMarkers.some((marker) => line.includes(marker))).join('\n')
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    robots.startsWith('index') ? `<link rel="canonical" href="${canonical}" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="PraxIA" />',
    '<meta property="og:locale" content="pt_BR" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${defaultSocialImage}" />`,
    `<meta property="og:image:secure_url" content="${defaultSocialImage}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${defaultSocialImageAlt}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:url" content="${canonical}" />`,
    `<meta name="twitter:image" content="${defaultSocialImage}" />`,
    `<meta name="twitter:image:alt" content="${defaultSocialImageAlt}" />`,
    jsonLd ? `<script id="page-json-ld" type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>` : '',
  ].filter(Boolean).map((tag) => `    ${tag}`).join('\n')
  return injectFallbackContent(cleanedHtml.replace('  </head>', `${tags}\n  </head>`), heading, description)
}

function createBlogPosting(article) {
  const author = team.find((member) => member.name === article.author)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: {
      '@type': 'ImageObject',
      url: article.socialImage,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    author: {
      '@type': 'Person',
      name: article.author,
      ...(author ? { url: `https://www.radarpraxia.com/autores/${author.id}`, sameAs: author.links.map((link) => link.href) } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'PraxIA',
      url: 'https://www.radarpraxia.com/',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl,
    },
  }
}

function createStructuredData(article) {
  const graph = [createBlogPosting(article), {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: article.category, item: `https://www.radarpraxia.com/blog/categoria/${article.categorySlug}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ],
  }]
  if (article.faq?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  return graph.length === 1 ? graph[0] : graph
}

function renderArticleHtml(article) {
  const cleanedHtml = baseHtml
    .split('\n')
    .filter((line) => !removableHeadMarkers.some((marker) => line.includes(marker)))
    .join('\n')

  const tags = [
    `<title>${escapeHtml(article.seoTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(article.metaDescription)}" />`,
    `<link rel="canonical" href="${escapeHtml(article.canonicalUrl)}" />`,
    '<meta property="og:type" content="article" />',
    '<meta property="og:site_name" content="PraxIA" />',
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(article.metaDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(article.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(article.socialImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(article.socialImage)}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(article.socialImageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(article.metaDescription)}" />`,
    `<meta name="twitter:url" content="${escapeHtml(article.canonicalUrl)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(article.socialImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(article.socialImageAlt)}" />`,
    `<script id="page-json-ld" type="application/ld+json">${JSON.stringify(createStructuredData(article)).replaceAll('<', '\\u003c')}</script>`,
    ...googleSwgTags,
  ].map((tag) => `    ${tag}`).join('\n')

  return injectFallbackContent(cleanedHtml.replace('  </head>', `${tags}\n  </head>`), article.title, article.summary)
}

function renderDigitalFluencyHtml() {
  const cleanedHtml = baseHtml.split('\n').filter((line) => !removableHeadMarkers.some((marker) => line.includes(marker))).join('\n')
  const image = defaultSocialImage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Fluência digital para professores: descubra seu nível e avance com intencionalidade',
    description: digitalFluencyDescription,
    mainEntityOfPage: digitalFluencyUrl,
    url: digitalFluencyUrl,
    inLanguage: 'pt-BR',
    author: { '@type': 'Organization', name: 'PraxIA' },
    publisher: { '@type': 'Organization', name: 'PraxIA', url: 'https://www.radarpraxia.com' },
  }
  const tags = [
    `<title>${digitalFluencyTitle}</title>`,
    `<meta name="description" content="${digitalFluencyDescription}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${digitalFluencyUrl}" />`,
    '<meta property="og:type" content="article" />',
    '<meta property="og:site_name" content="PraxIA" />',
    `<meta property="og:title" content="${digitalFluencyTitle}" />`,
    `<meta property="og:description" content="${digitalFluencyDescription}" />`,
    `<meta property="og:url" content="${digitalFluencyUrl}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${digitalFluencyTitle}" />`,
    `<meta name="twitter:description" content="${digitalFluencyDescription}" />`,
    `<meta name="twitter:url" content="${digitalFluencyUrl}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script id="page-json-ld" type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`,
  ].map((tag) => `    ${tag}`).join('\n')
  return injectFallbackContent(cleanedHtml.replace('  </head>', `${tags}\n  </head>`), 'Fluência digital para professores', digitalFluencyDescription)
}

for (const [pathname, title, description, heading, robots, jsonLd] of staticPages) {
  const outputPath = pathname === '/' ? path.join(distDirectory, 'index.html') : path.join(distDirectory, `${pathname}.html`)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderStaticPage(pathname, title, description, heading, robots, jsonLd))
}

for (const article of getPublishedBlogArticles()) {
  const outputPath = path.join(distDirectory, `${article.path}.html`)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderArticleHtml(article))
}

const articlesByCategory = Map.groupBy(getPublishedBlogArticles(), (article) => article.categorySlug)
for (const [categorySlug, articles] of articlesByCategory) {
  const category = articles[0].category
  const pathname = `/blog/categoria/${categorySlug}`
  const description = `Artigos da PraxIA sobre ${category.toLocaleLowerCase('pt-BR')}, tecnologia e prática docente.`
  const outputPath = path.join(distDirectory, `${pathname}.html`)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderStaticPage(pathname, `${category} — Blog | PraxIA`, description, category))
}

await writeFile(path.join(distDirectory, `${digitalFluencyPath}.html`), renderDigitalFluencyHtml())

console.log(`Pré-renderização concluída para ${getPublishedBlogArticles().length} artigos.`)
