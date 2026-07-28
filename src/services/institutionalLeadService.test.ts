import { describe, expect, it } from 'vitest'
import type { InstitutionalLead } from '../types/institutionalLead'
import { institutionalLeadAdapter, LeadIntegrationUnavailableError, validateInstitutionalLead } from './institutionalLeadService'

const validLead: InstitutionalLead = {
  name: 'Pessoa', institution: 'Instituição', role: 'Coordenação',
  email: 'pessoa@example.com', phone: '(11) 99999-9999', city: 'São Paulo', state: 'SP',
  modality: 'online', interest: 'both', participantsRange: '30',
  preferredPeriod: 'Segundo semestre', message: 'Formação para a equipe.',
  sourcePage: '/para-instituicoes',
}

describe('lead institucional', () => {
  it('bloqueia envio incompleto', () => {
    const errors = validateInstitutionalLead({ ...validLead, name: '' })
    expect(errors.name).toBeTruthy()
  })

  it('valida e-mail', () => {
    expect(validateInstitutionalLead({ ...validLead, email: 'invalido' }).email).toBe('Informe um e-mail válido.')
  })

  it('valida telefone com DDD', () => {
    expect(validateInstitutionalLead({ ...validLead, phone: '123' }).phone).toBe('Informe um telefone com DDD.')
  })

  it('aceita um lead completo', () => {
    expect(validateInstitutionalLead(validLead)).toEqual({})
  })

  it('não simula sucesso enquanto a integração não existe', async () => {
    await expect(institutionalLeadAdapter.submit(validLead)).rejects.toBeInstanceOf(LeadIntegrationUnavailableError)
  })
})
