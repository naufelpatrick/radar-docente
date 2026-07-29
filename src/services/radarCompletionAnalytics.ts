import { analyticsAllowed, loadGoogleAnalytics } from './cookieConsent'

const PENDING_COMPLETION_KEY = 'praxia:ga4:pending-radar-complete'
const SENT_COMPLETION_PREFIX = 'praxia:ga4:radar-complete:'

function sendRadarCompletion(completionId: string) {
  if (!completionId || window.localStorage.getItem(`${SENT_COMPLETION_PREFIX}${completionId}`)) return

  loadGoogleAnalytics()
  if (typeof window.gtag !== 'function') return

  window.gtag('event', 'radar_complete', {
    source: 'radar_praxia',
  })
  window.localStorage.setItem(`${SENT_COMPLETION_PREFIX}${completionId}`, 'sent')
  window.localStorage.removeItem(PENDING_COMPLETION_KEY)
}

export function trackRadarCompletion(completionId: string) {
  if (typeof window === 'undefined' || !completionId) return
  if (window.localStorage.getItem(`${SENT_COMPLETION_PREFIX}${completionId}`)) return

  if (!analyticsAllowed()) {
    window.localStorage.setItem(PENDING_COMPLETION_KEY, completionId)
    return
  }

  sendRadarCompletion(completionId)
}

export function flushPendingRadarCompletion() {
  if (typeof window === 'undefined' || !analyticsAllowed()) return
  const completionId = window.localStorage.getItem(PENDING_COMPLETION_KEY)
  if (completionId) sendRadarCompletion(completionId)
}
