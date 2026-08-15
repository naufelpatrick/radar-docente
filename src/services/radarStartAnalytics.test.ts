import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackRadarStart } from './radarStartAnalytics'

describe('analytics de início do Radar', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia radar_start sem respostas ou dados identificáveis', () => {
    const gtag = vi.fn()
    const sessionStorage = { getItem: vi.fn(() => null), setItem: vi.fn() }
    vi.stubGlobal('window', {
      gtag,
      localStorage: { getItem: () => 'accepted' },
      sessionStorage,
    })

    trackRadarStart('session-1')

    expect(gtag).toHaveBeenCalledWith('event', 'radar_start', { source: 'radar_praxia' })
    expect(JSON.stringify(gtag.mock.calls[0])).not.toMatch(/answer|email|name|profile|score/i)
    expect(sessionStorage.setItem).toHaveBeenCalledWith('praxia:ga4:radar-start:session-1', 'sent')
  })

  it('não envia sem consentimento de analytics', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      localStorage: { getItem: () => null },
      sessionStorage: { getItem: () => null, setItem: vi.fn() },
    })

    trackRadarStart('session-2')

    expect(gtag).not.toHaveBeenCalled()
  })

  it('não duplica o evento na mesma sessão do Radar', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      localStorage: { getItem: () => 'accepted' },
      sessionStorage: { getItem: () => 'sent', setItem: vi.fn() },
    })

    trackRadarStart('session-3')

    expect(gtag).not.toHaveBeenCalled()
  })
})
