import { dimensions, instrument, INSTRUMENT_VERSION } from '../data/instrument'
import { bandContent, recommendationPriority, recommendations } from '../data/resultContent'
import type { DimensionId, InstrumentAnswers, TeachingProfile } from '../types/instrument'
import type { BalanceProfile, ScoreBandId, ScoreResult } from '../types/result'

const ethicsAttention = 'Antes de ampliar o uso de tecnologias ou IA, vale fortalecer critérios de privacidade, transparência, autoria e supervisão humana.'

export function classifyBand(score: number): ScoreBandId {
  if (score < 0 || score > 100 || !Number.isFinite(score)) throw new Error('Score fora do intervalo de 0 a 100.')
  if (score <= 39) return 'initiation'
  if (score <= 59) return 'exploration'
  if (score <= 79) return 'integration'
  return 'transformation'
}

export function validateAnswers(answers: InstrumentAnswers): void {
  if (Object.keys(answers).length !== instrument.length) {
    throw new Error(`São necessárias ${instrument.length} respostas válidas.`)
  }

  for (const item of instrument) {
    const value = answers[item.id]
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`Resposta inválida para o item ${item.id}.`)
    }
  }
}

export function calculateDimensionScore(values: number[]) {
  if (values.length !== 5 || values.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
    throw new Error('Cada dimensão exige cinco respostas válidas entre 1 e 5.')
  }
  const rawSum = values.reduce((total, value) => total + value, 0)
  return {
    rawSum,
    itemAverage: rawSum / 5,
    score: ((rawSum - 5) / 20) * 100,
  }
}

function getExtremes(scores: { dimensionId: DimensionId; score: number }[], mode: 'max' | 'min') {
  const target = mode === 'max'
    ? Math.max(...scores.map(({ score }) => score))
    : Math.min(...scores.map(({ score }) => score))
  return scores.filter(({ score }) => score === target).slice(0, 2).map(({ dimensionId }) => dimensionId)
}

function getBalanceProfile(amplitude: number): BalanceProfile {
  if (amplitude < 15) return 'balanced'
  if (amplitude >= 30) return 'heterogeneous'
  return null
}

function createAnonymousId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}`
}

export function calculateScore(
  answers: InstrumentAnswers,
  teachingProfile: TeachingProfile,
  startedAt = new Date().toISOString(),
): ScoreResult {
  validateAnswers(answers)

  const dimensionScores = dimensions.map((dimension) => {
    const itemIds = instrument.filter(({ dimensionId }) => dimensionId === dimension.id).map(({ id }) => id)
    const calculated = calculateDimensionScore(itemIds.map((id) => answers[id]))
    return {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
      ...calculated,
    }
  })

  const exactOverallScore = dimensionScores.reduce((total, { score }) => total + score, 0) / dimensionScores.length
  const displayedOverallScore = Math.round(exactOverallScore)
  const bandId = classifyBand(displayedOverallScore)
  const max = Math.max(...dimensionScores.map(({ score }) => score))
  const min = Math.min(...dimensionScores.map(({ score }) => score))
  const amplitude = max - min
  const similarPerformance = amplitude < 5
  const strengths = similarPerformance ? [] : getExtremes(dimensionScores, 'max')
  const developmentZones = similarPerformance ? [] : getExtremes(dimensionScores, 'min')
  const recommendationDimension = similarPerformance
    ? recommendationPriority[0]
    : recommendationPriority.find((dimensionId) => developmentZones.includes(dimensionId)) ?? developmentZones[0]
  const lowDimensions = dimensionScores.filter(({ score }) => score < 40)
  const ethicsIsLow = lowDimensions.some(({ dimensionId }) => dimensionId === 'ethics_safety_authorship')
  const attentionSignals = [
    ...(ethicsIsLow ? [ethicsAttention] : []),
    ...lowDimensions
      .filter(({ dimensionId }) => dimensionId !== 'ethics_safety_authorship')
      .map(({ dimensionName }) => `A dimensão ${dimensionName} indica uma oportunidade prioritária de desenvolvimento.`),
  ]
  const completedAt = new Date()

  return {
    anonymousId: createAnonymousId(),
    instrumentVersion: INSTRUMENT_VERSION,
    teachingProfile,
    dimensionScores,
    exactOverallScore,
    displayedOverallScore,
    band: { id: bandId, ...bandContent[bandId] },
    strengths,
    developmentZones,
    similarPerformance,
    amplitude,
    balanceProfile: getBalanceProfile(amplitude),
    attentionSignals,
    recommendationDimension,
    recommendation: recommendations[recommendationDimension],
    completedAt: completedAt.toISOString(),
    completionTimeSeconds: Math.max(0, Math.round((completedAt.getTime() - new Date(startedAt).getTime()) / 1000)),
  }
}
