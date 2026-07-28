import type { DimensionId, TeachingProfile } from './instrument'

export type ScoreBandId = 'initiation' | 'exploration' | 'integration' | 'transformation'
export type BalanceProfile = 'balanced' | 'heterogeneous' | null

export type DimensionScore = {
  dimensionId: DimensionId
  dimensionName: string
  rawSum: number
  itemAverage: number
  score: number
}

export type ScoreResult = {
  anonymousId: string
  instrumentVersion: 'beta-0.1'
  teachingProfile: TeachingProfile
  dimensionScores: DimensionScore[]
  exactOverallScore: number
  displayedOverallScore: number
  band: {
    id: ScoreBandId
    name: string
    message: string
  }
  strengths: DimensionId[]
  developmentZones: DimensionId[]
  similarPerformance: boolean
  amplitude: number
  balanceProfile: BalanceProfile
  attentionSignals: string[]
  recommendationDimension: DimensionId
  recommendation: string
  completedAt: string
  completionTimeSeconds: number
}

export type DimensionInterpretation = {
  evaluates: string
  suggests: string
  inPractice: string
  impact: string
  practiceToMaintain: string
  actionToAdvance: string
}

export type TeachingImplication = {
  title: string
  manifestation: string
  impact: string
}

export type DevelopmentPlan = {
  dimensionId: DimensionId
  whyPrioritized: string
  objective: string
  nextActivityAction: string
  criteria: string[]
  observableEvidence: string
  preparationTime: string
  reflection: string
}

export type ResultNarrative = {
  summary: string
  implications: TeachingImplication[]
  dimensionInterpretations: Array<DimensionScore & {
    bandId: ScoreBandId
    bandName: string
    content: DimensionInterpretation
  }>
  balancedExplanation: string | null
  developmentPlan: DevelopmentPlan
  reflectionQuestion: string
}
