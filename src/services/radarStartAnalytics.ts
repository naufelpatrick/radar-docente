import { analyticsAllowed } from './cookieConsent'

const SENT_START_PREFIX = 'praxia:ga4:radar-start:'

export function trackRadarStart(sessionId: string) {
  if (typeof window === 'undefined' || !sessionId || !analyticsAllowed() || typeof window.gtag !== 'function') return
  if (window.sessionStorage.getItem(`${SENT_START_PREFIX}${sessionId}`)) return

  window.gtag('event', 'radar_start', {
    source: 'radar_praxia',
  })
  window.sessionStorage.setItem(`${SENT_START_PREFIX}${sessionId}`, 'sent')
}
