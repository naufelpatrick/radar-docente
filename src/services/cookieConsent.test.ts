import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  analyticsAllowed,
  COOKIE_PREFERENCE_KEY,
  COOKIE_PREFERENCES_KEY,
  initializeAnalyticsFromStoredConsent,
  loadGoogleAnalytics,
  marketingAllowed,
  readCookiePreferences,
  saveCookiePreferences,
} from './cookieConsent'

function storageStub(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial))
  return {
    values,
    storage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  }
}

function documentStub() {
  return {
    querySelector: () => ({}),
    createElement: () => ({ dataset: {} }),
    head: { appendChild: vi.fn() },
    documentElement: { setAttribute: vi.fn() },
  }
}

describe('cookie preferences', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('starts without permissions and stores granular refusal', () => {
    const { values, storage } = storageStub()
    vi.stubGlobal('window', { localStorage: storage, dispatchEvent: vi.fn() })

    expect(readCookiePreferences()).toBeNull()
    expect(analyticsAllowed()).toBe(false)
    expect(marketingAllowed()).toBe(false)

    saveCookiePreferences({ analytics: false, marketing: false })
    expect(JSON.parse(values.get(COOKIE_PREFERENCES_KEY) || '{}')).toEqual({ analytics: false, marketing: false })
  })

  it('migrates historical acceptance to analytics without inferring marketing consent', () => {
    const { storage } = storageStub({ [COOKIE_PREFERENCE_KEY]: 'accepted' })
    vi.stubGlobal('window', { localStorage: storage })

    expect(readCookiePreferences()).toEqual({ analytics: true, marketing: false })
    expect(analyticsAllowed()).toBe(true)
    expect(marketingAllowed()).toBe(false)
  })

  it('allows analytics and marketing independently', () => {
    const { storage } = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: false, marketing: true }),
    })
    vi.stubGlobal('window', { localStorage: storage })

    expect(analyticsAllowed()).toBe(false)
    expect(marketingAllowed()).toBe(true)
  })

  it('initializes dataLayer and GA4 only after analytics consent', () => {
    const { storage } = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: true, marketing: false }),
    })
    const windowStub = { localStorage: storage } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    loadGoogleAnalytics()

    expect(Array.isArray(windowStub.dataLayer)).toBe(true)
    expect(typeof windowStub.gtag).toBe('function')
    const commands = windowStub.dataLayer?.map((entry) => Array.from(entry as ArrayLike<unknown>))
    expect(commands).toEqual(expect.arrayContaining([
      expect.arrayContaining(['config', 'G-9JR9Q9KSV6']),
    ]))
  })

  it('does not initialize Google globals before analytics consent', () => {
    const { storage } = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: false, marketing: false }),
    })
    const windowStub = { localStorage: storage } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    loadGoogleAnalytics()

    expect(windowStub.dataLayer).toBeUndefined()
    expect(windowStub.gtag).toBeUndefined()
  })

  it('initializes GA4 synchronously for stored analytics consent', () => {
    const { storage } = storageStub({
      [COOKIE_PREFERENCES_KEY]: JSON.stringify({ analytics: true, marketing: false }),
    })
    const windowStub = { localStorage: storage } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', documentStub())

    expect(initializeAnalyticsFromStoredConsent()).toBe(true)
    expect(typeof windowStub.gtag).toBe('function')
    expect(Array.isArray(windowStub.dataLayer)).toBe(true)
  })
})
