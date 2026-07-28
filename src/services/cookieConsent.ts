export type CookiePreference = 'accepted' | 'essential_only'

export const COOKIE_PREFERENCE_KEY = 'praxia:cookie-preference:v1'
export const COOKIE_PREFERENCES_EVENT = 'praxia:open-cookie-preferences'
const GA_ID = 'G-9JR9Q9KSV6'
const GOOGLE_ADS_ID = 'AW-18356888280'

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
}

export function analyticsAllowed() {
  return readCookiePreference() === 'accepted'
}

export function loadGoogleAnalytics() {
  if (!analyticsAllowed() || document.querySelector(`script[data-praxia-analytics="${GA_ID}"]`)) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
  window.gtag('config', GOOGLE_ADS_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.dataset.praxiaAnalytics = GA_ID
  document.head.appendChild(script)
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))
}
