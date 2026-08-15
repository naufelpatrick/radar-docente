import type { WorkshopEdition, WorkshopRegistrationStatus } from '../types/workshopRegistration'

export const WORKSHOP_EDITION_SLUG = 'ia-pratica-docente-2026-08-29'

async function payload<T>(response: Response): Promise<T> {
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a solicitação.')
  return body
}

export async function loadWorkshopEdition() {
  const response = await fetch(`/api/workshops/edition?slug=${encodeURIComponent(WORKSHOP_EDITION_SLUG)}`)
  return (await payload<{ edition: WorkshopEdition }>(response)).edition
}

export async function startWorkshopCheckout(input: { nome: string; email: string; cpf: string; telefone: string }) {
  const response = await fetch('/api/workshops/checkout', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...input, workshopSlug: WORKSHOP_EDITION_SLUG }),
  })
  return payload<{ checkoutUrl: string; confirmationUrl: string }>(response)
}

export async function loadWorkshopRegistration(inscricao: string, token: string) {
  const params = new URLSearchParams({ inscricao, token })
  const response = await fetch(`/api/workshops/registration?${params}`)
  return (await payload<{ registration: WorkshopRegistrationStatus }>(response)).registration
}
