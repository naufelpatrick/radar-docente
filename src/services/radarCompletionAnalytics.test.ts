import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPendingRadarCompletion, trackRadarCompletion } from './radarCompletionAnalytics'

function createWindow(preference?: 'accepted' | 'essential_only') {
  const values = new Map<string, string>()
  if (preference) values.set('praxia:cookie-preference:v1', preference)
  const gtag = vi.fn()
  return {
    values,
    gtag,
    window: {
      gtag,
      dataLayer: [],
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    },
  }
}

describe('conclusão do Radar no GA4', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia radar_complete com a origem prevista', () => {
    const context = createWindow('accepted')
    vi.stubGlobal('window', context.window)
    vi.stubGlobal('document', { querySelector: () => ({}) })

    trackRadarCompletion('session-2026-07-29')

    expect(context.gtag).toHaveBeenCalledTimes(1)
    expect(context.gtag).toHaveBeenCalledWith('event', 'radar_complete', {
      source: 'radar_praxia',
    })
  })

  it('não envia novamente a mesma conclusão', () => {
    const context = createWindow('accepted')
    context.values.set('praxia:ga4:radar-complete:session-1', 'sent')
    vi.stubGlobal('window', context.window)

    trackRadarCompletion('session-1')

    expect(context.gtag).not.toHaveBeenCalled()
  })

  it('aguarda autorização e envia uma única vez depois dela', () => {
    const context = createWindow()
    vi.stubGlobal('window', context.window)
    vi.stubGlobal('document', { querySelector: () => ({}) })

    trackRadarCompletion('session-2')
    expect(context.gtag).not.toHaveBeenCalled()
    expect(context.values.get('praxia:ga4:pending-radar-complete')).toBe('session-2')

    context.values.set('praxia:cookie-preference:v1', 'accepted')
    flushPendingRadarCompletion()
    flushPendingRadarCompletion()

    expect(context.gtag).toHaveBeenCalledTimes(1)
  })
})
