import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackCommercialEvent } from './commercialAnalytics'

describe('analytics comercial', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia somente parâmetros comerciais permitidos', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => 'accepted' } })
    trackCommercialEvent('select_ebook', { product_id: 'ebook', audience: 'teachers', source_page: 'home' })
    const parameters = gtag.mock.calls[0][2]
    expect(parameters).toEqual({ product_id: 'ebook', audience: 'teachers', source_page: 'home' })
    expect(JSON.stringify(parameters)).not.toMatch(/email|phone|institution|message|city|name/i)
  })

  it('não envia eventos antes da autorização de analytics', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, localStorage: { getItem: () => null } })
    trackCommercialEvent('select_mentoring', { product_id: 'mentoring', audience: 'teachers' })
    expect(gtag).not.toHaveBeenCalled()
  })
})
