export type InstitutionalModality = 'presential' | 'online' | 'undecided'
export type InstitutionalInterest = 'talk' | 'workshop' | 'both'

export interface InstitutionalLead {
  name: string
  institution: string
  role: string
  email: string
  phone: string
  city: string
  state: string
  modality: InstitutionalModality | ''
  interest: InstitutionalInterest | ''
  participantsRange: string
  preferredPeriod: string
  message: string
  sourcePage: '/para-instituicoes'
}

export type InstitutionalLeadErrors = Partial<Record<keyof InstitutionalLead, string>>
