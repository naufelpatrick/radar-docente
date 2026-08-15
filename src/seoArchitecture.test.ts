import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { SITE_URL, buildSiteUrl } from './config/site'
import { getPublishedBlogArticles } from './data/blogArticles'

describe('arquitetura de SEO', () => {
  it('usa somente a origem canônica oficial', () => {
    expect(SITE_URL).toBe('https://www.radarpraxia.com')
    expect(buildSiteUrl('/blog')).toBe('https://www.radarpraxia.com/blog')
    expect(getPublishedBlogArticles().every((article) => article.canonicalUrl.startsWith(SITE_URL))).toBe(true)
  })

  it('não contém o domínio antigo no código de produção', () => {
    const result = spawnSync('rg', [
      '-l',
      'radar-docente-pi\\.vercel\\.app',
      '--glob', '!seoArchitecture.test.ts',
      'src', 'api', 'scripts', 'public', 'index.html',
    ], { encoding: 'utf8' })
    expect(result.status).toBe(1)
    expect(result.stdout).toBe('')
  })

  it('configura 404 real e redirect do host antigo', () => {
    const config = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
    expect(config).toContain('radar-docente-pi.vercel.app')
    expect(config).toContain('/api/not-found')
  })
})
