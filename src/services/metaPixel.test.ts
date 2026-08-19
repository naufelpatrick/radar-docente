import { afterEach, describe, expect, it, vi } from 'vitest'
import { COOKIE_PREFERENCES_KEY } from './cookieConsent'
import { META_PIXEL_ID, trackMetaArticleView, trackMetaPageView } from './metaPixel'

function storageStub(values: Record<string, string>) {
  const map = new Map(Object.entries(values))
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => map.set(key, value),
    removeItem: (key: string) => map.delete(key),
  }
}

function documentStub() {
  return {
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    head: { appendChild: vi.fn() },
  }
}

describe('Meta Pixel', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('does not initialize without marketing consent', () => {
    const localStorage = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: true, marketing: false }),
    })
    const windowStub = { localStorage, sessionStorage: storageStub({}) } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    expect(trackMetaPageView()).toBe(false)
    expect(windowStub.fbq).toBeUndefined()
  })

  it('initializes the configured pixel and sends PageView after marketing consent', () => {
    const localStorage = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: false, marketing: true }),
    })
    const windowStub = { localStorage, sessionStorage: storageStub({}) } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    expect(trackMetaPageView()).toBe(true)
    const queue = windowStub.fbq?.queue ?? []
    expect(queue).toEqual(expect.arrayContaining([
      expect.arrayContaining(['init', META_PIXEL_ID]),
      expect.arrayContaining(['track', 'PageView']),
    ]))
  })

  it('sends article views as ViewContent without personal data', () => {
    const localStorage = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: false, marketing: true }),
    })
    const windowStub = { localStorage, sessionStorage: storageStub({}) } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    expect(trackMetaArticleView('artigo-teste', 'fluencia-digital')).toBe(true)
    const queue = windowStub.fbq?.queue ?? []
    expect(queue).toEqual(expect.arrayContaining([
      expect.arrayContaining(['track', 'ViewContent', expect.objectContaining({
        content_name: 'artigo-teste',
        content_category: 'fluencia-digital',
      })]),
    ]))
  })
})
