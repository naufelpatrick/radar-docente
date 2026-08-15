import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import authHandler from '../cms/auth.js'
import { extractHeadings, hashPassword, normalizeArticlePayload, plainTextFromDoc, prepareArticle, renderContentJson, sessionCookie, slugify, standardizeArticleStructure, validateMutationOrigin } from './cms.js'

function responseMock() {
  return { code: 200, headers: {}, body: '', status(code) { this.code = code; return this }, setHeader(name, value) { this.headers[name] = value; return this }, end(value = '') { this.body = value; return this } }
}
function fetchResult(data, ok = true) { return { ok, status: ok ? 200 : 400, json: async () => data, text: async () => JSON.stringify(data) } }
const session = { userId: '11111111-1111-4111-8111-111111111111', user: { role: 'admin' } }
beforeEach(() => { process.env.SUPABASE_URL = 'https://example.supabase.co'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key' })

describe('núcleo seguro do CMS', () => {
  afterEach(() => vi.restoreAllMocks())

  it('gera slug estável, sem acentos ou hífens duplicados', () => {
    expect(slugify(' Privacidade, Ética & IA — Educação! ')).toBe('privacidade-etica-ia-educacao')
  })

  it('armazena senha com scrypt, salt e hash não reversível', async () => {
    const first = await hashPassword('uma-senha-segura-123')
    const second = await hashPassword('uma-senha-segura-123')
    expect(first.hash).not.toBe('uma-senha-segura-123')
    expect(first.hash).not.toBe(second.hash)
    expect(first.salt).not.toBe(second.salt)
  })

  it('produz cookie HttpOnly, SameSite e com expiração', () => {
    const cookie = sessionCookie('secret', new Date('2026-08-03T00:00:00Z'))
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Strict')
    expect(cookie).toContain('Expires=')
  })

  it('aceita mutações nos domínios públicos da PráxIA e recusa origens externas', () => {
    expect(validateMutationOrigin({ headers: { origin: 'https://www.radarpraxia.com' } })).toBe(true)
    expect(validateMutationOrigin({ headers: { origin: 'https://radarpraxia.com' } })).toBe(true)
    expect(validateMutationOrigin({ headers: { origin: 'https://site-malicioso.example' } })).toBe(false)
  })

  it('sanitiza o conteúdo, remove anotação da capa e não aceita H1', () => {
    const content = { doc: { type: 'doc', content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'H1 indevido' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '[IMAGEM DE CAPA — inserir ilustração horizontal]' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '<script>alert(1)</script>' }] },
    ] } }
    const html = renderContentJson(content)
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('IMAGEM DE CAPA')
    expect(html).not.toContain('<script>')
  })

  it('extrai índice navegável com IDs únicos', () => {
    const content = { doc: { type: 'doc', content: [
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Dados e segurança' }] },
      { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Dados e segurança' }] },
    ] } }
    expect(extractHeadings(content)).toEqual([{ id: 'dados-e-seguranca', label: 'Dados e segurança', level: 2 }, { id: 'dados-e-seguranca-2', label: 'Dados e segurança', level: 3 }])
  })

  it('padroniza estrutura explícita sem reescrever o texto', () => {
    const source = { doc: { type: 'doc', content: [
      { type: 'paragraph', content: [{ type: 'text', text: '## Critérios pedagógicos' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '- Objetivo de aprendizagem' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '- Evidência esperada' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '> A tecnologia é um recurso.' }] },
    ] } }
    const result = standardizeArticleStructure(source)
    expect(result.doc.content.map((node) => node.type)).toEqual(['heading', 'bulletList', 'blockquote'])
    expect(plainTextFromDoc(result.doc)).toContain('Critérios pedagógicos')
    expect(plainTextFromDoc(result.doc)).toContain('A tecnologia é um recurso.')
    expect(result.changes).toHaveLength(3)
  })

  it('prepara SEO, categoria e FAQ sem publicar', () => {
    const result = prepareArticle({ title: 'Privacidade e dados na escola', content_text: 'Este artigo explica como proteger dados de estudantes em ferramentas digitais.\nQuais dados posso enviar?\nUse apenas informações autorizadas e minimizadas.', categories: [{ id: 'ethics', slug: 'etica' }] })
    expect(result.category_slug).toBe('etica')
    expect(result.meta_title).toContain('| PráxIA')
    expect(result.faq_json).toHaveLength(1)
    expect(result).not.toHaveProperty('status')
  })

  it('normaliza artigo estruturado e preserva autoria por UUID', () => {
    const result = normalizeArticlePayload({ title: 'Teste', category_slug: 'etica', content_json: { doc: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Conteúdo seguro e estruturado.' }] }] } } }, session)
    expect(result.author_id).toBe(session.userId)
    expect(result.content_html).toContain('<p>')
    expect(result.canonical_url).toContain('/blog/etica/teste')
  })
})

describe('login do CMS', () => {
  afterEach(() => vi.restoreAllMocks())

  it('aceita credenciais válidas e cria sessão protegida', async () => {
    const password = await hashPassword('uma-senha-segura-123')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(fetchResult([]))
      .mockResolvedValueOnce(fetchResult([{ id: session.userId, username: 'patrick.naufel', display_name: 'Patrick Naufel', role: 'admin', is_active: true, cms_credentials: [{ password_hash: password.hash, password_salt: password.salt }] }]))
      .mockResolvedValue(fetchResult([]))
    const response = responseMock()
    await authHandler({ method: 'POST', body: { username: 'patrick.naufel', password: 'uma-senha-segura-123' }, headers: {}, socket: {} }, response)
    expect(response.code).toBe(200)
    expect(response.headers['set-cookie']).toContain('HttpOnly')
    expect(fetchMock).toHaveBeenCalled()
  })

  it('recusa login inválido sem criar sessão', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(fetchResult([])).mockResolvedValueOnce(fetchResult([])).mockResolvedValue(fetchResult([]))
    const response = responseMock()
    await authHandler({ method: 'POST', body: { username: 'patrick.naufel', password: 'incorreta' }, headers: {}, socket: {} }, response)
    expect(response.code).toBe(401)
    expect(JSON.parse(response.body).error).toContain('inválidos')
    expect(response.headers['set-cookie']).toBeUndefined()
  })

  it('bloqueia novas tentativas depois do limite', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(fetchResult(Array.from({ length: 5 }, (_, id) => ({ id })))).mockResolvedValue(fetchResult([]))
    const response = responseMock()
    await authHandler({ method: 'POST', body: { username: 'patrick.naufel', password: 'incorreta' }, headers: {}, socket: {} }, response)
    expect(response.code).toBe(429)
  })

  it('nega acesso sem cookie de sessão', async () => {
    const response = responseMock()
    await authHandler({ method: 'GET', headers: {} }, response)
    expect(response.code).toBe(401)
  })
})
