import { afterEach, describe, expect, it, vi } from 'vitest'
import { captureTrafficAttribution } from './trafficAttribution'

vi.mock('./cookieConsent', () => ({ analyticsAllowed: () => true }))

describe('atribuição de tráfego para o funil do Radar', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('preserva UTMs da página de entrada para o funil do Radar', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', {
      location: { search: '?utm_source=linkedin&utm_medium=social&utm_campaign=blog_growth' },
      sessionStorage: { setItem },
    })

    expect(captureTrafficAttribution()).toBe(true)
    expect(setItem).toHaveBeenCalledWith(
      'praxia:ga4:radar-traffic',
      JSON.stringify({
        traffic_source: 'linkedin',
        traffic_medium: 'social',
        traffic_campaign: 'blog_growth',
      }),
    )
  })

  it('não grava atribuição quando a URL não possui UTMs', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', {
      location: { search: '' },
      sessionStorage: { setItem },
    })

    expect(captureTrafficAttribution()).toBe(false)
    expect(setItem).not.toHaveBeenCalled()
  })
})
