export interface ContactLead {
  name: string
  email: string
  subject: string
  message: string
  privacyConsent: boolean
}

export interface MentoringLead {
  name: string
  email: string
  phone: string
  teachingContext: string
  mainChallenge: string
  privacyConsent: boolean
}

export type LeadErrors<T> = Partial<Record<keyof T, string>>
