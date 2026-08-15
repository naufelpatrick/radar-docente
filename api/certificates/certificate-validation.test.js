import { afterEach, describe, expect, it, vi } from 'vitest'
import handler from '../certificates.js'

function response() {
  return { statusCode: 0, status(code) { this.statusCode = code; return this }, setHeader() { return this }, end(body) { this.body = JSON.parse(body) } }
}

const valid = { nome_participante: 'Ana Silva', workshop_titulo: 'IA na Prática Docente', carga_horaria: 4, data_realizacao: '2026-08-08', data_emissao: '2026-08-08T15:00:00Z', codigo_validacao: `PRAXIA-${'A'.repeat(32)}`, status: 'emitido' }

describe('public certificate validation', () => {
  afterEach(() => { vi.unstubAllGlobals(); delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY })
  function mock(rows) { process.env.SUPABASE_URL = 'https://project.supabase.co'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-only'; vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(rows), { status: 200 }))) }

  it('returns the allowlisted fields for a valid certificate', async () => { mock([valid]); const res = response(); await handler({ method: 'GET', query: { codigo: valid.codigo_validacao } }, res); expect(res.statusCode).toBe(200); expect(res.body.certificate).toEqual(valid); expect(res.body.certificate.email).toBeUndefined() })
  it('returns null for an unknown code', async () => { mock([]); const res = response(); await handler({ method: 'GET', query: { codigo: `PRAXIA-${'B'.repeat(32)}` } }, res); expect(res.statusCode).toBe(200); expect(res.body.certificate).toBeNull() })
  it('returns a revoked certificate as not valid', async () => { mock([{ ...valid, status: 'revogado' }]); const res = response(); await handler({ method: 'GET', query: { codigo: valid.codigo_validacao } }, res); expect(res.statusCode).toBe(200); expect(res.body.certificate.status).toBe('revogado') })
  it('rejects malformed codes without querying the database', async () => { const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock); const res = response(); await handler({ method: 'GET', query: { codigo: '123' } }, res); expect(res.statusCode).toBe(404); expect(fetchMock).not.toHaveBeenCalled() })
})
