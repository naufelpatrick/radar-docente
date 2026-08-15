import { randomBytes, timingSafeEqual } from 'node:crypto'
import { audit, clearSessionCookie, clientFingerprint, getSession, hashPassword, hashToken, SESSION_TTL_MS, sessionCookie, verifyPassword } from '../_lib/cms.js'
import { json, readJson, supabase } from '../_lib/ebook.js'

async function login(request, response) {
  const body = await readJson(request)
  const username = (body.username || '').trim().toLowerCase()
  const fingerprint = clientFingerprint(request)
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const attemptsResponse = await supabase(`/rest/v1/cms_login_attempts?username=eq.${encodeURIComponent(username)}&ip_hash=eq.${fingerprint}&succeeded=eq.false&created_at=gte.${encodeURIComponent(cutoff)}&select=id`)
  const attempts = attemptsResponse.ok ? await attemptsResponse.json() : []
  if (attempts.length >= 5) {
    await audit('login_failure', null, 'session', null, { username, reason: 'rate_limited' })
    return json(response, 429, { error: 'Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.' })
  }
  const accountResponse = await supabase(`/rest/v1/cms_profiles?username=eq.${encodeURIComponent(username)}&select=id,username,display_name,role,is_active,cms_credentials(password_hash,password_salt)&limit=1`)
  const [profile] = accountResponse.ok ? await accountResponse.json() : []
  const credential = profile?.cms_credentials?.[0] || profile?.cms_credentials
  const valid = profile?.is_active && credential && await verifyPassword(body.password || '', credential.password_salt, credential.password_hash)
  await supabase('/rest/v1/cms_login_attempts', { method: 'POST', headers: { prefer: 'return=minimal' }, body: JSON.stringify({ username, ip_hash: fingerprint, succeeded: Boolean(valid) }) })
  if (!valid) {
    await audit('login_failure', profile?.id || null, 'session', null, { username, reason: profile && !profile.is_active ? 'inactive' : 'invalid_credentials' })
    return json(response, 401, { error: 'Usuário ou senha inválidos.' })
  }
  const token = randomBytes(32).toString('hex')
  const csrfToken = randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  const sessionResponse = await supabase('/rest/v1/cms_sessions', {
    method: 'POST', headers: { prefer: 'return=minimal' },
    body: JSON.stringify({ user_id: profile.id, token_hash: hashToken(token), csrf_token_hash: hashToken(csrfToken), expires_at: expiresAt.toISOString(), user_agent: (request.headers['user-agent'] || '').slice(0, 500), ip_hash: fingerprint }),
  })
  if (!sessionResponse.ok) throw new Error('Não foi possível criar a sessão')
  await supabase(`/rest/v1/cms_profiles?id=eq.${profile.id}`, { method: 'PATCH', headers: { prefer: 'return=minimal' }, body: JSON.stringify({ last_login_at: new Date().toISOString() }) })
  response.setHeader('set-cookie', sessionCookie(token, expiresAt))
  await audit('login_success', profile.id, 'session')
  return json(response, 200, { user: { id: profile.id, username: profile.username, display_name: profile.display_name, role: profile.role }, csrfToken, expiresAt: expiresAt.toISOString() })
}

async function setup(request, response) {
  const expected = process.env.CMS_SETUP_SECRET || ''; const received = (request.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const first = Buffer.from(expected); const second = Buffer.from(received)
  if (!first.length || first.length !== second.length || !timingSafeEqual(first, second)) return json(response, 401, { error: 'Acesso não autorizado' })
  const body = await readJson(request)
  const allowed = new Map([['patrick.naufel', { display_name: 'Patrick Naufel', role: 'admin' }], ['giovani.letti', { display_name: 'Giovanni Letti', role: 'editor' }]])
  const account = allowed.get((body.username || '').toLowerCase())
  if (!account) return json(response, 400, { error: 'Usuário inicial inválido' })
  const password = await hashPassword(body.password)
  const profileResponse = await supabase('/rest/v1/cms_profiles?on_conflict=username', { method: 'POST', headers: { prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ username: body.username.toLowerCase(), ...account, is_active: true }) })
  if (!profileResponse.ok) throw new Error(await profileResponse.text())
  const [profile] = await profileResponse.json()
  const credentialResponse = await supabase('/rest/v1/cms_credentials?on_conflict=user_id', { method: 'POST', headers: { prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ user_id: profile.id, password_hash: password.hash, password_salt: password.salt, updated_at: new Date().toISOString() }) })
  if (!credentialResponse.ok) throw new Error(await credentialResponse.text())
  await audit('account_initialized', profile.id, 'profile', profile.id)
  return json(response, 200, { ok: true, username: profile.username, display_name: profile.display_name, role: profile.role })
}

export default async function handler(request, response) {
  try {
    if (request.query?.action === 'setup' && request.method === 'POST') return setup(request, response)
    if (request.method === 'POST') return login(request, response)
    if (request.method === 'DELETE') {
      const session = await getSession(request, { csrf: true })
      if (session) {
        await supabase(`/rest/v1/cms_sessions?id=eq.${session.id}`, { method: 'DELETE' })
        await audit('logout', session.userId, 'session')
      }
      response.setHeader('set-cookie', clearSessionCookie())
      return json(response, 200, { ok: true })
    }
    if (request.method === 'GET') {
      const session = await getSession(request)
      if (!session) return json(response, 401, { error: 'Sua sessão expirou. Entre novamente.' })
      const csrfToken = randomBytes(24).toString('hex')
      await supabase(`/rest/v1/cms_sessions?id=eq.${session.id}`, { method: 'PATCH', headers: { prefer: 'return=minimal' }, body: JSON.stringify({ csrf_token_hash: hashToken(csrfToken), last_seen_at: new Date().toISOString() }) })
      return json(response, 200, { user: session.user, expiresAt: session.expiresAt, csrfToken })
    }
    return json(response, 405, { error: 'Método não permitido' })
  } catch (error) {
    return json(response, 500, { error: error instanceof Error ? error.message : 'Erro inesperado' })
  }
}
