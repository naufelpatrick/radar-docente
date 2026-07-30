export const praxiaLinks = {
  diagnostic: '/radar',
  blog: '/blog',
  ebook: '/ebook',
  mentoring: '/mentoria',
  workshops: '/para-instituicoes#workshops',
  lectures: '/para-instituicoes#palestras',
  instagram: 'https://www.instagram.com/radarpraxia/',
  linkedin: 'https://www.linkedin.com/company/radar-pr%C3%A1xia/',
  website: '/',
  contact: '/contato',
  about: '/sobre',
  privacy: '/privacidade',
} as const

export type LinksPageEvent =
  | 'links_diagnostico_click'
  | 'links_blog_click'
  | 'links_ebook_click'
  | 'links_mentoria_click'
  | 'links_workshop_click'
  | 'links_palestra_click'
  | 'links_instagram_click'
  | 'links_linkedin_click'
  | 'links_site_click'
  | 'links_contato_click'
