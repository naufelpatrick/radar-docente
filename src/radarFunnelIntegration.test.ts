import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('integração do funil nas páginas do Radar', () => {
  it('liga cada etapa ao componente correto sem alterar o questionário', () => {
    const intro = read('./pages/radar/RadarIntroPage.tsx')
    const profile = read('./pages/radar/RadarProfilePage.tsx')
    const question = read('./pages/radar/RadarQuestionPage.tsx')
    const result = read('./pages/radar/RadarResultPage.tsx')

    expect(intro).toContain('trackRadarLanding(session.startedAt)')
    expect(intro).toContain('trackRadarStart(session.startedAt')
    expect(intro).toContain('trackRadarConsentAccepted(session.startedAt)')
    expect(profile).toContain('trackRadarProfileStarted(session.startedAt)')
    expect(profile).toContain('trackRadarProfileComplete(session.startedAt')
    expect(question).toContain('trackRadarQuestion(session.startedAt, index + 1, instrument.length)')
    expect(result).toContain('completionTimeSeconds={result.completionTimeSeconds}')
  })
})

