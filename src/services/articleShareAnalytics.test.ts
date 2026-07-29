import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackArticleShare } from './articleShareAnalytics'

afterEach(() => vi.unstubAllGlobals())

describe('analytics de compartilhamento de artigo', () => {
  it('registra compartilhamento sem conteúdo ou dados pessoais', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => 'accepted' } })

    trackArticleShare('Título com acento', 'titulo-com-acento', 'linkedin')

    expect(gtag).toHaveBeenCalledWith('event', 'article_share', {
      article_title: 'Título com acento',
      article_slug: 'titulo-com-acento',
      share_method: 'linkedin',
    })
  })

  it('usa evento específico para copiar link', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => 'accepted' } })

    trackArticleShare('Artigo', 'artigo', 'copy_link')

    expect(gtag).toHaveBeenCalledWith('event', 'article_copy_link', expect.objectContaining({
      share_method: 'copy_link',
    }))
  })
})
