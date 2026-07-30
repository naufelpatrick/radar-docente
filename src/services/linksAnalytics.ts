import type { LinksPageEvent } from '../data/linksPage'
import { analyticsAllowed } from './cookieConsent'

interface LinkClickParameters {
  link_name: string
  link_destination: string
  link_position: number
}

export function trackLinksClick(event: LinksPageEvent, parameters: LinkClickParameters) {
  if (typeof window === 'undefined' || !analyticsAllowed() || typeof window.gtag !== 'function') return
  window.gtag('event', event, {
    ...parameters,
    page_path: '/links',
  })
}
