import type { ScoreResult } from './result'

export interface RadarLead {
  name: string
  email: string
  city: string
  institution: string
  marketingConsent: boolean
}

export type RadarLeadErrors = Partial<Record<keyof RadarLead, string>>

export interface RadarLeadSubmission {
  lead: RadarLead
  result: ScoreResult
}
