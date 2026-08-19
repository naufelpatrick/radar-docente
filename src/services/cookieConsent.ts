export type CookiePreference = 'accepted' | 'essential_only'

export const COOKIE_PREFERENCE_KEY = 'praxia:cookie-preference:v1'
export const COOKIE_PREFERENCES_EVENT = 'praxia:open-cookie-preferences'
export const ANALYTICS_CONSENT_GRANTED_EVENT = 'praxia:analytics-consent-granted'
const GA_ID = 'G-9JR9Q9KSV6'
const GOOGLE_ADS_ID = 'AW-18356888280'
const GOOGLE_TAG_SELECTOR = `script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"], script[data-praxia-analytics="${GA_ID}"]`
const ANALYTICS_INITIALIZED_ATTRIBUTE = 'data-praxia-analytics-initialized'

function analyticsDebug(message: string, details?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.info(`[PraxIA analytics] ${message}`, details ?? {})
}

export function readCookiePreference(): CookiePreference | null {
  try {
    const value = window.localStorage.getItem(COOKIE_PREFERENCE_KEY)
    return value === 'accepted' || value === 'essential_only' ? value : null
  } catch {
    return null
  }
}

export function saveCookiePreference(preference: CookiePreference) {
  window.localStorage.setItem(COOKIE_PREFERENCE_KEY, preference)
  if (preference === 'accepted') window.dispatchEvent(new Event(ANALYTICS_CONSENT_GRANTED_EVENT))
}

export function analyticsAllowed() {
  return readCookiePreference() === 'accepted'
}

function initializeGoogleGlobals() {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // Google recommends the arguments object here because gtag.js consumes this queue format.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
    }
  }

  if (!window.praxiaAnalyticsConfigured) {
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true })
    window.gtag('config', GOOGLE_ADS_ID)
    window.praxiaAnalyticsConfigured = true
  }

  document.documentElement?.setAttribute(ANALYTICS_INITIALIZED_ATTRIBUTE, 'true')
  analyticsDebug('GA4 inicializado', {
    consent: true,
    dataLayer: Array.isArray(window.dataLayer),
    gtag: typeof window.gtag,
  })
}

export function loadGoogleAnalytics() {
  const consent = analyticsAllowed()
  analyticsDebug('Consentimento analítico verificado', { consent })
  if (!consent) return false

  initializeGoogleGlobals()

  if (document.querySelector(GOOGLE_TAG_SELECTOR)) return true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.dataset.praxiaAnalytics = GA_ID
  document.head.appendChild(script)
  return true
}

export function initializeAnalyticsFromStoredConsent() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  return loadGoogleAnalytics()
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))
}
