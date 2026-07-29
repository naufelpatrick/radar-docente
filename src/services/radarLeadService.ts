import type { RadarLead, RadarLeadErrors, RadarLeadSubmission } from '../types/radarLead'

export class RadarLeadIntegrationUnavailableError extends Error {
  constructor() {
    super('O registro online está temporariamente indisponível.')
  }
}

export class RadarLeadSubmissionError extends Error {
  constructor() {
    super('Não foi possível registrar seus dados. Tente novamente.')
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function validateRadarLead(lead: RadarLead): RadarLeadErrors {
  const errors: RadarLeadErrors = {}
  if (lead.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!validEmail(lead.email.trim())) errors.email = 'Informe um e-mail válido.'
  if (lead.city.trim().length > 120) errors.city = 'Use no máximo 120 caracteres.'
  if (lead.institution.trim().length > 180) errors.institution = 'Use no máximo 180 caracteres.'
  return errors
}

export const radarLeadService = {
  async submit({ lead, result }: RadarLeadSubmission) {
    if (!supabaseUrl || !supabaseAnonKey) throw new RadarLeadIntegrationUnavailableError()

    const response = await fetch(`${supabaseUrl}/rest/v1/lead_radar`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: lead.name.trim(),
        email: lead.email.trim().toLowerCase(),
        city: lead.city.trim() || null,
        institution: lead.institution.trim() || null,
        teaching_profile: result.teachingProfile,
        overall_score: result.displayedOverallScore,
        score_band: result.band.id,
        dimension_scores: Object.fromEntries(
          result.dimensionScores.map(({ dimensionId, score }) => [dimensionId, Math.round(score)]),
        ),
        instrument_version: result.instrumentVersion,
        completion_time_seconds: result.completionTimeSeconds,
        marketing_consent: lead.marketingConsent,
        privacy_notice_acknowledged: true,
        source_page: '/radar/revisao',
        status: 'new',
      }),
    })

    if (!response.ok) throw new RadarLeadSubmissionError()
    return { submitted: true as const }
  },
}
