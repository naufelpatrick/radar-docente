import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  flushPendingRadarCompletion,
  markRadarCompletionSaved,
  trackRadarCompletion,
  trackRadarCompletionAfterReport,
} from './radarCompletionAnalytics'

function createWindow(preference?: 'accepted' | 'essential_only') {
  const localValues = new Map<string, string>()
  const sessionValues = new Map<string, string>()
  if (preference) localValues.set('praxia:cookie-preference:v1', preference)
  const gtag = vi.fn()
  return {
    values: localValues,
    gtag,
    window: {
      gtag,
      dataLayer: [],
      innerWidth: 390,
      location: {
        pathname: '/radar/resultado',
        search: '?utm_source=linkedin&utm_medium=organic_social&utm_campaign=blog_growth_sprint01&utm_content=fluencia_provocacao_a',
      },
      localStorage: {
        getItem: (key: string) => localValues.get(key) ?? null,
        setItem: (key: string, value: string) => localValues.set(key, value),
        removeItem: (key: string) => localValues.delete(key),
      },
      sessionStorage: {
        getItem: (key: string) => sessionValues.get(key) ?? null,
        setItem: (key: string, value: string) => sessionValues.set(key, value),
        removeItem: (key: string) => sessionValues.delete(key),
      },
    },
  }
}

describe('conclusão do Radar no GA4', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia radar_complete com a origem prevista e a variação da campanha', () => {
    const context = createWindow('accepted')
    vi.stubGlobal('window', context.window)
    vi.stubGlobal('document', { querySelector: () => ({}), documentElement: { setAttribute: vi.fn() } })

    trackRadarCompletion('session-2026-07-29')

    expect(context.gtag).toHaveBeenCalledWith('event', 'radar_complete', expect.objectContaining({
      source: 'radar_praxia',
      traffic_source: 'linkedin',
      traffic_medium: 'organic_social',
      traffic_campaign: 'blog_growth_sprint01',
      traffic_content: 'fluencia_provocacao_a',
    }))
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
    vi.stubGlobal('document', { querySelector: () => ({}), documentElement: { setAttribute: vi.fn() } })

    trackRadarCompletion('session-2')
    expect(context.gtag).not.toHaveBeenCalled()
    expect(context.values.get('praxia:ga4:pending-radar-complete')).toBe('session-2')

    context.values.set('praxia:cookie-preference:v1', 'accepted')
    flushPendingRadarCompletion()
    flushPendingRadarCompletion()

    expect(context.gtag.mock.calls.filter(([command]) => command === 'event')).toHaveLength(1)
  })

  it('não mede uma visita direta ao resultado sem confirmação do Supabase', () => {
    const context = createWindow('accepted')
    vi.stubGlobal('window', context.window)
    vi.stubGlobal('document', { querySelector: () => ({}), documentElement: { setAttribute: vi.fn() } })

    trackRadarCompletionAfterReport('session-direta')

    expect(context.gtag).not.toHaveBeenCalled()
  })

  it('consome a confirmação após o relatório montar e não repete no reload', () => {
    const context = createWindow('accepted')
    vi.stubGlobal('window', context.window)
    vi.stubGlobal('document', { querySelector: () => ({}), documentElement: { setAttribute: vi.fn() } })

    markRadarCompletionSaved('session-confirmada')
    trackRadarCompletionAfterReport('session-confirmada')
    trackRadarCompletionAfterReport('session-confirmada')

    expect(context.gtag.mock.calls.filter(([command, event]) => command === 'event' && event === 'radar_complete')).toHaveLength(1)
    expect(context.values.has('praxia:radar:confirmed-completion')).toBe(false)
  })
})
