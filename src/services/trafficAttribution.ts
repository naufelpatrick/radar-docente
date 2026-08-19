import { analyticsAllowed } from './cookieConsent'

const RADAR_TRAFFIC_KEY = 'praxia:ga4:radar-traffic'

export function captureTrafficAttribution() {
  if (typeof window === 'undefined' || !analyticsAllowed()) return false
  const query = new URLSearchParams(window.location.search)
  const traffic = {
    traffic_source: query.get('utm_source') || undefined,
    traffic_medium: query.get('utm_medium') || undefined,
    traffic_campaign: query.get('utm_campaign') || undefined,
  }
  if (!traffic.traffic_source && !traffic.traffic_medium && !traffic.traffic_campaign) return false
  try {
    window.sessionStorage.setItem(RADAR_TRAFFIC_KEY, JSON.stringify(traffic))
    return true
  } catch {
    return false
  }
}
