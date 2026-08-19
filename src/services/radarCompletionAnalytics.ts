import { analyticsAllowed, loadGoogleAnalytics } from './cookieConsent'
import { trackRadarComplete, trackRadarResult } from './radarFunnelAnalytics'

const PENDING_COMPLETION_KEY = 'praxia:ga4:pending-radar-complete'
const SENT_COMPLETION_PREFIX = 'praxia:ga4:radar-complete:'
const CONFIRMED_COMPLETION_KEY = 'praxia:radar:confirmed-completion'

function analyticsDebug(message: string, details?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.info(`[PraxIA analytics] ${message}`, details ?? {})
}

type CompletionParameters = { totalQuestions: number; completionTimeSeconds: number; scoreRange: string }

function sendRadarCompletion(completionId: string, parameters?: CompletionParameters) {
  if (!completionId || window.localStorage.getItem(`${SENT_COMPLETION_PREFIX}${completionId}`)) return false

  analyticsDebug('Tentativa de radar_complete', {
    consent: analyticsAllowed(),
    completionIdPresent: Boolean(completionId),
  })
  loadGoogleAnalytics()
  if (typeof window.gtag !== 'function' || !Array.isArray(window.dataLayer)) {
    analyticsDebug('radar_complete não enviado: GA4 indisponível')
    return false
  }

  if (parameters) trackRadarResult(completionId, parameters.totalQuestions, parameters.completionTimeSeconds, parameters.scoreRange)
  else trackRadarComplete(completionId)
  window.localStorage.setItem(`${SENT_COMPLETION_PREFIX}${completionId}`, 'sent')
  window.localStorage.removeItem(PENDING_COMPLETION_KEY)
  analyticsDebug('radar_complete enviado com sucesso')
  return true
}

export function trackRadarCompletion(completionId: string) {
  if (typeof window === 'undefined' || !completionId) return
  if (window.localStorage.getItem(`${SENT_COMPLETION_PREFIX}${completionId}`)) return

  if (!analyticsAllowed()) {
    window.localStorage.setItem(PENDING_COMPLETION_KEY, completionId)
    return
  }

  if (!sendRadarCompletion(completionId)) {
    window.localStorage.setItem(PENDING_COMPLETION_KEY, completionId)
  }
}

export function flushPendingRadarCompletion() {
  if (typeof window === 'undefined' || !analyticsAllowed()) return
  const completionId = window.localStorage.getItem(PENDING_COMPLETION_KEY)
  if (completionId) sendRadarCompletion(completionId)
}

export function markRadarCompletionSaved(completionId: string) {
  if (typeof window === 'undefined' || !completionId) return
  window.localStorage.setItem(CONFIRMED_COMPLETION_KEY, completionId)
}

export function trackRadarCompletionAfterReport(completionId: string, parameters?: CompletionParameters) {
  if (typeof window === 'undefined' || !completionId) return
  if (window.localStorage.getItem(CONFIRMED_COMPLETION_KEY) !== completionId) return

  if (parameters) {
    trackRadarResult(completionId, parameters.totalQuestions, parameters.completionTimeSeconds, parameters.scoreRange)
    window.localStorage.setItem(`${SENT_COMPLETION_PREFIX}${completionId}`, 'sent')
    window.localStorage.removeItem(PENDING_COMPLETION_KEY)
  } else {
    trackRadarCompletion(completionId)
  }
  window.localStorage.removeItem(CONFIRMED_COMPLETION_KEY)
}
