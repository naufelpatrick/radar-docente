import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackLinksClick } from './linksAnalytics'

describe('analytics da página de links', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('registra o clique uma vez com os parâmetros da página', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => 'accepted' } })

    trackLinksClick('links_blog_click', {
      link_name: 'Blog',
      link_destination: '/blog',
      link_position: 2,
    })

    expect(gtag).toHaveBeenCalledOnce()
    expect(gtag).toHaveBeenCalledWith('event', 'links_blog_click', {
      link_name: 'Blog',
      link_destination: '/blog',
      link_position: 2,
      page_path: '/links',
    })
  })

  it('respeita a recusa de cookies analíticos', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => 'rejected' } })

    trackLinksClick('links_diagnostico_click', {
      link_name: 'Diagnóstico',
      link_destination: '/radar',
      link_position: 1,
    })

    expect(gtag).not.toHaveBeenCalled()
  })
})
