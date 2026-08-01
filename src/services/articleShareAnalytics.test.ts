import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackArticleShare } from './articleShareAnalytics'

afterEach(() => vi.unstubAllGlobals())

describe('analytics de compartilhamento de artigo', () => {
  it('registra compartilhamento sem conteúdo ou dados pessoais', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, location: { href: 'https://www.radarpraxia.com/blog/artigo' }, localStorage: { getItem: () => 'accepted' } })

    trackArticleShare('linkedin')

    expect(gtag).toHaveBeenCalledWith('event', 'share', {
      method: 'linkedin',
      content_type: 'article',
      item_id: 'article_share',
      page_location: expect.any(String),
    })
  })

  it('usa o método padronizado para copiar link', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, location: { href: 'https://www.radarpraxia.com/blog/artigo' }, localStorage: { getItem: () => 'accepted' } })

    trackArticleShare('copylink')

    expect(gtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
      method: 'copylink',
    }))
  })
})
