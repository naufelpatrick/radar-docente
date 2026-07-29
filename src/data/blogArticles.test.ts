import { describe, expect, it } from 'vitest'
import { blogArticles, getPublishedArticlesByCategory, getPublishedBlogArticles } from './blogArticles'

describe('fonte editorial do blog', () => {
  it('retorna somente artigos publicados com data válida', () => {
    const articles = getPublishedBlogArticles()

    expect(articles.length).toBeGreaterThan(0)
    expect(articles.every((article) => article.status === 'published')).toBe(true)
    expect(articles.every((article) => article.publishedAt && !Number.isNaN(Date.parse(article.publishedAt)))).toBe(true)
  })

  it('ordena artigos da publicação mais recente para a mais antiga', () => {
    const timestamps = getPublishedBlogArticles().map((article) => Date.parse(article.publishedAt!))

    expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first))
  })

  it('mantém rotas únicas e permite selecionar artigos por categoria', () => {
    expect(new Set(blogArticles.map((article) => article.path)).size).toBe(blogArticles.length)
    expect(getPublishedArticlesByCategory('etica').every((article) => article.categorySlug === 'etica')).toBe(true)
  })
})
