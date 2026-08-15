import { analyticsAllowed } from './cookieConsent'

export type DigitalFluencyCtaLocation = 'hero' | 'dimensions' | 'final'

export function trackDigitalFluencyRadarCta(ctaLocation: DigitalFluencyCtaLocation) {
  if (typeof window === 'undefined' || !analyticsAllowed() || typeof window.gtag !== 'function') return
  window.gtag('event', 'fluencia_digital_radar_cta_click', {
    page_path: '/fluencia-digital-para-professores',
    cta_location: ctaLocation,
  })
}
