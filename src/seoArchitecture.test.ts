import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { SITE_URL, buildSiteUrl } from './config/site'
import { getPublishedBlogArticles } from './data/blogArticles'
import { createBlogPostingSchema } from './services/articleSeo'
import { buildCanonicalUrl } from './services/seoUrl'

describe('arquitetura de SEO', () => {
  it('usa somente a origem canônica oficial', () => {
    expect(SITE_URL).toBe('https://www.radarpraxia.com')
    expect(buildSiteUrl('/blog')).toBe('https://www.radarpraxia.com/blog')
    expect(getPublishedBlogArticles().every((article) => article.canonicalUrl.startsWith(SITE_URL))).toBe(true)
  })

  it('normaliza URLs canônicas sem querystring ou hash', () => {
    expect(buildCanonicalUrl('/blog')).toBe('https://www.radarpraxia.com/blog')
    expect(buildCanonicalUrl('/blog/artigo?utm_source=instagram#leitura')).toBe('https://www.radarpraxia.com/blog/artigo')
  })

  it('não contém o domínio antigo no código de produção', () => {
    const result = spawnSync('rg', [
      '-l',
      'radar-docente-pi\\.vercel\\.app',
      '--glob', '!seoArchitecture.test.ts',
      'src', 'api', 'scripts', 'public', 'index.html',
    ], { encoding: 'utf8' })
    expect(result.status).toBe(1)
    expect(result.stdout).toBe('')
  })

  it('configura 404 real e redirect do host antigo', () => {
    const config = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
    expect(config).toContain('radar-docente-pi.vercel.app')
    expect(config).toContain('/api/not-found')
  })

  it('não permite que variáveis de preview alterem URLs públicas', () => {
    for (const file of ['../api/cms/public.js', '../api/_lib/cms.js', '../api/_lib/ebook.js']) {
      expect(readFileSync(new URL(file, import.meta.url), 'utf8')).not.toContain('PUBLIC_SITE_URL')
    }
  })

  it('liga artigos a páginas internas de autor', () => {
    const schema = createBlogPostingSchema(getPublishedBlogArticles()[0])
    expect(schema.author.url).toBe('https://www.radarpraxia.com/autores/patrick-naufel')
    expect(schema.author.sameAs).toContain('https://www.linkedin.com/in/patricknaufel')
  })

  it('renderiza o conteúdo do CMS no HTML inicial', () => {
    const cmsPublic = readFileSync(new URL('../api/cms/public.js', import.meta.url), 'utf8')
    expect(cmsPublic).toContain('renderCmsArticleContent(article, author)')
    expect(cmsPublic).toContain('article.content_html')
    expect(cmsPublic).toContain('data-prerendered-content')
  })

  it('mantém no sitemap somente artigos estáticos realmente publicados', () => {
    const cmsPublic = readFileSync(new URL('../api/cms/public.js', import.meta.url), 'utf8')
    const legacyBlock = cmsPublic.match(/const legacyArticlePaths = \[([\s\S]*?)\]/)?.[1] || ''
    const sitemapArticlePaths = [...legacyBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]).sort()
    const publishedArticlePaths = getPublishedBlogArticles().map((article) => article.path).sort()
    expect(sitemapArticlePaths).toEqual(publishedArticlePaths)
  })

  it('usa datas editoriais verificáveis no lastmod do sitemap', () => {
    const cmsPublic = readFileSync(new URL('../api/cms/public.js', import.meta.url), 'utf8')
    const rssFeed = readFileSync(new URL('./services/rssFeed.ts', import.meta.url), 'utf8')

    expect(rssFeed).toContain('<atom:updated>')
    expect(cmsPublic).toContain("rssField(block, 'atom:updated')")
    expect(cmsPublic).toContain('<lastmod>')
    expect(cmsPublic).toContain('article.updated_at || article.published_at')
  })
})
