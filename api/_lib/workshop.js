import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { SITE_URL, supabase } from './ebook.js'

export const WORKSHOP_SLUG = 'ia-pratica-docente-2026-08-29'
export const WORKSHOP_RETURN_PATH = '/lp/workshop-ia-2026/inscricoes/confirmacao'
export const WORKSHOP_PUBLIC_URL = 'https://www.radarpraxia.com'

export const cleanText = (value, max = 180) => String(value || '').trim().replace(/\s+/g, ' ').slice(0, max)
export const cleanEmail = (value) => cleanText(value, 254).toLowerCase()
export const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const digits = (value) => String(value || '').replace(/\D/g, '')
export const accessHash = (token) => createHash('sha256').update(token).digest('hex')
export const createRegistrationIdentity = () => ({ id: randomUUID(), token: randomBytes(32).toString('hex') })

export function validCpf(value) {
  const cpf = digits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const calculate = (length) => {
    let sum = 0
    for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index)
    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }
  return calculate(9) === Number(cpf[9]) && calculate(10) === Number(cpf[10])
}

export async function getEdition(slug = WORKSHOP_SLUG, { includePrivate = false } = {}) {
  const publicFields = 'id,slug,titulo,descricao,inicio_em,fim_em,timezone,valor,carga_horaria,status,limite_vagas'
  const privateFields = `${publicFields},meeting_url,telefone_alternativo,meeting_pin`
  const result = await supabase(`/rest/v1/workshop_editions?slug=eq.${encodeURIComponent(slug)}&select=${includePrivate ? privateFields : publicFields}&limit=1`)
  if (!result.ok) throw new Error(`Unable to read workshop edition: ${result.status}`)
  const [edition] = await result.json()
  return edition || null
}

export async function getRegistration(id, token, { includePrivate = false } = {}) {
  if (!/^[0-9a-f-]{36}$/i.test(String(id || '')) || !/^[a-f0-9]{64}$/.test(String(token || ''))) return null
  const fields = includePrivate
    ? 'id,nome,email,status_pagamento,valor,data_pagamento,workshop_id,access_token_secret,workshop_editions(*)'
    : 'id,nome,status_pagamento,valor,data_pagamento,workshop_id,workshop_editions(id,slug,titulo,inicio_em,fim_em,timezone,carga_horaria)'
  const result = await supabase(`/rest/v1/workshop_registrations?id=eq.${encodeURIComponent(id)}&access_token_hash=eq.${accessHash(token)}&select=${fields}&limit=1`)
  if (!result.ok) throw new Error(`Unable to read workshop registration: ${result.status}`)
  const [registration] = await result.json()
  return registration || null
}

export function registrationUrl(registration) {
  return `${WORKSHOP_PUBLIC_URL}${WORKSHOP_RETURN_PATH}?inscricao=${encodeURIComponent(registration.id)}&token=${encodeURIComponent(registration.access_token_secret)}`
}

export function checkoutReturnUrl(id, token) {
  return `${WORKSHOP_PUBLIC_URL}${WORKSHOP_RETURN_PATH}?inscricao=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
}

export function autoRedirectInvoiceUrl(invoiceUrl) {
  const url = new URL(invoiceUrl)
  url.searchParams.set('autoRedirect', 'true')
  return url.toString()
}

function utcStamp(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export function googleCalendarUrl(edition) {
  const description = `${edition.descricao}\n\nAcesso: ${edition.meeting_url}\nTelefone alternativo: ${edition.telefone_alternativo || 'não informado'}\nPIN: ${edition.meeting_pin || 'não informado'}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: edition.titulo,
    dates: `${utcStamp(edition.inicio_em)}/${utcStamp(edition.fim_em)}`,
    details: description,
    location: edition.meeting_url,
    ctz: edition.timezone,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

const escapeIcs = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export function createIcs(edition) {
  const description = `${edition.descricao}\nAcesso: ${edition.meeting_url}\nTelefone alternativo: ${edition.telefone_alternativo || 'não informado'}\nPIN: ${edition.meeting_pin || 'não informado'}`
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PraxIA//Workshop//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', `UID:${edition.id}@radarpraxia.com`, `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(edition.inicio_em)}`, `DTEND:${utcStamp(edition.fim_em)}`,
    `SUMMARY:${escapeIcs(edition.titulo)}`, `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(edition.meeting_url)}`, `URL:${escapeIcs(edition.meeting_url)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n')
}

export async function sendConfirmationEmail(registration) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing server configuration: RESEND_API_KEY')
  const edition = registration.workshop_editions
  const confirmationUrl = registrationUrl(registration)
  const calendarUrl = googleCalendarUrl(edition)
  const icsUrl = `${SITE_URL}/api/workshops/calendar?inscricao=${encodeURIComponent(registration.id)}&token=${encodeURIComponent(registration.access_token_secret)}`
  const date = new Intl.DateTimeFormat('pt-BR', { timeZone: edition.timezone, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(edition.inicio_em))
  const time = new Intl.DateTimeFormat('pt-BR', { timeZone: edition.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date(edition.inicio_em))
  const endTime = new Intl.DateTimeFormat('pt-BR', { timeZone: edition.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date(edition.fim_em))
  const html = `<!doctype html><html><body style="margin:0;background:#f2f3f8;font-family:Arial,sans-serif;color:#141b27"><div style="max-width:640px;margin:32px auto;background:#fff;border-radius:14px;overflow:hidden"><div style="padding:28px 34px;background:#141b27;color:#fff"><strong style="font-size:22px">PraxIA</strong></div><div style="padding:34px"><p>Olá, <strong>${escapeHtml(registration.nome)}</strong>!</p><h1 style="font-size:28px">Pagamento confirmado e sua vaga está garantida! 🎉</h1><p>Você está inscrito(a) no <strong>${escapeHtml(edition.titulo)}</strong>.</p><p><strong>Data:</strong> ${escapeHtml(date)}<br><strong>Horário:</strong> das ${escapeHtml(time)} às ${escapeHtml(endTime)}<br><strong>Fuso horário:</strong> Brasília — ${escapeHtml(edition.timezone)}<br><strong>Formato:</strong> Online, via Google Meet<br><strong>Certificado:</strong> após participação confirmada.</p><h2>Acesso ao workshop</h2><p><a href="${escapeHtml(edition.meeting_url)}" style="display:inline-block;padding:14px 20px;border-radius:8px;background:#5142e8;color:#fff;text-decoration:none;font-weight:bold">ENTRAR NO WORKSHOP</a></p><p><a href="${escapeHtml(calendarUrl)}">ADICIONAR AO GOOGLE CALENDAR</a><br><a href="${escapeHtml(icsUrl)}">ADICIONAR À AGENDA (.ICS)</a></p><p>Recomendamos guardar este e-mail. Você também pode consultar sua confirmação em <a href="${escapeHtml(confirmationUrl)}">Acompanhar inscrição</a>.</p><p>Estaremos esperando você em ${escapeHtml(date)}, a partir das ${escapeHtml(time)}.</p><p>Até lá!<br><strong>Equipe PraxIA</strong><br>Fluência Digital + IA para a prática docente</p></div></div></body></html>`
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.WORKSHOP_EMAIL_FROM || 'PraxIA <praxia@radarpraxia.com.br>',
      to: [registration.email],
      subject: 'Inscrição confirmada | Workshop IA para Prática Docente',
      html,
    }),
  })
  if (!result.ok) throw new Error(`Unable to send workshop confirmation email: ${result.status}`)
}
