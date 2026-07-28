import type { InstitutionalLead, InstitutionalLeadErrors } from '../types/institutionalLead'

export interface InstitutionalLeadAdapter {
  submit(lead: InstitutionalLead): Promise<{ submitted: true }>
}

export class LeadIntegrationUnavailableError extends Error {
  constructor() {
    super('O envio online ainda não está conectado.')
  }
}

export class LeadSubmissionError extends Error {
  constructor() {
    super('Não foi possível registrar a solicitação.')
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const institutionalLeadAdapter: InstitutionalLeadAdapter = {
  async submit(lead) {
    if (!supabaseUrl || !supabaseAnonKey) throw new LeadIntegrationUnavailableError()

    const response = await fetch(`${supabaseUrl}/rest/v1/institutional_leads`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: lead.name.trim(),
        institution: lead.institution.trim(),
        role: lead.role.trim(),
        email: lead.email.trim().toLowerCase(),
        phone: lead.phone.trim(),
        city: lead.city.trim(),
        state: lead.state.trim(),
        modality: lead.modality,
        interest: lead.interest,
        participants_range: lead.participantsRange.trim(),
        preferred_period: lead.preferredPeriod.trim(),
        message: lead.message.trim(),
        source_page: lead.sourcePage,
        privacy_consent: lead.privacyConsent,
        status: 'new',
      }),
    })

    if (!response.ok) throw new LeadSubmissionError()
    return { submitted: true }
  },
}

export function validateInstitutionalLead(lead: InstitutionalLead): InstitutionalLeadErrors {
  const errors: InstitutionalLeadErrors = {}
  const requiredText: Array<keyof InstitutionalLead> = [
    'name', 'institution', 'role', 'email', 'phone', 'city', 'state',
    'modality', 'interest', 'participantsRange', 'preferredPeriod', 'message',
  ]
  requiredText.forEach((field) => {
    if (!String(lead[field]).trim()) errors[field] = 'Preencha este campo.'
  })
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.email = 'Informe um e-mail válido.'
  }
  const phoneDigits = lead.phone.replace(/\D/g, '')
  if (lead.phone && (phoneDigits.length < 10 || phoneDigits.length > 13)) {
    errors.phone = 'Informe um telefone com DDD.'
  }
  if (!lead.privacyConsent) errors.privacyConsent = 'Aceite a política de privacidade para continuar.'
  return errors
}
