import { afterEach, describe, expect, it, vi } from 'vitest'
import { EBOOK_CONVERSION_DESTINATION, trackEbookPurchase } from './ebookConversion'

describe('conversão do e-book', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia uma compra confirmada com valor, moeda e transação', () => {
    const values = new Map<string, string>([['praxia:cookie-preferences:v2', JSON.stringify({ analytics: true, marketing: true })]])
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      dataLayer: [],
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    })
    vi.stubGlobal('document', { querySelector: () => ({}) })

    trackEbookPurchase('order-123')

    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: EBOOK_CONVERSION_DESTINATION,
      transaction_id: 'order-123',
      value: 19.9,
      currency: 'BRL',
    })
  })

  it('não dispara novamente a mesma transação', () => {
    const values = new Map<string, string>([
      ['praxia:cookie-preference:v1', 'accepted'],
      ['praxia:google-ads:ebook-purchase:order-123', 'sent'],
    ])
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
    })
    trackEbookPurchase('order-123')
    expect(gtag).not.toHaveBeenCalled()
  })

  it('aguarda autorização antes de medir', () => {
    const values = new Map<string, string>()
    const gtag = vi.fn()
    vi.stubGlobal('window', {
      gtag,
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    })
    trackEbookPurchase('order-456')
    expect(gtag).not.toHaveBeenCalled()
    expect(values.get('praxia:google-ads:pending-ebook-purchase')).toContain('order-456')
  })
})
