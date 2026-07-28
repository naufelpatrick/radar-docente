import { describe, expect, it } from 'vitest'
import { dimensions, instrument } from '../data/instrument'
import { dimensionInterpretations, reflectionQuestions } from '../data/resultInterpretations'
import type { InstrumentAnswers, TeachingProfile } from '../types/instrument'
import type { ScoreBandId } from '../types/result'
import { buildResultNarrative } from './resultNarrativeService'
import { calculateScore } from './scoringService'

const profile: TeachingProfile = 'higher_postgraduate'
const answersWith = (value: number): InstrumentAnswers =>
  Object.fromEntries(instrument.map(({ id }) => [id, value]))
const setDimension = (answers: InstrumentAnswers, prefix: string, value: number) => {
  instrument.filter(({ id }) => id.startsWith(prefix)).forEach(({ id }) => { answers[id] = value })
  return answers
}

describe('resultNarrativeService', () => {
  it.each([
    [1, 'initiation'],
    [3, 'exploration'],
    [4, 'integration'],
    [5, 'transformation'],
  ] as const)('cria narrativa correspondente à faixa %s', (value, band) => {
    const result = calculateScore(answersWith(value), profile)
    const narrative = buildResultNarrative(result)
    expect(result.band.id).toBe(band)
    expect(narrative.summary).toContain('Seu resultado sugere')
    expect(narrative.summary.trim().split(/\s+/).length).toBeGreaterThanOrEqual(90)
    expect(narrative.summary.trim().split(/\s+/).length).toBeLessThanOrEqual(160)
  })

  it('oferece as 24 interpretações específicas de dimensão e faixa', () => {
    const bands: ScoreBandId[] = ['initiation', 'exploration', 'integration', 'transformation']
    const entries = dimensions.flatMap(({ id }) => bands.map((band) => dimensionInterpretations[id][band]))
    expect(entries).toHaveLength(24)
    for (const entry of entries) {
      expect(entry.evaluates).toBeTruthy()
      expect(entry.suggests).toBeTruthy()
      expect(entry.inPractice).toBeTruthy()
      expect(entry.impact).toBeTruthy()
      expect(entry.practiceToMaintain).toBeTruthy()
      expect(entry.actionToAdvance).toBeTruthy()
    }
    expect(new Set(entries.map(({ suggests }) => suggests)).size).toBe(24)
  })

  it('monta plano para a zona priorizada', () => {
    const result = calculateScore(setDimension(answersWith(4), 'AF', 1), profile)
    const narrative = buildResultNarrative(result)
    expect(result.recommendationDimension).toBe('assessment_feedback')
    expect(narrative.developmentPlan.dimensionId).toBe('assessment_feedback')
    expect(narrative.developmentPlan.criteria).toHaveLength(3)
  })

  it('mantém prioridade ética e sua pergunta reflexiva', () => {
    const answers = setDimension(answersWith(4), 'AF', 1)
    setDimension(answers, 'EA', 1)
    const result = calculateScore(answers, profile)
    const narrative = buildResultNarrative(result)
    expect(result.recommendationDimension).toBe('ethics_safety_authorship')
    expect(narrative.reflectionQuestion).toBe(reflectionQuestions.ethics_safety_authorship)
    expect(result.attentionSignals[0]).toContain('privacidade')
  })

  it('explica perfil equilibrado sem força e zona contraditórias', () => {
    const result = calculateScore(answersWith(4), profile)
    const narrative = buildResultNarrative(result)
    expect(result.strengths).toEqual([])
    expect(result.developmentZones).toEqual([])
    expect(narrative.balancedExplanation).toContain('não indica fragilidade')
    expect(narrative.developmentPlan.whyPrioritized).toContain('não indica fragilidade')
  })

  it('seleciona pergunta correspondente à dimensão prioritária', () => {
    const result = calculateScore(setDimension(answersWith(4), 'MC', 1), profile)
    expect(buildResultNarrative(result).reflectionQuestion).toBe(reflectionQuestions.mediation_collaboration)
  })

  it('é determinístico para o mesmo resultado', () => {
    const result = calculateScore(setDimension(answersWith(4), 'IA', 2), profile)
    expect(buildResultNarrative(result)).toEqual(buildResultNarrative(result))
  })

  it('não utiliza linguagem proibida', () => {
    const forbidden = [/você é/i, /o teste comprovou/i, /você não sabe/i]
    for (const value of [1, 3, 4, 5]) {
      const serialized = JSON.stringify(buildResultNarrative(calculateScore(answersWith(value), profile)))
      forbidden.forEach((expression) => expect(serialized).not.toMatch(expression))
    }
  })
})
