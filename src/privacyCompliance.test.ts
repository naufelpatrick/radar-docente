import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('privacy implementation contracts', () => {
  it('registers the privacy route and footer controls', () => {
    expect(read('./App.tsx')).toContain('path="/privacidade"')
    const footer = read('./components/Footer.tsx')
    expect(footer).toContain('Política de Privacidade')
    expect(footer).toContain('Preferências de cookies')
  })

  it('shows a contextual privacy notice in every lead form', () => {
    const sources = [
      read('./pages/ContactPage.tsx'),
      read('./components/MentoringLeadForm.tsx'),
      read('./components/InstitutionalLeadForm.tsx'),
      read('./components/RadarLeadForm.tsx'),
    ]
    sources.forEach((source) => {
      expect(source).toContain('Política de Privacidade')
      expect(source).toContain('/privacidade')
    })
  })

  it('keeps individual Radar answers out of the lead submission', () => {
    const service = read('./services/radarLeadService.ts')
    expect(service).toContain('dimension_scores')
    expect(service).toContain('overall_score')
    expect(service).not.toContain('result.answers')
    expect(service).not.toContain('session.answers')
  })

  it('does not load Google Analytics statically', () => {
    expect(read('../index.html')).not.toContain('googletagmanager.com/gtag/js')
    expect(read('./services/cookieConsent.ts')).toContain("readCookiePreference() === 'accepted'")
  })

  it('does not add personal or diagnostic data to commercial analytics parameters', () => {
    const analytics = read('./services/commercialAnalytics.ts')
    for (const field of ['email', 'phone', 'name', 'message', 'city', 'score', 'answer', 'dimension']) {
      expect(analytics).not.toContain(`${field}?:`)
    }
  })

  it('does not publish legal placeholders or claim a definitive policy', () => {
    const page = read('./pages/PrivacyPage.tsx')
    expect(page).not.toContain('[INSERIR')
    expect(page).not.toContain('[DEFINIR')
    expect(page).not.toContain('CNPJ:')
    expect(page).toContain('Versão informativa em revisão')
  })
})
