import { describe, expect, it } from 'vitest'
import { dimensions, instrument, INSTRUMENT_VERSION } from './instrument'

describe('instrumento beta 0.1', () => {
  it('contém exatamente 30 itens ordenados e obrigatórios', () => {
    expect(instrument).toHaveLength(30)
    expect(instrument.map(({ order }) => order)).toEqual(Array.from({ length: 30 }, (_, index) => index + 1))
    expect(instrument.every(({ required, instrumentVersion }) => required && instrumentVersion === INSTRUMENT_VERSION)).toBe(true)
  })

  it('contém quatro itens comportamentais e um situacional por dimensão', () => {
    for (const dimension of dimensions) {
      const items = instrument.filter(({ dimensionId }) => dimensionId === dimension.id)
      expect(items).toHaveLength(5)
      expect(items.filter(({ type }) => type === 'behavioral')).toHaveLength(4)
      expect(items.filter(({ type }) => type === 'situational')).toHaveLength(1)
    }
  })

  it('mantém cinco alternativas válidas em todos os itens', () => {
    for (const item of instrument) {
      expect(item.options).toHaveLength(5)
      expect(item.options.map(({ value }) => value)).toEqual([1, 2, 3, 4, 5])
    }
  })

  it('preserva os códigos oficiais PC1–EA5', () => {
    expect(instrument.map(({ id }) => id)).toEqual([
      'PC1', 'PC2', 'PC3', 'PC4', 'PC5',
      'CE1', 'CE2', 'CE3', 'CE4', 'CE5',
      'MC1', 'MC2', 'MC3', 'MC4', 'MC5',
      'AF1', 'AF2', 'AF3', 'AF4', 'AF5',
      'IA1', 'IA2', 'IA3', 'IA4', 'IA5',
      'EA1', 'EA2', 'EA3', 'EA4', 'EA5',
    ])
  })
})
