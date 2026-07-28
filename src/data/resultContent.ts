import type { DimensionId } from '../types/instrument'
import type { ScoreBandId } from '../types/result'

export const bandContent: Record<ScoreBandId, { name: string; message: string }> = {
  initiation: {
    name: 'Iniciação',
    message: 'Você está construindo repertório, critérios e segurança para integrar tecnologias digitais e IA à prática docente.',
  },
  exploration: {
    name: 'Exploração',
    message: 'Você já experimenta recursos digitais e IA, mas essas práticas ainda aparecem de forma pontual ou dependem muito da situação.',
  },
  integration: {
    name: 'Integração',
    message: 'Você utiliza recursos digitais e IA com intenção pedagógica e demonstra critérios consistentes em diferentes momentos da prática docente.',
  },
  transformation: {
    name: 'Transformação',
    message: 'Você articula tecnologias digitais e IA de maneira crítica, inclusiva, autoral e sistemática para ampliar possibilidades de ensino e aprendizagem.',
  },
}

export const recommendations: Record<DimensionId, string> = {
  planning_curation: 'Antes da próxima atividade, defina o objetivo de aprendizagem e compare ao menos duas fontes ou resultados antes de selecionar o recurso digital.',
  experience_creation: 'Transforme uma atividade de consumo de conteúdo em uma experiência na qual os estudantes decidam, investiguem, produzam ou justifiquem escolhas.',
  mediation_collaboration: 'Estabeleça papéis, critérios de participação e momentos de acompanhamento em sua próxima atividade digital colaborativa.',
  assessment_feedback: 'Reúna pelo menos duas evidências de aprendizagem e ofereça uma devolutiva que indique conquista, ponto de revisão e próximo passo.',
  ai_pedagogical_integration: 'Escolha uma atividade real, defina primeiro o objetivo e registre por que a IA ajuda — ou por que não deve ser utilizada — nesse contexto.',
  ethics_safety_authorship: 'Revise quais dados, conteúdos identificáveis e regras de autoria estão envolvidos antes de utilizar uma ferramenta digital ou de IA com estudantes.',
}

export const recommendationPriority: DimensionId[] = [
  'ethics_safety_authorship',
  'planning_curation',
  'ai_pedagogical_integration',
  'assessment_feedback',
  'mediation_collaboration',
  'experience_creation',
]
