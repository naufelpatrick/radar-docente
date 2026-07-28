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
