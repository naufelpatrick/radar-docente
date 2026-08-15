import { describe, expect, it } from 'vitest'
import { cmsHeadings, cmsSlugify } from './cmsContent'

describe('conteúdo editorial no cliente', () => {
  it('gera slugs compatíveis com a arquitetura do blog', () => {
    expect(cmsSlugify('Como usar IA?')).toBe('como-usar-ia')
  })

  it('gera índice somente com H2 e H3', () => {
    expect(cmsHeadings({ type: 'doc', content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Título' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Primeira seção' }] },
    ] })).toEqual([{ id: 'primeira-secao', label: 'Primeira seção', level: 2 }])
  })
})
