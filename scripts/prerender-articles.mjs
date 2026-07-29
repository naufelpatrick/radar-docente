import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPublishedBlogArticles } from '../src/data/blogArticles.ts'

const distDirectory = path.resolve('dist')
const baseHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8')

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

function createBlogPosting(article) {
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
      url: 'http://lattes.cnpq.br/0026328778886854',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PráxIA',
      url: 'https://www.radarpraxia.com/',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl,
    },
  }
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
    '<meta property="og:site_name" content="PráxIA" />',
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(article.metaDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(article.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(article.socialImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(article.socialImage)}" />`,
    '<meta property="og:image:type" content="image/webp" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(article.socialImageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(article.metaDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(article.socialImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(article.socialImageAlt)}" />`,
    `<script id="page-json-ld" type="application/ld+json">${JSON.stringify(createBlogPosting(article)).replaceAll('<', '\\u003c')}</script>`,
  ].map((tag) => `    ${tag}`).join('\n')

  return cleanedHtml.replace('  </head>', `${tags}\n  </head>`)
}

for (const article of getPublishedBlogArticles()) {
  const outputPath = path.join(distDirectory, `${article.path}.html`)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderArticleHtml(article))
}

console.log(`Pré-renderização concluída para ${getPublishedBlogArticles().length} artigos.`)
