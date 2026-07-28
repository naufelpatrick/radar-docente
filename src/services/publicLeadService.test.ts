import { describe, expect, it } from 'vitest'
import {
  contactLeadService,
  mentoringLeadService,
  PublicLeadIntegrationUnavailableError,
  validateContactLead,
  validateMentoringLead,
} from './publicLeadService'

const validContact = {
  name: 'Pessoa Teste',
  email: 'pessoa@example.com',
  subject: 'radar',
  message: 'Esta é uma mensagem válida para contato.',
  privacyConsent: true,
}

const validMentoring = {
  name: 'Pessoa Teste',
  email: 'pessoa@example.com',
  phone: '(11) 99999-9999',
  teachingContext: 'Ensino superior',
  mainChallenge: 'Quero integrar IA ao planejamento com mais intenção.',
  privacyConsent: true,
}

describe('public lead validation', () => {
  it('accepts valid contact and mentoring leads', () => {
    expect(validateContactLead(validContact)).toEqual({})
    expect(validateMentoringLead(validMentoring)).toEqual({})
  })

  it('rejects invalid contact data and missing consent', () => {
    expect(validateContactLead({ ...validContact, email: 'inválido', message: 'curta', privacyConsent: false })).toMatchObject({
      email: expect.any(String),
      message: expect.any(String),
      privacyConsent: expect.any(String),
    })
  })

  it('rejects invalid mentoring phone and short challenge', () => {
    expect(validateMentoringLead({ ...validMentoring, phone: '123', mainChallenge: 'curto' })).toMatchObject({
      phone: expect.any(String),
      mainChallenge: expect.any(String),
    })
  })
})

describe('public lead services', () => {
  it('does not simulate success without integration environment variables', async () => {
    await expect(contactLeadService.submit(validContact)).rejects.toBeInstanceOf(PublicLeadIntegrationUnavailableError)
    await expect(mentoringLeadService.submit(validMentoring)).rejects.toBeInstanceOf(PublicLeadIntegrationUnavailableError)
  })
})
