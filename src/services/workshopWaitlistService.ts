import { createClient } from '@supabase/supabase-js'
import type { WorkshopWaitlistErrors, WorkshopWaitlistLead } from '../types/workshopWaitlist'

export class WorkshopWaitlistIntegrationUnavailableError extends Error {}
export class WorkshopWaitlistDuplicateError extends Error {}
export class WorkshopWaitlistSubmissionError extends Error {}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const client = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null

export async function submitWorkshopWaitlistLead(lead: WorkshopWaitlistLead) {
  if (!client) throw new WorkshopWaitlistIntegrationUnavailableError()

  const { error } = await client.from('workshop_waitlist').insert({
    nome: lead.nome.trim(),
    email: lead.email.trim().toLowerCase(),
    etapa_ensino: lead.etapaEnsino,
    duvida_principal: lead.duvidaPrincipal.trim() || null,
    topa_pagar: lead.topaPagar,
    utm_source: lead.utmSource?.trim() || null,
    utm_campaign: lead.utmCampaign?.trim() || null,
  })

  if (error?.code === '23505') throw new WorkshopWaitlistDuplicateError()
  if (error) throw new WorkshopWaitlistSubmissionError()
  return { submitted: true as const }
}

export function validateWorkshopWaitlistLead(lead: WorkshopWaitlistLead) {
  const errors: WorkshopWaitlistErrors = {}
  if (lead.nome.trim().length < 2) errors.nome = 'Informe seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = 'Informe um e-mail válido.'
  if (!lead.etapaEnsino) errors.etapaEnsino = 'Selecione uma etapa de ensino.'
  if (!lead.topaPagar) errors.topaPagar = 'Selecione uma opção.'
  return errors
}
