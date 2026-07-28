export interface ContactLead {
  name: string
  email: string
  subject: string
  message: string
}

export interface MentoringLead {
  name: string
  email: string
  phone: string
  teachingContext: string
  mainChallenge: string
}

export type LeadErrors<T> = Partial<Record<keyof T, string>>
