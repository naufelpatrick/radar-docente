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
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    path: '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    category: 'IA para Professores',
    categorySlug: 'ia-para-professores',
    editorialLabel: 'PRIMEIROS PASSOS',
    title: 'Usar IA com estudantes começa antes da ferramenta',
    summary: 'Um roteiro pedagógico para definir objetivo, dados, transparência, autoria e revisão antes de escolher uma ferramenta de inteligência artificial.',
    seoTitle: 'Usar IA com estudantes começa antes da ferramenta | PráxIA',
    metaDescription: 'Um roteiro pedagógico para definir objetivo, dados, transparência, autoria e revisão antes de escolher uma ferramenta de inteligência artificial.',
    readingTime: '7 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    canonicalUrl: 'https://www.radarpraxia.com/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta',
    socialImage: 'https://www.radarpraxia.com/social/usar-ia-antes-da-ferramenta-1200x630.webp',
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
    seoTitle: 'Da possibilidade tecnológica ao objetivo de aprendizagem | PráxIA',
    metaDescription: 'Um caminho para transformar possibilidades da IA em atividades coerentes com objetivos, evidências e decisões de aprendizagem.',
    readingTime: '9 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    canonicalUrl: 'https://www.radarpraxia.com/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem',
    socialImage: 'https://www.radarpraxia.com/social/possibilidade-tecnologica-objetivo-aprendizagem-1200x630.webp',
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
    seoTitle: 'Como conversar sobre autoria em atividades com IA | PráxIA',
    metaDescription: 'Critérios e modelos práticos para orientar transparência, contribuição humana e responsabilidade em trabalhos com apoio de IA.',
    readingTime: '10 min de leitura',
    publishedAt: '2026-07-28',
    modifiedAt: '2026-07-28',
    publishedDate: '28 jul. 2026',
    displayDate: '28 de julho de 2026',
    canonicalUrl: 'https://www.radarpraxia.com/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia',
    socialImage: 'https://www.radarpraxia.com/social/autoria-atividades-com-ia-1200x630.webp',
    socialImageAlt: 'Capa do artigo Como conversar sobre autoria em atividades com IA, da PráxIA',
    author: 'Patrick Naufel',
    status: 'published',
  },
]

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
