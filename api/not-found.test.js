import { describe, expect, it } from 'vitest'
import handler from './not-found.js'

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) { this.statusCode = code; return this },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this },
    end(body = '') { this.body = body; return this },
  }
}

describe('página 404', () => {
  it('retorna status HTTP real e impede indexação', () => {
    const result = response()
    handler({}, result)
    expect(result.statusCode).toBe(404)
    expect(result.headers['x-robots-tag']).toBe('noindex, follow')
    expect(result.body).toContain('<meta name="robots" content="noindex, follow">')
    expect(result.body).toContain('<h1>Página não encontrada</h1>')
  })
})
