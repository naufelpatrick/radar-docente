export type CookiePreference = 'accepted' | 'essential_only'
export type CookiePreferencesState = {
  analytics: boolean
  marketing: boolean
}

export const COOKIE_PREFERENCE_KEY = 'praxia:cookie-preference:v1'
export const COOKIE_PREFERENCES_KEY = 'praxia:cookie-preferences:v2'
export const COOKIE_PREFERENCES_EVENT = 'praxia:open-cookie-preferences'
export const ANALYTICS_CONSENT_GRANTED_EVENT = 'praxia:analytics-consent-granted'
export const MARKETING_CONSENT_GRANTED_EVENT = 'praxia:marketing-consent-granted'
const GA_ID = 'G-9JR9Q9KSV6'
const GOOGLE_ADS_ID = 'AW-18356888280'
const GOOGLE_TAG_SELECTOR = 'script[data-praxia-google-tag]'
const ANALYTICS_INITIALIZED_ATTRIBUTE = 'data-praxia-analytics-initialized'

function analyticsDebug(message: string, details?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.info(`[PraxIA analytics] ${message}`, details ?? {})
}

function readLegacyPreference(): CookiePreference | null {
  try {
    const value = window.localStorage.getItem(COOKIE_PREFERENCE_KEY)
    return value === 'accepted' || value === 'essential_only' ? value : null
  } catch {
    return null
  }
}

export function readCookiePreferences(): CookiePreferencesState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CookiePreferencesState>
      if (typeof parsed.analytics === 'boolean' && typeof parsed.marketing === 'boolean') {
        return { analytics: parsed.analytics, marketing: parsed.marketing }
      }
    }
  } catch {
    // Fall through to the legacy preference when the v2 value is invalid.
  }

  const legacy = readLegacyPreference()
  if (legacy === 'accepted') {
    // Historical consent covered measurement only. Do not infer marketing consent.
    return { analytics: true, marketing: false }
  }
  if (legacy === 'essential_only') return { analytics: false, marketing: false }
  return null
}

export function readCookiePreference(): CookiePreference | null {
  const preferences = readCookiePreferences()
  if (!preferences) return null
  return preferences.analytics || preferences.marketing ? 'accepted' : 'essential_only'
}

export function saveCookiePreferences(preferences: CookiePreferencesState) {
  window.localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences))
  window.localStorage.removeItem(COOKIE_PREFERENCE_KEY)
  if (preferences.analytics) window.dispatchEvent(new Event(ANALYTICS_CONSENT_GRANTED_EVENT))
  if (preferences.marketing) window.dispatchEvent(new Event(MARKETING_CONSENT_GRANTED_EVENT))
}

export function saveCookiePreference(preference: CookiePreference) {
  // Backward-compatible API: historical "accepted" meant measurement only.
  // Marketing consent must always come from the granular v2 preferences UI.
  saveCookiePreferences({
    analytics: preference === 'accepted',
    marketing: false,
  })
}

export function analyticsAllowed() {
  return readCookiePreferences()?.analytics === true
}

export function marketingAllowed() {
  return readCookiePreferences()?.marketing === true
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

  if (!window.praxiaGoogleTagInitialized) {
    window.gtag('js', new Date())
    window.praxiaGoogleTagInitialized = true
  }
}

function ensureGoogleTagScript(id: string) {
  if (document.querySelector(GOOGLE_TAG_SELECTOR)) return true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  script.dataset.praxiaGoogleTag = id
  document.head.appendChild(script)
  return true
}

export function loadGoogleAnalytics() {
  const consent = analyticsAllowed()
  analyticsDebug('Consentimento analítico verificado', { consent })
  if (!consent) return false

  initializeGoogleGlobals()
  if (!window.praxiaAnalyticsConfigured) {
    window.gtag?.('config', GA_ID, { anonymize_ip: true })
    window.praxiaAnalyticsConfigured = true
  }
  document.documentElement?.setAttribute(ANALYTICS_INITIALIZED_ATTRIBUTE, 'true')
  ensureGoogleTagScript(GA_ID)
  return true
}

export function loadGoogleAds() {
  if (!marketingAllowed()) return false
  initializeGoogleGlobals()
  if (!window.praxiaGoogleAdsConfigured) {
    window.gtag?.('config', GOOGLE_ADS_ID)
    window.praxiaGoogleAdsConfigured = true
  }
  ensureGoogleTagScript(GOOGLE_ADS_ID)
  return true
}

export function initializeAnalyticsFromStoredConsent() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  return loadGoogleAnalytics()
}

export function initializeMarketingFromStoredConsent() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  return loadGoogleAds()
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))
}
