import type { Certificate } from '../types/certificate'

let csrfToken = typeof sessionStorage === 'undefined' ? '' : sessionStorage.getItem('praxia_cms_csrf') || ''

async function parse<T>(response: Response): Promise<T> {
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a ação')
  return result
}

async function refreshCsrf() {
  const response = await fetch('/api/cms/auth', { credentials: 'same-origin', cache: 'no-store' })
  const session = await parse<{ csrfToken?: string }>(response)
  csrfToken = session.csrfToken || ''
  sessionStorage.setItem('praxia_cms_csrf', csrfToken)
}

export async function validateCertificate(codigo: string) {
  return parse<{ certificate: Certificate | null }>(await fetch(`/api/certificates/${encodeURIComponent(codigo)}`, { cache: 'no-store' }))
}

export async function listCertificates() {
  if (!csrfToken) await refreshCsrf()
  return parse<{ certificates: Certificate[] }>(await fetch('/api/admin/certificates', { credentials: 'same-origin', cache: 'no-store' }))
}

async function adminMutation<T>(method: 'POST' | 'PATCH', body: Record<string, unknown>) {
  if (!csrfToken) await refreshCsrf()
  const send = () => fetch('/api/admin/certificates', {
    method, credentials: 'same-origin', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify(body),
  })
  let response = await send()
  if (response.status === 401) { await refreshCsrf(); response = await send() }
  return parse<T>(response)
}

export const issueCertificate = (nome_participante: string, data_realizacao: string) =>
  adminMutation<{ certificate: Certificate }>('POST', { nome_participante, data_realizacao })

export const revokeCertificate = (id: string) => adminMutation<{ ok: true }>('PATCH', { id })
