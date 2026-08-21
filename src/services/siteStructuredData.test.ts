import { describe, expect, it } from 'vitest'
import { organizationId, praxiaOrganizationSchema, praxiaWebsiteSchema } from './siteStructuredData'

describe('dados estruturados institucionais', () => {
  it('liga WebSite e Organization à origem canônica', () => {
    expect(praxiaOrganizationSchema['@id']).toBe('https://www.radarpraxia.com/#organization')
    expect(praxiaOrganizationSchema.logo.url).toBe('https://www.radarpraxia.com/brand/praxia-logo-positive.svg')
    expect(praxiaWebsiteSchema.publisher).toEqual({ '@id': organizationId })
    expect(praxiaWebsiteSchema.url).toBe('https://www.radarpraxia.com/')
  })
})
