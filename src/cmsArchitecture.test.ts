import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync('supabase/migrations/20260802150000_create_editorial_cms.sql', 'utf8')
const routes = readFileSync('src/App.tsx', 'utf8')
const rssGenerator = readFileSync('scripts/generate-rss.mjs', 'utf8')
const distribution = readFileSync('api/_lib/distribution.js', 'utf8')
const imageApi = readFileSync('api/cms/image.js', 'utf8')

describe('arquitetura do CMS editorial', () => {
  it('protege tabelas privadas com RLS e limita leitura pública a publicados', () => {
    for (const table of ['cms_profiles', 'cms_credentials', 'cms_sessions', 'cms_login_attempts', 'cms_categories', 'cms_articles', 'cms_editorial_settings', 'cms_audit_logs']) {
      expect(migration).toContain(`alter table public.${table} enable row level security`)
    }
    expect(migration).toContain("status = 'published'")
    expect(migration).toContain('deleted_at is null')
  })

  it('mantém UUIDs nos relacionamentos e estados futuros preparados', () => {
    expect(migration).toContain("check (status in ('draft', 'in_review', 'approved', 'published', 'archived'))")
    expect(migration).toContain('author_id uuid')
    expect(migration).toContain('created_by uuid')
    expect(migration).toContain('updated_by uuid')
    expect(migration).toContain('published_by uuid')
  })

  it('expõe somente as rotas administrativas e de prévia esperadas', () => {
    for (const route of ['/admin/login', '/admin/artigos', '/admin/artigos/novo', '/admin/artigos/:id', '/admin/configuracoes']) expect(routes).toContain(route)
    expect(routes).toContain('<CmsPublicArticlePage preview')
  })

  it('preserva o feed legado e o mecanismo de deduplicação usado pelo Make', () => {
    expect(rssGenerator).toContain("'feed.xml'")
    expect(rssGenerator).not.toContain("'rss.xml'")
    expect(distribution).toContain('on_conflict=article_guid')
    expect(distribution).toContain('resolution=ignore-duplicates')
  })

  it('gera somente capa no CMS e não peças sociais', () => {
    expect(imageApi).toContain("storage/v1/object/article-covers")
    expect(imageApi).not.toContain('instagram')
    expect(imageApi).not.toContain('linkedin')
  })
})
