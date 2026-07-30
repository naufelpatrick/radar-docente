import { describe, expect, it } from 'vitest'
import { createDraft, parseRss } from './distribution.js'

describe('content distribution', () => {
  it('reads article and media metadata from RSS', () => {
    const [article] = parseRss(`<?xml version="1.0"?><rss><channel><item>
      <title><![CDATA[IA &amp; docência]]></title>
      <link>https://www.radarpraxia.com/blog/teste</link>
      <guid>article-1</guid>
      <description><![CDATA[<p>Uma reflexão prática.</p>]]></description>
      <category>Planejamento</category>
      <pubDate>Thu, 30 Jul 2026 12:00:00 GMT</pubDate>
      <media:content url="https://www.radarpraxia.com/social/teste.jpg" />
    </item></channel></rss>`)
    expect(article).toMatchObject({
      guid: 'article-1',
      title: 'IA & docência',
      summary: 'Uma reflexão prática.',
      imageUrl: 'https://www.radarpraxia.com/social/teste.jpg',
    })
  })

  it('creates channel-specific drafts and UTMs', () => {
    const draft = createDraft({
      guid: 'article-1',
      title: 'Artigo teste',
      summary: 'Resumo',
      url: 'https://www.radarpraxia.com/blog/artigo-teste',
      category: 'Planejamento',
      imageUrl: 'https://www.radarpraxia.com/social/teste.jpg',
      publishedAt: '2026-07-30',
    })
    expect(draft.instagram_caption).toContain('utm_source=instagram')
    expect(draft.facebook_caption).toContain('utm_source=facebook')
    expect(draft.status).toBe('draft')
  })
})
