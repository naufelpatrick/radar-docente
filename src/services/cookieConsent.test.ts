import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  analyticsAllowed,
  COOKIE_PREFERENCE_KEY,
  initializeAnalyticsFromStoredConsent,
  loadGoogleAnalytics,
  readCookiePreference,
  saveCookiePreference,
} from './cookieConsent'

describe('cookie preferences', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('starts without analytics permission and stores refusal', () => {
    const values = new Map<string, string>()
    vi.stubGlobal('window', { localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    } })
    expect(readCookiePreference()).toBeNull()
    expect(analyticsAllowed()).toBe(false)
    saveCookiePreference('essential_only')
    expect(values.get(COOKIE_PREFERENCE_KEY)).toBe('essential_only')
    expect(analyticsAllowed()).toBe(false)
  })

  it('allows analytics only after explicit acceptance', () => {
    vi.stubGlobal('window', { localStorage: { getItem: () => 'accepted', setItem: vi.fn() } })
    expect(analyticsAllowed()).toBe(true)
  })

  it('initializes dataLayer and gtag even when the Google script already exists', () => {
    const windowStub = {
      localStorage: { getItem: () => 'accepted', setItem: vi.fn() },
    } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', { querySelector: () => ({}) })

    loadGoogleAnalytics()

    expect(Array.isArray(windowStub.dataLayer)).toBe(true)
    expect(typeof windowStub.gtag).toBe('function')
    const commands = windowStub.dataLayer?.map((entry) => Array.from(entry as ArrayLike<unknown>))
    expect(commands).toEqual(expect.arrayContaining([
      expect.arrayContaining(['config', 'G-9JR9Q9KSV6']),
    ]))
  })

  it('does not initialize Google globals before analytics consent', () => {
    const windowStub = {
      localStorage: { getItem: () => 'essential_only', setItem: vi.fn() },
    } as unknown as Window
    vi.stubGlobal('window', windowStub)

    loadGoogleAnalytics()

    expect(windowStub.dataLayer).toBeUndefined()
    expect(windowStub.gtag).toBeUndefined()
  })

  it('initializes GA4 synchronously for a previously accepted preference', () => {
    const windowStub = {
      localStorage: { getItem: () => 'accepted', setItem: vi.fn() },
    } as unknown as Window
    vi.stubGlobal('window', windowStub)
    vi.stubGlobal('document', { querySelector: () => ({}) })

    expect(initializeAnalyticsFromStoredConsent()).toBe(true)
    expect(typeof windowStub.gtag).toBe('function')
    expect(Array.isArray(windowStub.dataLayer)).toBe(true)
  })
})
