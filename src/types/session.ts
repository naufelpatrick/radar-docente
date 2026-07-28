import type { InstrumentAnswers, TeachingProfile } from './instrument'

export type RadarConsent = {
  reflectionAccepted: boolean
  anonymousImprovementAccepted: boolean
}

export type RadarSession = {
  instrumentVersion: 'beta-0.1'
  consent: RadarConsent
  teachingProfile: TeachingProfile | null
  answers: InstrumentAnswers
  startedAt: string
}

export interface RadarSessionRepository {
  load(): RadarSession | null
  save(session: RadarSession): void
  clear(): void
}
