import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildShareUrl, getShareBaseUrl } from './shareTracking'

afterEach(() => vi.unstubAllGlobals())

describe('buildShareUrl', () => {
  it('preserva parâmetros úteis, substitui UTMs e evita duplicatas', () => {
    const result = new URL(buildShareUrl({
      url: 'https://www.radarpraxia.com/blog?categoria=etica&utm_source=antigo&utm_source=duplicado',
      source: 'linkedin',
      campaign: 'Article Share',
      content: 'artigo-com-ia',
    }))

    expect(result.searchParams.get('categoria')).toBe('etica')
    expect(result.searchParams.getAll('utm_source')).toEqual(['linkedin'])
    expect(result.searchParams.get('utm_medium')).toBe('share')
    expect(result.searchParams.get('utm_campaign')).toBe('article_share')
    expect(result.searchParams.get('utm_content')).toBe('artigo-com-ia')
  })

  it('remove identificadores temporários, diagnósticos e pessoais', () => {
    const result = new URL(buildShareUrl({
      url: 'https://www.radarpraxia.com/resultado?score=72&email=pessoa%40example.com&token=segredo&fbclid=abc&faixa=intermediaria',
      source: 'copylink',
      campaign: 'resultado_share',
      content: 'fluencia_intermediaria',
    }))

    expect(result.searchParams.has('score')).toBe(false)
    expect(result.searchParams.has('email')).toBe(false)
    expect(result.searchParams.has('token')).toBe(false)
    expect(result.searchParams.has('fbclid')).toBe(false)
    expect(result.searchParams.get('faixa')).toBe('intermediaria')
    expect(result.searchParams.get('utm_content')).toBe('fluencia_intermediaria')
  })
})

describe('getShareBaseUrl', () => {
  it('prioriza a URL canônica e remove rastreamento, dados sensíveis e hash', () => {
    const result = getShareBaseUrl({
      canonicalUrl: 'https://www.radarpraxia.com/metodologia?utm_source=sessao&token=segredo#secao',
    })

    expect(result).toBe('https://www.radarpraxia.com/metodologia')
  })

  it('usa origin e pathname do navegador sem carregar query ou hash', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://www.radarpraxia.com',
        pathname: '/workshops',
        href: 'https://www.radarpraxia.com/workshops?email=pessoa%40example.com#formulario',
      },
    })

    expect(getShareBaseUrl()).toBe('https://www.radarpraxia.com/workshops')
  })

  it('aceita um path explícito fora do navegador', () => {
    expect(getShareBaseUrl({ path: '/metodologia' })).toBe('https://www.radarpraxia.com/metodologia')
  })

  it('ignora uma canonical inválida e usa o path explícito', () => {
    expect(getShareBaseUrl({ canonicalUrl: 'javascript:alert(1)', path: '/radar-docente' }))
      .toBe('https://www.radarpraxia.com/radar-docente')
  })
})
