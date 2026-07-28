import type { ContactLead, LeadErrors, MentoringLead } from '../types/publicLead'

export class PublicLeadIntegrationUnavailableError extends Error {
  constructor() {
    super('O envio online ainda não está conectado.')
  }
}

export class PublicLeadSubmissionError extends Error {
  constructor() {
    super('Não foi possível registrar a solicitação.')
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

async function insertPublicLead(table: 'lead_contato' | 'lead_mentoria', body: Record<string, string | boolean>) {
  if (!supabaseUrl || !supabaseAnonKey) throw new PublicLeadIntegrationUnavailableError()

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new PublicLeadSubmissionError()
  return { submitted: true as const }
}

export const contactLeadService = {
  submit(lead: ContactLead) {
    return insertPublicLead('lead_contato', {
      name: lead.name.trim(),
      email: lead.email.trim().toLowerCase(),
      subject: lead.subject,
      message: lead.message.trim(),
      source_page: '/contato',
      privacy_consent: lead.privacyConsent,
      status: 'new',
    })
  },
}

export const mentoringLeadService = {
  submit(lead: MentoringLead) {
    return insertPublicLead('lead_mentoria', {
      name: lead.name.trim(),
      email: lead.email.trim().toLowerCase(),
      phone: lead.phone.trim(),
      teaching_context: lead.teachingContext.trim(),
      main_challenge: lead.mainChallenge.trim(),
      source_page: '/mentoria',
      privacy_consent: lead.privacyConsent,
      status: 'new',
    })
  },
}

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function validateContactLead(lead: ContactLead): LeadErrors<ContactLead> {
  const errors: LeadErrors<ContactLead> = {}
  if (lead.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!validEmail(lead.email)) errors.email = 'Informe um e-mail válido.'
  if (!lead.subject) errors.subject = 'Selecione um assunto.'
  if (lead.message.trim().length < 20) errors.message = 'Escreva uma mensagem com pelo menos 20 caracteres.'
  if (!lead.privacyConsent) errors.privacyConsent = 'Aceite o uso dos dados para enviar a mensagem.'
  return errors
}

export function validateMentoringLead(lead: MentoringLead): LeadErrors<MentoringLead> {
  const errors: LeadErrors<MentoringLead> = {}
  if (lead.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!validEmail(lead.email)) errors.email = 'Informe um e-mail válido.'
  const phoneDigits = lead.phone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 13) errors.phone = 'Informe um telefone com DDD.'
  if (lead.teachingContext.trim().length < 3) errors.teachingContext = 'Conte brevemente seu contexto de atuação.'
  if (lead.mainChallenge.trim().length < 20) errors.mainChallenge = 'Descreva seu desafio em pelo menos 20 caracteres.'
  if (!lead.privacyConsent) errors.privacyConsent = 'Aceite o uso dos dados para manifestar interesse.'
  return errors
}
