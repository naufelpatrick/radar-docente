import { buildSiteUrl } from '../config/site.ts'

export type BlogArticleStatus = 'published' | 'draft' | 'in_preparation'

export type BlogArticle = {
  slug: string
  path: string
  category: string
  categorySlug: string
  editorialLabel: string
  title: string
  summary: string
  seoTitle: string
  metaDescription: string
  readingTime: string
  publishedAt: string | null
  modifiedAt: string
  publishedDate: string
  displayDate: string
  canonicalUrl: string
  socialImage: string
  socialImageAlt: string
  author: string
  status: BlogArticleStatus
  coverImage?: { src: string; alt: string }
  faq?: Array<{ question: string; answer: string }>
}

const blogArticleEntries: Array<Omit<BlogArticle, 'canonicalUrl'>> = [
  {
    slug: 'como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
    path: '/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica',
    category: 'Ferramentas',
    categorySlug: 'ferramentas',
    editorialLabel: 'ESCOLHA COM CRITÉRIO',
    title: 'Como escolher uma ferramenta de IA para uma atividade pedagógica',
    summary: 'Um método para comparar objetivo, função, precisão, privacidade, acesso, custo e revisão antes de levar uma ferramenta de IA para a aula.',
    seoTitle: 'Como escolher uma ferramenta de IA para uma atividade pedagógica | PraxIA',
    metaDescription: 'Compare objetivo, função, precisão, privacidade, acesso e custo antes de escolher uma ferramenta de inteligência artificial para sua aula.',
    readingTime: '9 min de leitura',
    publishedAt: '2026-08-02T12:00:00-03:00',
    modifiedAt: '2026-08-02',
    publishedDate: '2 ago. 2026',
    displayDate: '2 de agosto de 2026',
    socialImage: 'https://www.radarpraxia.com/social/escolher-ferramenta-ia-atividade-pedagogica-1200x630.jpg',
    socialImageAlt: 'Professora analisa ferramentas abstratas que passam por filtros de objetivo, função, segurança, acesso e revisão',
    author: 'Patrick Naufel',
    status: 'published',
    coverImage: {
      src: '/social/escolher-ferramenta-ia-atividade-pedagogica-1200x630.webp',
      alt: 'Professora seleciona uma ferramenta de IA após comparar critérios pedagógicos, éticos e operacionais',
    },
    faq: [
      { question: 'Qual é a melhor ferramenta de IA para professores?', answer: 'Não existe uma única resposta. A melhor ferramenta é aquela que atende ao objetivo, possui qualidade suficiente, protege dados, é acessível e permite revisão.' },
      { question: 'Posso usar uma ferramenta gratuita com estudantes?', answer: 'Sim, desde que sejam verificados termos, idade mínima, privacidade, limites e condições de acesso. Gratuidade não garante adequação.' },
      { question: 'Preciso testar a ferramenta antes da aula?', answer: 'Sim. Teste tarefas próximas da atividade real, incluindo situações difíceis e possíveis erros.' },
      { question: 'Ferramentas que mostram fontes são sempre mais confiáveis?', answer: 'Não. As fontes também precisam ser verificadas. A presença de links melhora a possibilidade de revisão, mas não garante precisão.' },
      { question: 'A instituição precisa aprovar todas as ferramentas?', answer: 'Siga as políticas locais. Quando há dados de estudantes, cadastro obrigatório ou uso recorrente, a avaliação institucional é especialmente importante.' },
    ],
  },
  {
    slug: 'como-avaliar-atividades-produzidas-com-apoio-de-ia',
    path: '/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia',
    category: 'Avaliação',
    categorySlug: 'avaliacao',
    editorialLabel: 'EVIDÊNCIAS DE APRENDIZAGEM',
    title: 'Como avaliar atividades produzidas com apoio de IA',
    summary: 'Critérios e modelos práticos para avaliar processo, autoria, decisões e aprendizagem em trabalhos produzidos com apoio de inteligência artificial.',
    seoTitle: 'Como avaliar atividades produzidas com apoio de IA | PraxIA',
    metaDescription: 'Aprenda a avaliar processo, autoria, decisões e aprendizagem em trabalhos produzidos com apoio de inteligência artificial.',
    readingTime: '11 min de leitura',
    publishedAt: '2026-07-29T20:30:00-03:00',
    modifiedAt: '2026-07-29',
    publishedDate: '29 jul. 2026',
    displayDate: '29 de julho de 2026',
    socialImage: 'https://www.radarpraxia.com/social/avaliar-atividades-com-ia-1200x630.jpg',
    socialImageAlt: 'Professora observa as camadas de aprendizagem por trás de um trabalho produzido com apoio de inteligência artificial',
    author: 'Patrick Naufel',
    status: 'published',
    coverImage: {
      src: '/social/avaliar-atividades-com-ia-1200x630.webp',
      alt: 'Professor avalia as etapas de aprendizagem por trás de um trabalho produzido com apoio de inteligência artificial',
    },
    faq: [
      { question: 'Preciso pedir todos os prompts utilizados?', answer: 'Não. Solicite apenas registros relevantes para o objetivo. Em muitos casos, uma declaração, uma comparação entre versões e uma justificativa são suficientes.' },
      { question: 'Posso descontar nota pelo uso de IA?', answer: 'Somente quando as regras foram definidas previamente e o uso contrariou critérios claros. A avaliação deve considerar a competência e a gravidade do ocorrido, não apenas a presença da ferramenta.' },
      { question: 'Como avaliar um trabalho que parece ter sido gerado por IA?', answer: 'Converse com o estudante, solicite explicação, analise evidências de processo e aplique os critérios comunicados. Não baseie a decisão apenas em impressão ou detector automático.' },
      { question: 'A defesa oral deve ser obrigatória em todos os trabalhos?', answer: 'Não. Pode ser utilizada em atividades específicas, por amostragem ou quando é relevante para a competência avaliada.' },
      { question: 'É possível usar IA para ajudar na correção?', answer: 'Sim, como apoio preliminar para organizar observações ou comparar critérios, desde que o professor revise o resultado e permaneça responsável pela avaliação final.' },
    ],
  },
  {
    slug: 'o-que-sao-competencias-docentes-para-uso-de-ia',
    path: '/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia',
    category: 'Competências Docentes',
    categorySlug: 'competencias-docentes',
    editorialLabel: 'DESENVOLVIMENTO PROFISSIONAL',
    title: 'O que são competências docentes para uso de IA',
    summary: 'Capacidades que ajudam professores a integrar inteligência artificial com intenção pedagógica, senso crítico, ética, segurança e responsabilidade.',
    seoTitle: 'Competências docentes para uso de IA: o que desenvolver | PraxIA',
    metaDescription: 'Entenda quais competências professores precisam desenvolver para usar inteligência artificial com intenção pedagógica, senso crítico, ética e segurança.',
    readingTime: '10 min de leitura',
    publishedAt: '2026-07-29',
    modifiedAt: '2026-07-29',
    publishedDate: '29 jul. 2026',
    displayDate: '29 de julho de 2026',
    socialImage: 'https://www.radarpraxia.com/social/competencias-docentes-uso-ia-1200x630.jpg',
    socialImageAlt: 'Professor no centro de um sistema de competências conectadas para o uso pedagógico e responsável da inteligência artificial',
    author: 'Patrick Naufel',
    status: 'published',
    coverImage: {
      src: '/social/competencias-docentes-uso-ia-1200x630.webp',
      alt: 'Professor desenvolve diferentes competências para utilizar inteligência artificial de forma pedagógica e responsável',
    },
    faq: [
      { question: 'Preciso saber programação para desenvolver competências em IA?', answer: 'Não. É necessário compreender conceitos básicos, limites e critérios de uso, mas muitas competências são pedagógicas, éticas e avaliativas.' },
      { question: 'Criar bons prompts é a principal competência?', answer: 'Não. Formular instruções é uma habilidade importante, mas não substitui planejamento, verificação, proteção de dados, autoria e avaliação.' },
      { question: 'Professores que usam poucas ferramentas possuem baixa maturidade?', answer: 'Não necessariamente. Maturidade está relacionada à qualidade das decisões, e não à quantidade de ferramentas utilizadas.' },
      { question: 'Como avaliar minhas competências em IA?', answer: 'Utilize um diagnóstico multidimensional que observe comportamentos e decisões concretas em áreas como planejamento, avaliação crítica, ética, segurança e desenvolvimento profissional.' },
      { question: 'A formação deve ser igual para todos?', answer: 'Não. Professores possuem contextos e experiências diferentes. A formação deve considerar o diagnóstico e oferecer trajetórias progressivas.' },
    ],
  },
  {
    slug: 'usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    path: '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    category: 'IA para Professores',
    categorySlug: 'ia-para-professores',
    editorialLabel: 'PRIMEIROS PASSOS',
    title: 'Usar IA com estudantes começa antes da ferramenta',
    summary: 'Um roteiro pedagógico para definir objetivo, dados, transparência, autoria e revisão antes de escolher uma ferramenta de inteligência artificial.',
    seoTitle: 'Usar IA com estudantes começa antes da ferramenta | PraxIA',
    metaDescription: 'Um roteiro pedagógico para definir objetivo, dados, transparência, autoria e revisão antes de escolher uma ferramenta de inteligência artificial.',
    readingTime: '7 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    socialImage: 'https://www.radarpraxia.com/social/usar-ia-antes-da-ferramenta-1200x630.jpg',
    socialImageAlt: 'Capa do artigo Usar IA com estudantes começa antes da ferramenta, da PráxIA',
    author: 'Patrick Naufel',
    status: 'published',
  },
  {
    slug: 'da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
    path: '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
    category: 'Planejamento',
    categorySlug: 'planejamento',
    editorialLabel: 'PLANEJAMENTO',
    title: 'Da possibilidade tecnológica ao objetivo de aprendizagem',
    summary: 'Um caminho para transformar possibilidades da IA em atividades coerentes com objetivos, evidências e decisões de aprendizagem.',
    seoTitle: 'Da possibilidade tecnológica ao objetivo de aprendizagem | PraxIA',
    metaDescription: 'Um caminho para transformar possibilidades da IA em atividades coerentes com objetivos, evidências e decisões de aprendizagem.',
    readingTime: '9 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    socialImage: 'https://www.radarpraxia.com/social/possibilidade-tecnologica-objetivo-aprendizagem-1200x630.jpg',
    socialImageAlt: 'Capa do artigo Da possibilidade tecnológica ao objetivo de aprendizagem, da PráxIA',
    author: 'Patrick Naufel',
    status: 'published',
  },
  {
    slug: 'como-conversar-sobre-autoria-em-atividades-com-ia',
    path: '/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
    category: 'Ética',
    categorySlug: 'etica',
    editorialLabel: 'ÉTICA E AUTORIA',
    title: 'Como conversar sobre autoria em atividades com IA',
    summary: 'Critérios e modelos práticos para orientar transparência, contribuição humana e responsabilidade em trabalhos com apoio de IA.',
    seoTitle: 'Como conversar sobre autoria em atividades com IA | PraxIA',
    metaDescription: 'Critérios e modelos práticos para orientar transparência, contribuição humana e responsabilidade em trabalhos com apoio de IA.',
    readingTime: '10 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    socialImage: 'https://www.radarpraxia.com/social/autoria-atividades-com-ia-1200x630.jpg',
    socialImageAlt: 'Capa do artigo Como conversar sobre autoria em atividades com IA, da PráxIA',
    author: 'Patrick Naufel',
    status: 'published',
  },
]

export const blogArticles: BlogArticle[] = blogArticleEntries.map((article) => ({
  ...article,
  canonicalUrl: buildSiteUrl(article.path),
}))

function hasValidPublicationDate(article: BlogArticle) {
  return article.publishedAt !== null && !Number.isNaN(Date.parse(article.publishedAt))
}

export function getPublishedBlogArticles() {
  return blogArticles
    .filter((article) => article.status === 'published' && hasValidPublicationDate(article))
    .sort((first, second) => Date.parse(second.publishedAt!) - Date.parse(first.publishedAt!))
}

export function getPublishedArticlesByCategory(categorySlug: string) {
  return getPublishedBlogArticles().filter((article) => article.categorySlug === categorySlug)
}

export function getBlogArticleBySlug(slug: string) {
  const article = blogArticles.find((item) => item.slug === slug)
  if (!article) throw new Error(`Artigo não encontrado: ${slug}`)
  return article
}
