import type { BlogArticle } from '../data/blogArticles'
import { SITE_URL } from '../config/site.ts'

const feedUrl = `${SITE_URL}/feed.xml`

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function generateRssXml(articles: BlogArticle[]) {
  const items = articles.map((article) => {
    if (!article.publishedAt) throw new Error(`Artigo publicado sem data: ${article.slug}`)

    return [
      '    <item>',
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${escapeXml(article.canonicalUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(article.canonicalUrl)}</guid>`,
      `      <description>${escapeXml(article.summary)}</description>`,
      `      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
      `      <atom:updated>${new Date(article.modifiedAt).toISOString()}</atom:updated>`,
      `      <dc:creator>${escapeXml(article.author)}</dc:creator>`,
      `      <category>${escapeXml(article.category)}</category>`,
      `      <media:content url="${escapeXml(article.socialImage)}" type="image/jpeg" medium="image" width="1200" height="630" />`,
      `      <media:description>${escapeXml(article.socialImageAlt)}</media:description>`,
      '    </item>',
    ].join('\n')
  }).join('\n')

  const latestModification = articles
    .map((article) => Date.parse(article.modifiedAt))
    .filter(Number.isFinite)
    .sort((first, second) => second - first)[0]
  const latestPublication = latestModification
    ? new Date(latestModification).toUTCString()
    : new Date(0).toUTCString()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    '    <title>Blog PraxIA</title>',
    `    <link>${SITE_URL}/blog</link>`,
    '    <description>Reflexões, referências e práticas para integrar tecnologia e inteligência artificial à docência com consciência pedagógica.</description>',
    '    <language>pt-BR</language>',
    `    <lastBuildDate>${latestPublication}</lastBuildDate>`,
    '    <generator>PraxIA</generator>',
    '    <ttl>60</ttl>',
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    '    <image>',
    `      <url>${SITE_URL}/social-graph-praxia.png</url>`,
    '      <title>Blog PraxIA</title>',
    `      <link>${SITE_URL}/blog</link>`,
    '    </image>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
