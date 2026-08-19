import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BlogArticle } from '../data/blogArticles'
import {
  trackBlogArticleView,
  trackBlogRadarCtaClick,
  trackBlogScrollDepth,
} from './blogGrowthAnalytics'

vi.mock('./cookieConsent', () => ({
  analyticsAllowed: () => true,
  loadGoogleAnalytics: () => true,
}))

const article = {
  slug: 'o-que-e-fluencia-digital-para-professores',
  path: '/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores',
  category: 'Fluência Digital',
  categorySlug: 'fluencia-digital',
  status: 'published',
} as BlogArticle

describe('analytics de growth do blog', () => {
  beforeEach(() => {
    const sent = new Map<string, string>()
    vi.stubGlobal('window', {
      gtag: vi.fn(),
      sessionStorage: {
        getItem: (key: string) => sent.get(key) ?? null,
        setItem: (key: string, value: string) => sent.set(key, value),
      },
    })
  })

  it('mede visualização e profundidade sem duplicar o mesmo marco na sessão', () => {
    trackBlogArticleView(article)
    trackBlogArticleView(article)
    trackBlogScrollDepth(article, 50)
    trackBlogScrollDepth(article, 50)
    trackBlogScrollDepth(article, 90)

    expect(window.gtag).toHaveBeenCalledTimes(3)
    expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'blog_article_view', {
      article_slug: article.slug,
      article_category: article.categorySlug,
      article_path: article.path,
    })
    expect(window.gtag).toHaveBeenNthCalledWith(2, 'event', 'blog_scroll_depth', expect.objectContaining({ scroll_depth: 50 }))
    expect(window.gtag).toHaveBeenNthCalledWith(3, 'event', 'blog_scroll_depth', expect.objectContaining({ scroll_depth: 90 }))
  })

  it('mede clique do artigo para o Radar com posição e destino', () => {
    trackBlogRadarCtaClick(article, 'intermediate', '/radar')

    expect(window.gtag).toHaveBeenCalledWith('event', 'blog_radar_cta_click', {
      article_slug: article.slug,
      article_category: article.categorySlug,
      article_path: article.path,
      cta_location: 'intermediate',
      destination_path: '/radar',
    })
  })
})
