import type { CmsArticle, CmsCategory, CmsUser } from '../types/cms'

type CmsSession = { user: CmsUser; csrfToken?: string; expiresAt?: string }
let csrfToken = typeof sessionStorage === 'undefined' ? '' : sessionStorage.getItem('praxia_cms_csrf') || ''
let sessionRefresh: Promise<CmsSession> | null = null

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...options,
    headers: { 'content-type': 'application/json', ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}), ...(options.headers || {}) },
  })
  const raw = await response.text()
  let result: { error?: string } & Record<string, unknown>
  try { result = raw ? JSON.parse(raw) : {} } catch { result = { error: response.ok ? 'Resposta inesperada do servidor.' : 'O servidor não conseguiu concluir a solicitação.' } }
  if (response.status === 401) { csrfToken = ''; sessionStorage.removeItem('praxia_cms_csrf') }
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a ação')
  return result as T
}

export async function login(username: string, password: string) {
  const session = await request<CmsSession>('/api/cms/auth', { method: 'POST', body: JSON.stringify({ username, password }) })
  csrfToken = session.csrfToken || ''
  sessionStorage.setItem('praxia_cms_csrf', csrfToken)
  return session
}

export async function currentSession() {
  if (!sessionRefresh) sessionRefresh = request<CmsSession>('/api/cms/auth').then((session) => {
    if (session.csrfToken) { csrfToken = session.csrfToken; sessionStorage.setItem('praxia_cms_csrf', csrfToken) }
    return session
  }).finally(() => { sessionRefresh = null })
  return sessionRefresh
}
export async function logout() {
  await request('/api/cms/auth', { method: 'DELETE' })
  csrfToken = ''
  sessionStorage.removeItem('praxia_cms_csrf')
}

export type CmsPayload = { article?: CmsArticle; articles?: CmsArticle[]; categories: CmsCategory[]; profiles: CmsUser[]; settings: Record<string, unknown>; user: CmsUser }
export async function loadCms(id?: string) {
  if (!csrfToken) await currentSession()
  return request<CmsPayload>(`/api/cms/articles${id ? `?id=${encodeURIComponent(id)}` : ''}`)
}
export async function cmsAction<T>(body: Record<string, unknown>) {
  const options = { method: 'POST', body: JSON.stringify(body) }
  try { return await request<T>('/api/cms/articles', options) } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('sessão')) throw error
    await currentSession()
    return request<T>('/api/cms/articles', options)
  }
}
export async function imageAction(id: string, action: string, extra: Record<string, unknown> = {}) { return request<{ article: CmsArticle }>('/api/cms/image', { method: 'POST', body: JSON.stringify({ id, action, ...extra }) }) }
export async function loadPublicArticles() { return request<{ articles: CmsArticle[] }>('/api/cms/public') }
export async function loadPublicArticle(category: string, slug: string) { return request<{ article: CmsArticle }>(`/api/cms/public?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`) }
export async function loadPreviewArticle(id: string) { return request<{ article: CmsArticle; preview: true }>(`/api/cms/public?preview=1&id=${encodeURIComponent(id)}`) }
