import type { DimensionDefinition, InstrumentItem, InstrumentOption } from '../types/instrument'

export const INSTRUMENT_VERSION = 'beta-0.1' as const

export const dimensions: DimensionDefinition[] = [
  { id: 'planning_curation', name: 'Planejamento e curadoria', shortName: 'Planejamento' },
  { id: 'experience_creation', name: 'Criação de experiências', shortName: 'Experiências' },
  { id: 'mediation_collaboration', name: 'Mediação e colaboração', shortName: 'Mediação' },
  { id: 'assessment_feedback', name: 'Avaliação e feedback', shortName: 'Avaliação' },
  { id: 'ai_pedagogical_integration', name: 'Integração pedagógica da IA', shortName: 'Integração da IA' },
  { id: 'ethics_safety_authorship', name: 'Ética, segurança e autoria', shortName: 'Ética e autoria' },
]

const behavioralOptions: InstrumentOption[] = [
  { id: '1', label: 'Nunca', value: 1 },
  { id: '2', label: 'Raramente', value: 2 },
  { id: '3', label: 'Às vezes', value: 3 },
  { id: '4', label: 'Frequentemente', value: 4 },
  { id: '5', label: 'De forma sistemática', value: 5 },
]

const situationalOptions = (labels: string[]): InstrumentOption[] =>
  labels.map((label, index) => ({
    id: String.fromCharCode(65 + index),
    label,
    value: (index + 1) as 1 | 2 | 3 | 4 | 5,
  }))

type ItemSeed = Omit<InstrumentItem, 'instrumentVersion' | 'dimensionName' | 'required' | 'order' | 'options'> & {
  options?: InstrumentOption[]
}

const seeds: ItemSeed[] = [
  { id: 'PC1', dimensionId: 'planning_curation', type: 'behavioral', prompt: 'Antes de utilizar um recurso digital em uma atividade, verifico se ele contribui diretamente para os objetivos de aprendizagem.' },
  { id: 'PC2', dimensionId: 'planning_curation', type: 'behavioral', prompt: 'Comparo informações de mais de uma fonte antes de utilizar conteúdos encontrados on-line ou produzidos por IA.' },
  { id: 'PC3', dimensionId: 'planning_curation', type: 'behavioral', prompt: 'Adapto recursos digitais às características, conhecimentos prévios e condições de acesso dos meus estudantes.' },
  { id: 'PC4', dimensionId: 'planning_curation', type: 'behavioral', prompt: 'Reviso a precisão, a linguagem e a adequação pedagógica de conteúdos gerados por IA antes de utilizá-los.' },
  { id: 'PC5', dimensionId: 'planning_curation', type: 'situational', prompt: 'Você encontra um material digital visualmente atraente e pronto para usar, mas não conhece sua fonte. Qual alternativa mais se aproxima da sua decisão?', options: situationalOptions([
    'Utilizo o material porque sua apresentação parece profissional.',
    'Faço uma leitura rápida e utilizo as partes que parecem adequadas.',
    'Verifico autoria e data antes de decidir se utilizarei o material.',
    'Confiro autoria, data, referências e alinhamento com os objetivos da atividade.',
    'Além das verificações anteriores, comparo o conteúdo com outras fontes e o adapto ao contexto e à acessibilidade dos estudantes.',
  ]) },
  { id: 'CE1', dimensionId: 'experience_creation', type: 'behavioral', prompt: 'Utilizo tecnologias digitais para criar atividades em que os estudantes tomam decisões, investigam ou produzem algo, e não apenas recebem conteúdo.' },
  { id: 'CE2', dimensionId: 'experience_creation', type: 'behavioral', prompt: 'Ofereço diferentes formas de participação ou expressão quando uma única modalidade digital pode criar barreiras para alguns estudantes.' },
  { id: 'CE3', dimensionId: 'experience_creation', type: 'behavioral', prompt: 'Adapto materiais digitais ou produzidos com IA em vez de utilizá-los exatamente como foram gerados.' },
  { id: 'CE4', dimensionId: 'experience_creation', type: 'behavioral', prompt: 'Avalio se a tecnologia acrescenta valor à experiência antes de incluí-la na atividade.' },
  { id: 'CE5', dimensionId: 'experience_creation', type: 'situational', prompt: 'Você precisa criar uma atividade sobre um conteúdo complexo e considera utilizar IA. Qual alternativa mais se aproxima da sua decisão?', options: situationalOptions([
    'Peço à IA uma atividade completa e aplico a primeira resposta.',
    'Utilizo a primeira resposta como atividade, fazendo correções de linguagem.',
    'Gero algumas possibilidades e escolho a que parece mais adequada.',
    'Defino objetivos e critérios, gero alternativas, combino ideias e adapto a atividade ao contexto da turma.',
    'Além das ações anteriores, prevejo formas distintas de participação, testo possíveis dificuldades e planejo como os estudantes justificarão suas escolhas.',
  ]) },
  { id: 'MC1', dimensionId: 'mediation_collaboration', type: 'behavioral', prompt: 'Durante atividades digitais, acompanho o processo dos estudantes e intervenho quando surgem dúvidas, dificuldades ou decisões importantes.' },
  { id: 'MC2', dimensionId: 'mediation_collaboration', type: 'behavioral', prompt: 'Estabeleço orientações claras sobre como os estudantes devem se comunicar e colaborar em ambientes digitais.' },
  { id: 'MC3', dimensionId: 'mediation_collaboration', type: 'behavioral', prompt: 'Utilizo evidências de participação digital para identificar estudantes que precisam de apoio, sem reduzir participação apenas à quantidade de acessos ou mensagens.' },
  { id: 'MC4', dimensionId: 'mediation_collaboration', type: 'behavioral', prompt: 'Crio oportunidades para que os estudantes analisem, comentem ou aprimorem produções uns dos outros com critérios definidos.' },
  { id: 'MC5', dimensionId: 'mediation_collaboration', type: 'situational', prompt: 'Em uma atividade colaborativa on-line, parte da turma participa pouco e algumas pessoas concentram as decisões. Qual alternativa mais se aproxima da sua ação?', options: situationalOptions([
    'Mantenho a atividade como planejada e considero que a participação depende de cada estudante.',
    'Envio um lembrete geral pedindo maior participação.',
    'Converso com os grupos e redistribuo algumas tarefas.',
    'Analiso as barreiras, reorganizo papéis e acompanho a contribuição de cada participante.',
    'Além de reorganizar a atividade, combino diferentes formas de participação, construo critérios de colaboração com a turma e utilizo o processo como oportunidade de aprendizagem.',
  ]) },
  { id: 'AF1', dimensionId: 'assessment_feedback', type: 'behavioral', prompt: 'Utilizo recursos digitais para reunir diferentes evidências de aprendizagem, e não apenas respostas finais ou notas.' },
  { id: 'AF2', dimensionId: 'assessment_feedback', type: 'behavioral', prompt: 'Ofereço feedback que indica ao estudante o que foi alcançado, o que precisa ser revisto e qual pode ser o próximo passo.' },
  { id: 'AF3', dimensionId: 'assessment_feedback', type: 'behavioral', prompt: 'Quando utilizo IA para apoiar feedbacks, reviso cada devolutiva e assumo a decisão final sobre seu conteúdo.' },
  { id: 'AF4', dimensionId: 'assessment_feedback', type: 'behavioral', prompt: 'Ajusto atividades, explicações ou estratégias quando as evidências digitais mostram dificuldades de aprendizagem.' },
  { id: 'AF5', dimensionId: 'assessment_feedback', type: 'situational', prompt: 'Uma ferramenta com IA oferece a correção automática de uma atividade e produz comentários para cada estudante. Qual alternativa mais se aproxima da sua decisão?', options: situationalOptions([
    'Utilizo as notas e os comentários porque a ferramenta automatiza o processo.',
    'Leio alguns exemplos e, se parecerem adequados, libero todos os resultados.',
    'Reviso as notas e corrijo os comentários que apresentam erros evidentes.',
    'Verifico critérios, reviso as devolutivas e ajusto o feedback à trajetória de cada estudante.',
    'Além das ações anteriores, comparo o resultado com outras evidências, explico à turma como a IA participou do processo e ofereço possibilidade de revisão ou contestação.',
  ]) },
  { id: 'IA1', dimensionId: 'ai_pedagogical_integration', type: 'behavioral', prompt: 'Defino o objetivo pedagógico antes de decidir se uma ferramenta de IA será utilizada.' },
  { id: 'IA2', dimensionId: 'ai_pedagogical_integration', type: 'behavioral', prompt: 'Refino instruções, acrescento contexto e comparo respostas quando utilizo IA para apoiar meu trabalho.' },
  { id: 'IA3', dimensionId: 'ai_pedagogical_integration', type: 'behavioral', prompt: 'Verifico fatos, referências, exemplos e possíveis omissões nas respostas produzidas por IA.' },
  { id: 'IA4', dimensionId: 'ai_pedagogical_integration', type: 'behavioral', prompt: 'Reconheço situações em que utilizar IA não acrescentaria valor ou poderia prejudicar a aprendizagem e opto por não utilizá-la.' },
  { id: 'IA5', dimensionId: 'ai_pedagogical_integration', type: 'situational', prompt: 'Estudantes solicitam autorização para utilizar IA em um trabalho. Qual alternativa mais se aproxima da sua decisão?', options: situationalOptions([
    'Permito o uso livre porque a IA já faz parte da realidade profissional.',
    'Permito desde que os estudantes informem que utilizaram IA.',
    'Defino quais etapas podem utilizar IA e peço que entreguem também os comandos usados.',
    'Relaciono as permissões aos objetivos de aprendizagem e solicito registro das escolhas, verificações e alterações realizadas.',
    'Além das ações anteriores, discuto criticamente limites e vieses, preservo etapas de autoria dos estudantes e avalio o processo, não apenas o produto final.',
  ]) },
  { id: 'EA1', dimensionId: 'ethics_safety_authorship', type: 'behavioral', prompt: 'Evito inserir em ferramentas digitais ou de IA dados pessoais, trabalhos identificáveis ou informações sensíveis sem necessidade e autorização adequadas.' },
  { id: 'EA2', dimensionId: 'ethics_safety_authorship', type: 'behavioral', prompt: 'Analiso se resultados produzidos por tecnologias ou IA podem reproduzir vieses, estereótipos ou exclusões.' },
  { id: 'EA3', dimensionId: 'ethics_safety_authorship', type: 'behavioral', prompt: 'Informo de maneira transparente quando conteúdos, atividades ou feedbacks tiveram apoio de IA.' },
  { id: 'EA4', dimensionId: 'ethics_safety_authorship', type: 'behavioral', prompt: 'Estabeleço critérios claros sobre autoria, citação e uso aceitável de IA nas produções dos estudantes.' },
  { id: 'EA5', dimensionId: 'ethics_safety_authorship', type: 'situational', prompt: 'Para gerar feedbacks personalizados, uma ferramenta solicita o envio dos trabalhos com nomes e informações dos estudantes. Qual alternativa mais se aproxima da sua decisão?', options: situationalOptions([
    'Envio os arquivos porque a personalização depende dessas informações.',
    'Envio apenas os trabalhos que não apresentam informações consideradas sensíveis.',
    'Retiro os nomes antes de enviar os arquivos.',
    'Verifico finalidade, política de dados e autorização institucional, além de remover informações desnecessárias.',
    'Além das ações anteriores, procuro uma alternativa com menor coleta de dados, avalio os riscos, informo os envolvidos e mantenho supervisão humana sobre todos os feedbacks.',
  ]) },
]

export const instrument: InstrumentItem[] = seeds.map((seed, index) => {
  const dimension = dimensions.find(({ id }) => id === seed.dimensionId)
  if (!dimension) throw new Error(`Dimensão ausente para ${seed.id}`)

  return {
    ...seed,
    instrumentVersion: INSTRUMENT_VERSION,
    dimensionName: dimension.name,
    options: seed.options ?? behavioralOptions,
    required: true,
    order: index + 1,
  }
})

export const teachingProfiles = [
  { id: 'fundamental_early', label: 'Ensino Fundamental — anos iniciais' },
  { id: 'fundamental_late', label: 'Ensino Fundamental — anos finais' },
  { id: 'high_school', label: 'Ensino Médio' },
  { id: 'technical_professional', label: 'Educação Técnica ou Profissional' },
  { id: 'higher_postgraduate', label: 'Ensino Superior ou pós-graduação' },
] as const
