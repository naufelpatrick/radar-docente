import type { PraxiaProduct, ProductId } from '../types/products'
import type { ScoreBandId } from '../types/result'

export const OFFICIAL_EBOOK_NAME = 'IA na Prática Docente'

export const products: PraxiaProduct[] = [
  {
    id: 'ebook',
    name: OFFICIAL_EBOOK_NAME,
    audience: 'teachers',
    category: 'ebook',
    description: 'Um guia prático para planejar atividades, selecionar ferramentas e integrar a inteligência artificial à docência com mais intenção, segurança e sentido pedagógico.',
    benefits: [
      'Orientações aplicáveis ao cotidiano docente',
      'Exemplos de uso pedagógico da IA',
      'Planejamento e criação de atividades',
      'Autoria, ética e pensamento crítico',
      'Propostas práticas para diferentes contextos educacionais',
    ],
    ctaLabel: 'Conhecer o e-book',
    href: '/ebook',
    status: 'information_available',
    recommendedFor: ['initiation', 'exploration'],
  },
  {
    id: 'mentoring',
    name: 'Mentoria PráxIA para Professores',
    audience: 'teachers',
    category: 'mentoring',
    description: 'Uma sessão individual para interpretar seu resultado, discutir desafios reais e construir um plano de desenvolvimento aplicável à sua prática docente.',
    benefits: [
      'Leitura orientada do resultado PráxIA',
      'Conversa sobre desafios reais',
      'Priorização de competências',
      'Construção de um plano de desenvolvimento',
      'Recomendações adequadas ao contexto do professor',
    ],
    ctaLabel: 'Conhecer a mentoria',
    href: '/mentoria',
    status: 'information_available',
    recommendedFor: ['integration', 'transformation'],
  },
  {
    id: 'workshop',
    name: 'IA na prática docente: do recurso à intenção pedagógica',
    audience: 'institutions',
    category: 'training',
    description: 'Formação prática com experimentação orientada e desenvolvimento de atividades que podem ser levadas para a sala de aula.',
    benefits: ['Experimentação orientada', 'Aplicação ao contexto da equipe', 'Produção de propostas pedagógicas'],
    ctaLabel: 'Conhecer os workshops',
    href: '/para-instituicoes#workshops',
    status: 'information_available',
    recommendedFor: [],
    duration: ['2 horas', '4 horas', '8 horas'],
    format: ['Presencial', 'On-line'],
  },
  {
    id: 'talk',
    name: 'Fluência digital docente em tempos de IA',
    audience: 'institutions',
    category: 'lecture',
    description: 'Uma conversa acessível e provocativa sobre o que muda — e o que permanece essencial — no trabalho docente com a chegada da inteligência artificial.',
    benefits: ['Intenção pedagógica', 'Autoria, ética e pensamento crítico', 'Formação docente para a era da IA'],
    ctaLabel: 'Conhecer as palestras',
    href: '/para-instituicoes#palestras',
    status: 'information_available',
    recommendedFor: [],
    duration: ['60 a 90 minutos'],
    format: ['Presencial', 'On-line'],
  },
]

export const teacherProducts = products.filter((product) => product.audience === 'teachers')
export const institutionalProducts = products.filter((product) => product.audience === 'institutions')

export function getProduct(id: ProductId) {
  return products.find((product) => product.id === id)
}

export function getRecommendedProduct(scoreBand: ScoreBandId) {
  return teacherProducts.find((product) => product.recommendedFor.includes(scoreBand))
}
