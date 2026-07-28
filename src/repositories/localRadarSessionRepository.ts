import { INSTRUMENT_VERSION } from '../data/instrument'
import type { RadarSession, RadarSessionRepository } from '../types/session'

const storageKey = 'praxia:radar-session:beta-0.1'

function isRadarSession(value: unknown): value is RadarSession {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<RadarSession>
  return candidate.instrumentVersion === INSTRUMENT_VERSION
    && typeof candidate.startedAt === 'string'
    && !!candidate.consent
    && !!candidate.answers
}

export const localRadarSessionRepository: RadarSessionRepository = {
  load() {
    try {
      const serialized = window.localStorage.getItem(storageKey)
      if (!serialized) return null
      const parsed: unknown = JSON.parse(serialized)
      return isRadarSession(parsed) ? parsed : null
    } catch {
      return null
    }
  },
  save(session) {
    window.localStorage.setItem(storageKey, JSON.stringify(session))
  },
  clear() {
    window.localStorage.removeItem(storageKey)
  },
}
