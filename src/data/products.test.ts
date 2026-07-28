import { describe, expect, it } from 'vitest'
import { calculateScore } from '../services/scoringService'
import { instrument } from './instrument'
import { getRecommendedProduct, institutionalProducts, OFFICIAL_EBOOK_NAME, products, teacherProducts } from './products'

describe('ecossistema comercial PráxIA', () => {
  it('usa o nome oficial do e-book', () => {
    expect(OFFICIAL_EBOOK_NAME).toBe('IA na Prática Docente')
    expect(products.find(({ id }) => id === 'ebook')?.name).toBe(OFFICIAL_EBOOK_NAME)
  })

  it('separa os produtos pelos públicos corretos', () => {
    expect(teacherProducts.map(({ id }) => id)).toEqual(['ebook', 'mentoring'])
    expect(institutionalProducts.map(({ id }) => id)).toEqual(['workshop', 'talk'])
  })

  it.each([
    ['initiation', 'ebook'],
    ['exploration', 'ebook'],
    ['integration', 'mentoring'],
    ['transformation', 'mentoring'],
  ] as const)('recomenda %s sem ambiguidade', (band, product) => {
    expect(getRecommendedProduct(band)?.id).toBe(product)
  })

  it('não modifica o score ao obter uma recomendação comercial', () => {
    const answers = Object.fromEntries(instrument.map(({ id }) => [id, 4]))
    const before = calculateScore(answers, 'higher_postgraduate').displayedOverallScore
    getRecommendedProduct('integration')
    const after = calculateScore(answers, 'higher_postgraduate').displayedOverallScore
    expect(after).toBe(before)
  })

  it('mantém links comerciais e âncoras institucionais válidos', () => {
    expect(products.find(({ id }) => id === 'ebook')?.href).toBe('/ebook')
    expect(products.find(({ id }) => id === 'mentoring')?.href).toBe('/mentoria')
    expect(products.find(({ id }) => id === 'workshop')?.href).toContain('/para-instituicoes#')
  })
})
