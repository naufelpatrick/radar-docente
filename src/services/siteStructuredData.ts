import { SITE_URL } from '../config/site.ts'
import { team } from '../data/team.ts'

export const organizationId = `${SITE_URL}/#organization`
export const websiteId = `${SITE_URL}/#website`

export const praxiaOrganizationSchema = {
  '@type': 'Organization',
  '@id': organizationId,
  name: 'PraxIA',
  alternateName: 'Radar PraxIA',
  url: `${SITE_URL}/`,
  description: 'Fluência digital e inteligência artificial para a prática docente.',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/brand/praxia-logo-positive.svg`,
  },
  sameAs: [
    'https://www.instagram.com/radarpraxia/',
    'https://www.facebook.com/radarpraxia',
  ],
  member: team.map((member) => ({
    '@type': 'Person',
    name: member.name,
    url: `${SITE_URL}/autores/${member.id}`,
    sameAs: member.links.map((link) => link.href),
  })),
}

export const praxiaWebsiteSchema = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: 'PraxIA',
  alternateName: 'Radar PraxIA',
  url: `${SITE_URL}/`,
  inLanguage: 'pt-BR',
  description: 'Radar de Fluência Digital e IA para professores.',
  publisher: { '@id': organizationId },
}
