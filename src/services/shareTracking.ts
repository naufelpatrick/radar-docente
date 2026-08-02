import { analyticsAllowed } from './cookieConsent'
import { SITE_URL } from '../config/site'

export type ShareSource = 'whatsapp' | 'linkedin' | 'facebook' | 'x' | 'email' | 'copylink' | 'native_share'

type BuildShareUrlOptions = {
  url: string
  source: ShareSource
  campaign: string
  content?: string
}

type GetShareBaseUrlOptions = {
  canonicalUrl?: string
  path?: string
}

type TrackShareOptions = {
  method: ShareSource
  contentType: string
  itemId: string
}

const PRIVATE_OR_TEMPORARY_PARAMS = [
  /^(?:fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|_ga|_gl)$/i,
  /^(?:token|access_token|auth|authorization|code|state|session|session_id)$/i,
  /^(?:name|nome|email|e-mail|phone|telefone|whatsapp|cpf|user|user_id)$/i,
  /^(?:score|result|resultado|answer|answers|resposta|respostas|diagnostic|diagnostico)$/i,
]

function cleanShareUrl(url: URL) {
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_') || PRIVATE_OR_TEMPORARY_PARAMS.some((pattern) => pattern.test(key))) {
      url.searchParams.delete(key)
    }
  }
  url.hash = ''
  return url
}

function validPublicUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function getShareBaseUrl({ canonicalUrl, path }: GetShareBaseUrlOptions = {}) {
  const canonical = validPublicUrl(canonicalUrl)
  if (canonical) return cleanShareUrl(canonical).toString()

  const browserOrigin = typeof window !== 'undefined' ? window.location.origin : undefined
  const browserPath = typeof window !== 'undefined' ? window.location.pathname : undefined
  const baseOrigin = browserOrigin ?? SITE_URL
  const explicitUrl = validPublicUrl(path)
  const baseUrl = explicitUrl ?? new URL(path ?? browserPath ?? '/', baseOrigin)

  return cleanShareUrl(baseUrl).toString()
}

function normalizedTrackingValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

export function buildShareUrl({ url, source, campaign, content }: BuildShareUrlOptions) {
  const shareUrl = cleanShareUrl(new URL(url))

  shareUrl.searchParams.set('utm_source', source)
  shareUrl.searchParams.set('utm_medium', 'share')
  shareUrl.searchParams.set('utm_campaign', normalizedTrackingValue(campaign))
  if (content) shareUrl.searchParams.set('utm_content', normalizedTrackingValue(content))

  return shareUrl.toString()
}

export function trackShare({ method, contentType, itemId }: TrackShareOptions) {
  if (typeof window === 'undefined' || !analyticsAllowed() || typeof window.gtag !== 'function') return

  window.gtag('event', 'share', {
    method,
    content_type: contentType,
    item_id: itemId,
    page_location: getShareBaseUrl(),
  })
}
