import { describe, expect, it } from 'vitest'
import { team } from './team'

describe('equipe PráxIA', () => {
  it('apresenta Patrick Naufel e Giovani Letti com a mesma estrutura', () => {
    expect(team.map(({ name }) => name)).toEqual(['Patrick Naufel', 'Giovani Letti'])
    expect(team.every(({ role, photo }) => role === null && photo?.src.startsWith('/team/'))).toBe(true)
  })

  it('mantém os links profissionais documentados de Giovani', () => {
    const giovani = team.find(({ id }) => id === 'giovani-letti')
    expect(giovani?.links).toEqual([
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/giovani-letti-1332a1/', type: 'linkedin' },
      { label: 'Currículo Lattes', href: 'http://lattes.cnpq.br/2124565480075229', type: 'lattes' },
    ])
  })

  it('preserva a ordem explícita de exibição', () => {
    expect(team.map(({ displayOrder }) => displayOrder)).toEqual([1, 2])
  })
})
