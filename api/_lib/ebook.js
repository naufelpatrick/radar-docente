import { createHash, randomBytes, randomUUID } from 'node:crypto'

export const EBOOK_PRICE = 19.9
export const EBOOK_FILE = 'ebooks/ia-na-pratica-docente-edicao-01.pdf'
export const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://radar-docente-pi.vercel.app'

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing server configuration: ${name}`)
  return value
}

export function accessHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function createOrderIdentity() {
  return { id: randomUUID(), token: randomBytes(32).toString('hex') }
}

export async function supabase(path, options = {}) {
  const url = required('SUPABASE_URL')
  const key = required('SUPABASE_SERVICE_ROLE_KEY')
  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  })
}

export async function getOrder(id, token) {
  if (!id || !token) return null
  const response = await supabase(
    `/rest/v1/ebook_orders?id=eq.${encodeURIComponent(id)}&access_token_hash=eq.${accessHash(token)}&select=id,status,checkout_id,created_at&limit=1`,
  )
  if (!response.ok) throw new Error('Unable to read order')
  const [order] = await response.json()
  return order || null
}

export function json(response, status, body) {
  response.status(status).setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('cache-control', 'no-store')
  response.end(JSON.stringify(body))
}

export async function readJson(request) {
  if (request.body && typeof request.body === 'object') return request.body
  let raw = ''
  for await (const chunk of request) raw += chunk
  return raw ? JSON.parse(raw) : {}
}
