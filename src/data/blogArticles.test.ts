import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildSiteUrl } from '../config/site'
import { blogArticles, getPublishedArticlesByCategory, getPublishedBlogArticles } from './blogArticles'

describe('fonte editorial do blog', () => {
  it('retorna somente artigos publicados com data válida', () => {
    const articles = getPublishedBlogArticles()

    expect(articles.length).toBeGreaterThan(0)
    expect(articles.every((article) => article.status === 'published')).toBe(true)
    expect(articles.every((article) => article.publishedAt && !Number.isNaN(Date.parse(article.publishedAt)))).toBe(true)
    expect(articles.every((article) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/.test(article.publishedAt!))).toBe(true)
    expect(articles.every((article) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/.test(article.modifiedAt))).toBe(true)
  })

  it('ordena artigos da publicação mais recente para a mais antiga', () => {
    const timestamps = getPublishedBlogArticles().map((article) => Date.parse(article.publishedAt!))

    expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first))
  })

  it('mantém rotas únicas e permite selecionar artigos por categoria', () => {
    expect(new Set(blogArticles.map((article) => article.path)).size).toBe(blogArticles.length)
    expect(getPublishedArticlesByCategory('etica').every((article) => article.categorySlug === 'etica')).toBe(true)
    expect(getPublishedArticlesByCategory('competencias-docentes')).toHaveLength(1)
  })

  it('mantém toda rota estática de artigo registrada na fonte editorial', () => {
    const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8')
    const staticArticlePaths = [...appSource.matchAll(/<Route path="(\/blog\/[^":]+\/[^":]+)"/g)]
      .map((match) => match[1])
      .filter((path) => !path.includes(':'))
    const editorialPaths = new Set(blogArticles.map((article) => article.path))

    expect(staticArticlePaths.length).toBeGreaterThan(0)
    expect(staticArticlePaths.every((path) => editorialPaths.has(path))).toBe(true)
  })

  it('mantém SEO e imagens sociais exclusivos para cada artigo publicado', () => {
    const articles = getPublishedBlogArticles()

    expect(new Set(articles.map((article) => article.canonicalUrl)).size).toBe(articles.length)
    expect(articles.every((article) => article.canonicalUrl === buildSiteUrl(article.path))).toBe(true)
    expect(new Set(articles.map((article) => article.socialImage)).size).toBe(articles.length)
    expect(articles.every((article) => article.socialImage.startsWith('https://www.radarpraxia.com/social/'))).toBe(true)
    expect(articles.every((article) => /\| PraxIA$|\| PraxIA$/.test(article.seoTitle))).toBe(true)
  })

  it('mantém FAQ e capa acessível no artigo de competências docentes', () => {
    const article = blogArticles.find((item) => item.slug === 'o-que-sao-competencias-docentes-para-uso-de-ia')

    expect(article?.faq).toHaveLength(5)
    expect(article?.coverImage?.alt).toContain('Professor')
  })

  it('publica o artigo de avaliação com imagem e FAQ próprias', () => {
    const article = blogArticles.find((item) => item.slug === 'como-avaliar-atividades-produzidas-com-apoio-de-ia')

    expect(article?.status).toBe('published')
    expect(article?.categorySlug).toBe('avaliacao')
    expect(article?.faq).toHaveLength(5)
    expect(article?.socialImage).toContain('avaliar-atividades-com-ia-1200x630.jpg')
    expect(article?.coverImage?.src).toContain('avaliar-atividades-com-ia-1200x630.webp')
  })

  it('publica o artigo de planejamento com imagem e FAQ próprias', () => {
    const article = blogArticles.find((item) => item.slug === 'como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial')

    expect(article?.status).toBe('published')
    expect(article?.categorySlug).toBe('planejamento')
    expect(article?.faq).toHaveLength(5)
    expect(article?.socialImage).toContain('como-planejar-atividade-pedagogica-inteligencia-artificial-1200x630.jpg')
    expect(article?.coverImage?.src).toContain('como-planejar-atividade-pedagogica-inteligencia-artificial-1200x630.webp')
  })

  it('publica o artigo de escolha de ferramenta com imagem e FAQ próprias', () => {
    const article = blogArticles.find((item) => item.slug === 'como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica')

    expect(article?.status).toBe('published')
    expect(article?.categorySlug).toBe('ferramentas')
    expect(article?.faq).toHaveLength(5)
    expect(article?.socialImage).toContain('escolher-ferramenta-ia-atividade-pedagogica-1200x630.jpg')
    expect(article?.coverImage?.src).toContain('escolher-ferramenta-ia-atividade-pedagogica-1200x630.webp')
  })
})
