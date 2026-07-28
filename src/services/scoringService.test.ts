import { describe, expect, it } from 'vitest'
import { instrument } from '../data/instrument'
import type { InstrumentAnswers, TeachingProfile } from '../types/instrument'
import { calculateDimensionScore, calculateScore, classifyBand, validateAnswers } from './scoringService'

const profile: TeachingProfile = 'higher_postgraduate'
const answersWith = (value: number): InstrumentAnswers =>
  Object.fromEntries(instrument.map(({ id }) => [id, value]))

const setDimension = (answers: InstrumentAnswers, prefix: string, value: number) => {
  instrument.filter(({ id }) => id.startsWith(prefix)).forEach(({ id }) => { answers[id] = value })
  return answers
}

describe('scoringService', () => {
  it('gera score geral 0 com todas as respostas iguais a 1', () => {
    expect(calculateScore(answersWith(1), profile).displayedOverallScore).toBe(0)
  })

  it('gera score geral 100 com todas as respostas iguais a 5', () => {
    expect(calculateScore(answersWith(5), profile).displayedOverallScore).toBe(100)
  })

  it.each([[39, 'initiation'], [40, 'exploration'], [59, 'exploration'], [60, 'integration'], [79, 'integration'], [80, 'transformation']] as const)(
    'classifica o limite %i corretamente',
    (score, band) => expect(classifyBand(score)).toBe(band),
  )

  it('calcula soma, média e score de uma dimensão', () => {
    expect(calculateDimensionScore([1, 2, 3, 4, 5])).toEqual({ rawSum: 15, itemAverage: 3, score: 50 })
  })

  it('arredonda somente o score geral exibido', () => {
    const answers = answersWith(3)
    answers.PC1 = 4
    const result = calculateScore(answers, profile)
    expect(result.exactOverallScore).toBeCloseTo(50.8333333333)
    expect(result.displayedOverallScore).toBe(51)
    expect(result.dimensionScores.find(({ dimensionId }) => dimensionId === 'planning_curation')?.score).toBeCloseTo(55)
  })

  it('identifica força única', () => {
    const result = calculateScore(setDimension(answersWith(3), 'PC', 5), profile)
    expect(result.strengths).toEqual(['planning_curation'])
  })

  it('preserva até duas forças empatadas', () => {
    const answers = setDimension(answersWith(3), 'PC', 5)
    setDimension(answers, 'CE', 5)
    setDimension(answers, 'MC', 5)
    expect(calculateScore(answers, profile).strengths).toEqual(['planning_curation', 'experience_creation'])
  })

  it('identifica zona única', () => {
    expect(calculateScore(setDimension(answersWith(3), 'AF', 1), profile).developmentZones).toEqual(['assessment_feedback'])
  })

  it('preserva até duas zonas empatadas', () => {
    const answers = setDimension(answersWith(3), 'AF', 1)
    setDimension(answers, 'MC', 1)
    setDimension(answers, 'CE', 1)
    expect(calculateScore(answers, profile).developmentZones).toEqual(['experience_creation', 'mediation_collaboration'])
  })

  it('classifica perfil equilibrado', () => {
    expect(calculateScore(answersWith(3), profile).balanceProfile).toBe('balanced')
  })

  it('classifica perfil heterogêneo', () => {
    expect(calculateScore(setDimension(answersWith(3), 'PC', 5), profile).balanceProfile).toBe('heterogeneous')
  })

  it('não classifica amplitude entre 15 e 29', () => {
    const answers = answersWith(3)
    answers.PC1 = 4
    answers.PC2 = 4
    answers.PC3 = 4
    answers.PC4 = 4
    expect(calculateScore(answers, profile).balanceProfile).toBeNull()
  })

  it('gera sinal de atenção abaixo de 40', () => {
    expect(calculateScore(setDimension(answersWith(3), 'PC', 1), profile).attentionSignals[0]).toContain('Planejamento')
  })

  it('prioriza o sinal ético', () => {
    const answers = setDimension(answersWith(3), 'PC', 1)
    setDimension(answers, 'EA', 1)
    const signals = calculateScore(answers, profile).attentionSignals
    expect(signals[0]).toBe(
      'Antes de ampliar o uso de tecnologias ou IA, vale fortalecer critérios de privacidade, transparência, autoria e supervisão humana.',
    )
    expect(signals[1]).toContain('Planejamento')
  })

  it('desempata recomendação pela prioridade definida', () => {
    const answers = setDimension(answersWith(3), 'CE', 1)
    setDimension(answers, 'EA', 1)
    expect(calculateScore(answers, profile).recommendationDimension).toBe('ethics_safety_authorship')
  })

  it('bloqueia respostas incompletas', () => {
    const answers = answersWith(3)
    delete answers.PC1
    expect(() => validateAnswers(answers)).toThrow('30 respostas')
  })

  it.each([0, 6, 2.5])('rejeita o valor inválido %s', (value) => {
    const answers = answersWith(3)
    answers.PC1 = value
    expect(() => validateAnswers(answers)).toThrow('PC1')
  })

  it('é determinístico para os mesmos dados de pontuação', () => {
    const first = calculateScore(answersWith(4), profile)
    const second = calculateScore(answersWith(4), profile)
    expect({ ...first, anonymousId: '', completedAt: '' }).toEqual({ ...second, anonymousId: '', completedAt: '' })
  })
})
