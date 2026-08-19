import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  flushPendingRadarEvents,
  recordRadarStep,
  trackExpiredRadarAbandon,
  trackRadarConsentAccepted,
  trackRadarLanding,
  trackRadarProfileComplete,
  trackRadarProfileStarted,
  trackRadarQuestion,
  trackRadarResult,
  trackRadarStart,
} from './radarFunnelAnalytics'

function storage() {
  const values = new Map<string, string>()
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe('funil do Radar no GA4', () => {
  const localStorage = storage()
  const sessionStorage = storage()
  const gtag = vi.fn()

  beforeEach(() => {
    localStorage.values.clear()
    sessionStorage.values.clear()
    gtag.mockClear()
    localStorage.setItem('praxia:cookie-preference:v1', 'accepted')
    vi.stubGlobal('window', {
      gtag,
      dataLayer: [],
      localStorage,
      sessionStorage,
      innerWidth: 390,
      location: {
        pathname: '/radar',
        search: '?utm_source=linkedin&utm_medium=organic_social&utm_campaign=blog_growth_sprint01&utm_content=fluencia_provocacao_a',
      },
    })
    vi.stubGlobal('document', { querySelector: () => ({}), documentElement: { setAttribute: vi.fn() } })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('envia as etapas no momento solicitado sem duplicar a landing', () => {
    trackRadarLanding('attempt-1')
    trackRadarLanding('attempt-1')
    trackRadarStart('attempt-1', 'continue', 'radar_intro')
    trackRadarConsentAccepted('attempt-1')
    trackRadarProfileStarted('attempt-1')
    trackRadarProfileComplete('attempt-1', 'higher_postgraduate')

    expect(gtag.mock.calls.filter((call) => call[0] === 'event').map((call) => call[1])).toEqual([
      'radar_landing_view',
      'radar_start_click',
      'radar_consent_accepted',
      'radar_profile_started',
      'radar_profile_complete',
    ])
    const landing = gtag.mock.calls.find((call) => call[1] === 'radar_landing_view')
    expect(landing?.[2]).toMatchObject({
      traffic_source: 'linkedin',
      traffic_medium: 'organic_social',
      traffic_campaign: 'blog_growth_sprint01',
      traffic_content: 'fluencia_provocacao_a',
      device_type: 'mobile',
    })
  })

  it('envia apenas os marcos 1, 10, 20 e 30 uma vez, mesmo ao voltar', () => {
    for (const question of [1, 2, 10, 11, 20, 30, 10, 1]) trackRadarQuestion('attempt-2', question, 30)

    const events = gtag.mock.calls.filter((call) => call[1] === 'radar_progress')
    expect(events.map((call) => call[2].question_number)).toEqual([1, 10, 20, 30])
    expect(events.map((call) => call[2].progress_percent)).toEqual([3, 33, 67, 100])
    expect(gtag.mock.calls.filter((call) => call[1] === 'radar_questionnaire_started')).toHaveLength(1)
  })

  it('mantém eventos pendentes até o consentimento analítico', () => {
    localStorage.setItem('praxia:cookie-preference:v1', 'essential_only')
    trackRadarLanding('attempt-3')
    expect(gtag).not.toHaveBeenCalled()

    localStorage.setItem('praxia:cookie-preference:v1', 'accepted')
    flushPendingRadarEvents()
    flushPendingRadarEvents()
    expect(gtag.mock.calls.filter((call) => call[1] === 'radar_landing_view')).toHaveLength(1)
  })

  it('envia conclusão e resultado uma única vez, preservando a variação da campanha e sem score individual', () => {
    trackRadarResult('attempt-4', 30, 480, 'integration')
    trackRadarResult('attempt-4', 30, 480, 'integration')

    expect(gtag.mock.calls.filter((call) => call[1] === 'radar_complete')).toHaveLength(1)
    expect(gtag.mock.calls.filter((call) => call[1] === 'radar_result_view')).toHaveLength(1)
    const parameters = gtag.mock.calls.find((call) => call[1] === 'radar_complete')?.[2]
    expect(parameters).toMatchObject({
      total_questions: 30,
      completion_time_seconds: 480,
      score_range: 'integration',
      traffic_content: 'fluencia_provocacao_a',
    })
    expect(parameters).not.toHaveProperty('score')
  })

  it('registra abandono somente depois da expiração e não duplica', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000)
    recordRadarStep('attempt-5', 'questionnaire', 10, 30)
    expect(trackExpiredRadarAbandon(1_000 + 29 * 60 * 1000)).toBe(false)
    trackExpiredRadarAbandon(1_000 + 31 * 60 * 1000)
    trackExpiredRadarAbandon(1_000 + 32 * 60 * 1000)

    const abandon = gtag.mock.calls.filter((call) => call[1] === 'radar_abandon')
    expect(abandon).toHaveLength(1)
    expect(abandon[0][2]).toMatchObject({ last_step: 'questionnaire', last_question: 10, progress_percent: 33 })
    vi.restoreAllMocks()
  })

  it('remove propriedades proibidas antes de enviar', () => {
    trackRadarProfileComplete('attempt-6', 'higher_postgraduate')
    const serialized = JSON.stringify(gtag.mock.calls)
    for (const prohibited of ['email', 'phone', 'institution', 'answer', 'lead_id', 'supabase']) {
      expect(serialized).not.toContain(prohibited)
    }
  })
})
