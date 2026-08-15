import { randomBytes } from 'node:crypto'
import { audit, requireSession } from './_lib/cms.js'
import { json, readJson, supabase } from './_lib/ebook.js'

const CODE_PATTERN = /^PRAXIA-[A-Z0-9_-]{24,}$/
const cleanName = (value) => String(value || '').trim().replace(/\s+/g, ' ')
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))
const code = () => `PRAXIA-${randomBytes(24).toString('base64url').toUpperCase()}`
const fields = 'id,nome_participante,codigo_validacao,workshop_slug,workshop_titulo,carga_horaria,data_realizacao,data_emissao,status,created_at'

async function validate(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido' })
  const codigo = String(request.query?.codigo || '').trim().toUpperCase()
  if (!CODE_PATTERN.test(codigo)) return json(response, 404, { certificate: null })
  try {
    const result = await supabase('/rest/v1/rpc/validar_certificado', { method: 'POST', body: JSON.stringify({ p_codigo_validacao: codigo }) })
    if (!result.ok) throw new Error('Falha ao validar o certificado')
    const rows = await result.json()
    return json(response, 200, { certificate: rows[0] || null })
  } catch { return json(response, 503, { error: 'A validação está temporariamente indisponível.' }) }
}

async function list(response) {
  const result = await supabase(`/rest/v1/certificados?select=${fields}&order=created_at.desc`)
  if (!result.ok) throw new Error('Não foi possível listar os certificados')
  return json(response, 200, { certificates: await result.json() })
}

async function issue(request, response, session) {
  const body = await readJson(request); const nome = cleanName(body.nome_participante)
  if (nome.length < 3 || nome.length > 160) return json(response, 400, { error: 'Informe o nome completo do participante.' })
  if (!validDate(body.data_realizacao)) return json(response, 400, { error: 'Informe uma data de realização válida.' })
  if (body.data_realizacao > new Date().toISOString().slice(0, 10)) return json(response, 400, { error: 'A data de realização não pode estar no futuro.' })
  const result = await supabase(`/rest/v1/certificados?select=${fields}`, { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify({ nome_participante: nome, data_realizacao: body.data_realizacao, codigo_validacao: code() }) })
  if (!result.ok) throw new Error('Não foi possível emitir o certificado')
  const [certificate] = await result.json()
  await audit('certificate_issued', session.userId, 'certificate', certificate.id, { codigo_validacao: certificate.codigo_validacao })
  return json(response, 201, { certificate })
}

async function revoke(request, response, session) {
  const body = await readJson(request)
  if (!/^[0-9a-f-]{36}$/i.test(String(body.id || ''))) return json(response, 400, { error: 'Certificado inválido.' })
  const result = await supabase(`/rest/v1/certificados?id=eq.${encodeURIComponent(body.id)}&status=eq.emitido&select=id,codigo_validacao`, { method: 'PATCH', headers: { prefer: 'return=representation' }, body: JSON.stringify({ status: 'revogado' }) })
  if (!result.ok) throw new Error('Não foi possível revogar o certificado')
  const [certificate] = await result.json()
  if (!certificate) return json(response, 404, { error: 'Certificado não localizado ou já revogado.' })
  await audit('certificate_revoked', session.userId, 'certificate', certificate.id, { codigo_validacao: certificate.codigo_validacao })
  return json(response, 200, { ok: true })
}

async function admin(request, response) {
  try {
    const session = await requireSession(request, response, { csrf: request.method !== 'GET', roles: ['admin'] })
    if (!session) return
    if (request.method === 'GET') return list(response)
    if (request.method === 'POST') return issue(request, response, session)
    if (request.method === 'PATCH') return revoke(request, response, session)
    return json(response, 405, { error: 'Método não permitido' })
  } catch (error) { return json(response, 500, { error: error instanceof Error ? error.message : 'Erro inesperado' }) }
}

export default function handler(request, response) {
  return request.query?.scope === 'admin' ? admin(request, response) : validate(request, response)
}
