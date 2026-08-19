import { marketingAllowed } from './cookieConsent'

export const META_PIXEL_ID = '1758001775245327'
const META_SCRIPT_SELECTOR = 'script[data-praxia-meta-pixel]'
const META_SESSION_PREFIX = 'praxia:meta:'

type MetaEventValue = string | number | boolean
type MetaEventParameters = Record<string, MetaEventValue | undefined>

function safeSessionStorage() {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function clean(parameters: MetaEventParameters) {
  return Object.fromEntries(Object.entries(parameters).filter(([, value]) => (
    value !== undefined && value !== null && ['string', 'number', 'boolean'].includes(typeof value)
  ))) as Record<string, MetaEventValue>
}

function ensureFbq() {
  if (typeof window.fbq === 'function') return window.fbq

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as NonNullable<Window['fbq']>

  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  window.fbq = fbq
  window._fbq = fbq
  return fbq
}

export function loadMetaPixel() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !marketingAllowed()) return false

  const fbq = ensureFbq()
  if (!window.praxiaMetaPixelConfigured) {
    fbq('init', META_PIXEL_ID)
    window.praxiaMetaPixelConfigured = true
  }

  if (!document.querySelector(META_SCRIPT_SELECTOR)) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.dataset.praxiaMetaPixel = META_PIXEL_ID
    document.head.appendChild(script)
  }

  return true
}

function dispatch(kind: 'track' | 'trackCustom', name: string, parameters: MetaEventParameters = {}) {
  if (!loadMetaPixel() || typeof window.fbq !== 'function') return false
  window.fbq(kind, name, clean(parameters))
  return true
}

function trackOnce(key: string, kind: 'track' | 'trackCustom', name: string, parameters: MetaEventParameters = {}) {
  const storage = safeSessionStorage()
  const storageKey = `${META_SESSION_PREFIX}${key}`
  if (storage?.getItem(storageKey)) return false
  if (!dispatch(kind, name, parameters)) return false
  storage?.setItem(storageKey, 'sent')
  return true
}

export function trackMetaPageView() {
  return dispatch('track', 'PageView')
}

export function trackMetaArticleView(articleSlug: string, articleCategory: string) {
  return trackOnce(`article:${articleSlug}:view`, 'track', 'ViewContent', {
    content_name: articleSlug,
    content_category: articleCategory,
    content_type: 'article',
  })
}

export function trackMetaBlogRadarCtaClick(articleSlug: string, ctaLocation: string) {
  return dispatch('trackCustom', 'BlogRadarCTAClick', {
    article_slug: articleSlug,
    cta_location: ctaLocation,
  })
}

export function trackMetaRadarStart(attemptId: string, ctaLocation: string) {
  if (!attemptId) return false
  return trackOnce(`radar:start:${attemptId}`, 'trackCustom', 'RadarStart', {
    cta_location: ctaLocation,
  })
}

export function trackMetaRadarComplete(completionId: string) {
  if (!completionId) return false
  return trackOnce(`radar:complete:${completionId}`, 'trackCustom', 'RadarComplete', {
    content_name: 'Radar PraxIA',
  })
}
