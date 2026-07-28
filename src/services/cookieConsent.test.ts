import { afterEach, describe, expect, it, vi } from 'vitest'
import { analyticsAllowed, COOKIE_PREFERENCE_KEY, readCookiePreference, saveCookiePreference } from './cookieConsent'

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
})
