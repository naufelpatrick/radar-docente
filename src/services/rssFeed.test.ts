import { describe, expect, it } from 'vitest'
import { getPublishedBlogArticles } from '../data/blogArticles'
import { generateRssXml } from './rssFeed'

describe('feed RSS do blog', () => {
  it('inclui automaticamente todos os artigos publicados na ordem editorial', () => {
    const articles = getPublishedBlogArticles()
    const xml = generateRssXml(articles)

    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<atom:link href="https://www.radarpraxia.com/feed.xml"')
    expect(xml.match(/<item>/g)).toHaveLength(articles.length)
    articles.forEach((article) => {
      expect(xml).toContain(`<guid isPermaLink="true">${article.canonicalUrl}</guid>`)
      expect(xml).toContain(`url="${article.socialImage}"`)
      expect(xml).toContain(`<atom:updated>${new Date(article.modifiedAt).toISOString()}</atom:updated>`)
    })
  })

  it('escapa caracteres especiais no conteúdo XML', () => {
    const [article] = getPublishedBlogArticles()
    const xml = generateRssXml([{ ...article, title: 'Educação & IA <prática>' }])

    expect(xml).toContain('Educação &amp; IA &lt;prática&gt;')
  })
})
