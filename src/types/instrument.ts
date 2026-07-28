export type DimensionId =
  | 'planning_curation'
  | 'experience_creation'
  | 'mediation_collaboration'
  | 'assessment_feedback'
  | 'ai_pedagogical_integration'
  | 'ethics_safety_authorship'

export type ItemType = 'behavioral' | 'situational'

export type InstrumentOption = {
  id: string
  label: string
  value: 1 | 2 | 3 | 4 | 5
}

export type InstrumentItem = {
  id: string
  instrumentVersion: 'beta-0.1'
  dimensionId: DimensionId
  dimensionName: string
  type: ItemType
  prompt: string
  options: InstrumentOption[]
  required: true
  order: number
}

export type TeachingProfile =
  | 'fundamental_early'
  | 'fundamental_late'
  | 'high_school'
  | 'technical_professional'
  | 'higher_postgraduate'

export type InstrumentAnswers = Record<string, number>

export type DimensionDefinition = {
  id: DimensionId
  name: string
  shortName: string
}
