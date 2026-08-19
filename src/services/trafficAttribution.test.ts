import { afterEach, describe, expect, it, vi } from 'vitest'
import { captureTrafficAttribution, readTrafficAttribution } from './trafficAttribution'

vi.mock('./cookieConsent', () => ({ analyticsAllowed: () => true }))

describe('atribuição de tráfego para o funil do Radar', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('preserva UTMs da página de entrada para o funil do Radar', () => {
    const values = new Map<string, string>()
    const setItem = vi.fn((key: string, value: string) => values.set(key, value))
    vi.stubGlobal('window', {
      location: { search: '?utm_source=linkedin&utm_medium=organic_social&utm_campaign=blog_growth_sprint01&utm_content=fluencia_provocacao_a' },
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem,
      },
    })

    expect(captureTrafficAttribution()).toBe(true)
    expect(setItem).toHaveBeenCalledWith(
      'praxia:ga4:radar-traffic',
      JSON.stringify({
        traffic_source: 'linkedin',
        traffic_medium: 'organic_social',
        traffic_campaign: 'blog_growth_sprint01',
        traffic_content: 'fluencia_provocacao_a',
      }),
    )
    expect(readTrafficAttribution()).toEqual({
      traffic_source: 'linkedin',
      traffic_medium: 'organic_social',
      traffic_campaign: 'blog_growth_sprint01',
      traffic_content: 'fluencia_provocacao_a',
    })
  })

  it('não grava atribuição quando a URL não possui UTMs', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', {
      location: { search: '' },
      sessionStorage: { getItem: () => null, setItem },
    })

    expect(captureTrafficAttribution()).toBe(false)
    expect(setItem).not.toHaveBeenCalled()
  })
})
