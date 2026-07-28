import { dimensions } from '../data/instrument'
import {
  developmentPlans,
  dimensionInterpretations,
  generalBandInterpretations,
  reflectionQuestions,
  teachingImplications,
} from '../data/resultInterpretations'
import type { DimensionId } from '../types/instrument'
import type { ResultNarrative, ScoreResult } from '../types/result'
import { classifyBand } from './scoringService'

const dimensionName = (id: DimensionId) => dimensions.find((dimension) => dimension.id === id)?.name ?? id

function buildSummary(result: ScoreResult) {
  const mainStrength = result.strengths[0]
  const priority = result.recommendationDimension
  const balance = result.similarPerformance
    ? 'As seis dimensões aparecem próximas entre si, por isso não há diferença suficiente para declarar uma força ou fragilidade específica.'
    : result.balanceProfile === 'heterogeneous'
      ? 'Há indícios de competências em estágios diferentes, o que pode fazer práticas mais consolidadas coexistirem com decisões ainda dependentes do contexto.'
      : result.balanceProfile === 'balanced'
        ? 'As dimensões apresentam relativa proximidade, com diferenças suficientes apenas para orientar onde experimentar primeiro.'
        : 'A combinação das dimensões mostra diferenças moderadas, úteis para orientar uma escolha de desenvolvimento sem reduzir o resultado a uma única área.'
  const strength = mainStrength
    ? `A maior pontuação em ${dimensionName(mainStrength)} sugere uma prática a manter e usar como apoio para outras decisões.`
    : 'O perfil equilibrado sugere que a evolução pode partir de qualquer dimensão, preservando a coerência do conjunto.'
  const priorityText = result.similarPerformance
    ? `Seu próximo avanço pode estar em experimentar ${dimensionName(priority).toLowerCase()}, selecionada pela prioridade metodológica e não por representar uma fragilidade.`
    : `Seu próximo avanço pode estar em ${dimensionName(priority).toLowerCase()}, dimensão que oferece uma oportunidade concreta de tornar intenção, critérios e evidências mais consistentes.`
  const attention = result.attentionSignals.length
    ? `Antes de ampliar o uso, o resultado também recomenda atenção a este cuidado: ${result.attentionSignals[0]}`
    : 'Isso pode aparecer no cotidiano como escolhas mais conscientes, acompanhadas e revisadas à luz do que os estudantes efetivamente conseguem fazer.'

  return `${generalBandInterpretations[result.band.id]} ${balance} ${strength} ${priorityText} ${attention}`
}

function selectImplications(result: ScoreResult) {
  const candidates: DimensionId[] = [
    ...result.strengths,
    result.recommendationDimension,
    'assessment_feedback',
    'ai_pedagogical_integration',
    'ethics_safety_authorship',
    'experience_creation',
  ]
  return [...new Set(candidates)].slice(0, 4).map((id) => teachingImplications[id])
}

export function buildResultNarrative(result: ScoreResult): ResultNarrative {
  const priority = result.recommendationDimension
  const basePlan = developmentPlans[priority]
  const balancedExplanation = result.similarPerformance
    ? 'Não há diferença suficiente entre as dimensões para declarar força ou zona prioritária. O experimento sugerido segue a prioridade metodológica, serve como ponto de partida para a evolução e não indica fragilidade.'
    : null

  return {
    summary: buildSummary(result),
    implications: selectImplications(result),
    dimensionInterpretations: result.dimensionScores.map((dimension) => {
      const bandId = classifyBand(dimension.score)
      return {
        ...dimension,
        bandId,
        bandName: {
          initiation: 'Iniciação',
          exploration: 'Exploração',
          integration: 'Integração',
          transformation: 'Transformação',
        }[bandId],
        content: dimensionInterpretations[dimension.dimensionId][bandId],
      }
    }),
    balancedExplanation,
    developmentPlan: {
      dimensionId: priority,
      whyPrioritized: result.similarPerformance
        ? 'As dimensões estão próximas. Esta escolha segue a regra de prioridade metodológica e não indica fragilidade.'
        : `Esta dimensão está entre as menores pontuações e foi selecionada pela regra de prioridade definida no instrumento.`,
      ...basePlan,
    },
    reflectionQuestion: reflectionQuestions[priority],
  }
}
