import { describe, expect, it } from 'vitest'
import { validateRadarLead } from './radarLeadService'

describe('validateRadarLead', () => {
  const validLead = {
    name: 'Ana Professora',
    email: 'ana@example.com',
    city: '',
    institution: '',
    marketingConsent: false,
  }

  it('accepts the minimum required identification', () => {
    expect(validateRadarLead(validLead)).toEqual({})
  })

  it('requires a name and valid email', () => {
    expect(validateRadarLead({ ...validLead, name: 'A', email: 'invalido' })).toEqual({
      name: 'Informe seu nome.',
      email: 'Informe um e-mail válido.',
    })
  })

  it('limits optional context fields', () => {
    const errors = validateRadarLead({
      ...validLead,
      city: 'a'.repeat(121),
      institution: 'b'.repeat(181),
    })
    expect(errors.city).toBeDefined()
    expect(errors.institution).toBeDefined()
  })
})
