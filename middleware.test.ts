import { describe, expect, it } from 'vitest'
import middleware from './middleware'

describe('redirecionamento do host legado', () => {
  it('preserva caminho e parâmetros em um redirecionamento 308', () => {
    const response = middleware(new Request('https://radar-docente-pi.vercel.app/blog/artigo?utm_source=instagram'))

    expect(response?.status).toBe(308)
    expect(response?.headers.get('location')).toBe('https://www.radarpraxia.com/blog/artigo?utm_source=instagram')
  })

  it('não interfere no domínio canônico', () => {
    expect(middleware(new Request('https://www.radarpraxia.com/blog'))).toBeUndefined()
  })
})
