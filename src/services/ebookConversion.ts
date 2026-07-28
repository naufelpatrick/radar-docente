import { analyticsAllowed, loadGoogleAnalytics } from './cookieConsent'

export const GOOGLE_ADS_ID = 'AW-18356888280'
export const EBOOK_CONVERSION_DESTINATION = `${GOOGLE_ADS_ID}/pVj0CLfDotgcENjFn7FE`
const PENDING_PURCHASE_KEY = 'praxia:google-ads:pending-ebook-purchase'
const SENT_PURCHASE_PREFIX = 'praxia:google-ads:ebook-purchase:'

interface EbookPurchase {
  transactionId: string
  value: number
}

function sendPurchase({ transactionId, value }: EbookPurchase) {
  if (!transactionId || window.localStorage.getItem(`${SENT_PURCHASE_PREFIX}${transactionId}`)) return
  loadGoogleAnalytics()
  if (typeof window.gtag !== 'function') return

  window.gtag('event', 'conversion', {
    send_to: EBOOK_CONVERSION_DESTINATION,
    transaction_id: transactionId,
    value,
    currency: 'BRL',
  })
  window.localStorage.setItem(`${SENT_PURCHASE_PREFIX}${transactionId}`, 'sent')
  window.localStorage.removeItem(PENDING_PURCHASE_KEY)
}

export function trackEbookPurchase(transactionId: string, value = 19.9) {
  if (typeof window === 'undefined' || !transactionId) return
  const purchase = { transactionId, value }
  if (!analyticsAllowed()) {
    window.localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase))
    return
  }
  sendPurchase(purchase)
}

export function flushPendingEbookPurchase() {
  if (typeof window === 'undefined' || !analyticsAllowed()) return
  try {
    const pending = window.localStorage.getItem(PENDING_PURCHASE_KEY)
    if (pending) sendPurchase(JSON.parse(pending) as EbookPurchase)
  } catch {
    window.localStorage.removeItem(PENDING_PURCHASE_KEY)
  }
}
