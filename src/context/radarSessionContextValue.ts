import { createContext, useContext } from 'react'
import type { TeachingProfile } from '../types/instrument'
import type { RadarConsent, RadarSession } from '../types/session'

export type RadarSessionContextValue = {
  session: RadarSession
  setConsent: (consent: RadarConsent) => void
  setTeachingProfile: (profile: TeachingProfile) => void
  setAnswer: (itemId: string, value: number) => void
  reset: () => void
}

export const RadarSessionContext = createContext<RadarSessionContextValue | null>(null)

export function useRadarSession() {
  const context = useContext(RadarSessionContext)
  if (!context) throw new Error('useRadarSession precisa estar dentro de RadarSessionProvider.')
  return context
}
