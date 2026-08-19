import { analyticsAllowed } from './cookieConsent'

const RADAR_TRAFFIC_KEY = 'praxia:ga4:radar-traffic'

export type TrafficAttribution = {
  traffic_source?: string
  traffic_medium?: string
  traffic_campaign?: string
  traffic_content?: string
}

export function readTrafficAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.sessionStorage.getItem(RADAR_TRAFFIC_KEY) || '{}') as TrafficAttribution
  } catch {
    return {}
  }
}

export function captureTrafficAttribution() {
  if (typeof window === 'undefined' || !analyticsAllowed()) return false
  const query = new URLSearchParams(window.location.search)
  const traffic: TrafficAttribution = {
    traffic_source: query.get('utm_source') || undefined,
    traffic_medium: query.get('utm_medium') || undefined,
    traffic_campaign: query.get('utm_campaign') || undefined,
    traffic_content: query.get('utm_content') || undefined,
  }
  if (!traffic.traffic_source && !traffic.traffic_medium && !traffic.traffic_campaign && !traffic.traffic_content) return false
  try {
    window.sessionStorage.setItem(RADAR_TRAFFIC_KEY, JSON.stringify(traffic))
    return true
  } catch {
    return false
  }
}
