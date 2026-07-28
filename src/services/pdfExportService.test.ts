import { describe, expect, it } from 'vitest'
import { instrument } from '../data/instrument'
import type { InstrumentAnswers } from '../types/instrument'
import { createResultPdf } from './pdfExportService'
import { buildResultNarrative } from './resultNarrativeService'
import { calculateScore } from './scoringService'

describe('pdfExportService', () => {
  it('gera um relatório PDF A4 completo com doze páginas', async () => {
    const answers: InstrumentAnswers = Object.fromEntries(instrument.map(({ id }) => [id, 4]))
    const result = calculateScore(answers, 'higher_postgraduate')
    const doc = await createResultPdf(result, buildResultNarrative(result))
    const bytes = new Uint8Array(doc.output('arraybuffer'))
    const signature = new TextDecoder().decode(bytes.slice(0, 5))

    expect(signature).toBe('%PDF-')
    expect(bytes.length).toBeGreaterThan(20_000)
    expect(doc.getNumberOfPages()).toBe(12)
  })
})
