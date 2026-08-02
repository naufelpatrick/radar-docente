import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackArticleShare } from './articleShareAnalytics'

afterEach(() => vi.unstubAllGlobals())

describe('analytics de compartilhamento de artigo', () => {
  it('registra compartilhamento sem conteúdo ou dados pessoais', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      location: {
        origin: 'https://www.radarpraxia.com',
        pathname: '/blog/artigo',
        href: 'https://www.radarpraxia.com/blog/artigo?utm_source=sessao&email=pessoa%40example.com#secao',
      },
      localStorage: { getItem: () => 'accepted' },
    })

    trackArticleShare('linkedin')

    expect(gtag).toHaveBeenCalledWith('event', 'share', {
      method: 'linkedin',
      content_type: 'article',
      item_id: 'article_share',
      page_location: 'https://www.radarpraxia.com/blog/artigo',
    })
  })

  it('usa o método padronizado para copiar link', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      location: { origin: 'https://www.radarpraxia.com', pathname: '/blog/artigo' },
      localStorage: { getItem: () => 'accepted' },
    })

    trackArticleShare('copylink')

    expect(gtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
      method: 'copylink',
    }))
  })
})
