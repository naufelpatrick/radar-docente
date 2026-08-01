import { analyticsAllowed } from './cookieConsent'

export type ShareSource = 'whatsapp' | 'linkedin' | 'facebook' | 'x' | 'email' | 'copylink' | 'native_share'

type BuildShareUrlOptions = {
  url: string
  source: ShareSource
  campaign: string
  content?: string
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

function normalizedTrackingValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

export function buildShareUrl({ url, source, campaign, content }: BuildShareUrlOptions) {
  const shareUrl = new URL(url)

  for (const key of [...shareUrl.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_') || PRIVATE_OR_TEMPORARY_PARAMS.some((pattern) => pattern.test(key))) {
      shareUrl.searchParams.delete(key)
    }
  }

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
    page_location: window.location.href,
  })
}
