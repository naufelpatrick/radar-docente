import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { INSTRUMENT_VERSION } from '../data/instrument'
import { localRadarSessionRepository } from '../repositories/localRadarSessionRepository'
import type { RadarSession } from '../types/session'
import { RadarSessionContext, type RadarSessionContextValue } from './radarSessionContextValue'

const createEmptySession = (): RadarSession => ({
  instrumentVersion: INSTRUMENT_VERSION,
  consent: { reflectionAccepted: false, anonymousImprovementAccepted: false },
  teachingProfile: null,
  answers: {},
  startedAt: new Date().toISOString(),
})

export function RadarSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<RadarSession>(() => localRadarSessionRepository.load() ?? createEmptySession())

  useEffect(() => {
    localRadarSessionRepository.save(session)
  }, [session])

  const value = useMemo<RadarSessionContextValue>(() => ({
    session,
    setConsent: (consent) => setSession((current) => ({ ...current, consent })),
    setTeachingProfile: (teachingProfile) => setSession((current) => ({ ...current, teachingProfile })),
    setAnswer: (itemId, value) => setSession((current) => ({
      ...current,
      answers: { ...current.answers, [itemId]: value },
    })),
    reset: () => {
      const next = createEmptySession()
      localRadarSessionRepository.clear()
      setSession(next)
    },
  }), [session])

  return <RadarSessionContext.Provider value={value}>{children}</RadarSessionContext.Provider>
}
