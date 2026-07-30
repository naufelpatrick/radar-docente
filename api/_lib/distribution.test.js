import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDraft, parseRss, sendToMake } from './distribution.js'

describe('content distribution', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.MAKE_WEBHOOK_URL
    delete process.env.MAKE_WEBHOOK_API_KEY
  })

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

  it('sends the publication payload to the authenticated Make webhook', async () => {
    process.env.MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/example'
    process.env.MAKE_WEBHOOK_API_KEY = 'secret'
    const fetchMock = vi.fn().mockResolvedValue(new Response('Accepted', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await sendToMake({
      id: 'publication-1',
      article_title: 'Artigo teste',
      article_url: 'https://www.radarpraxia.com/blog/artigo-teste',
      article_image_url: 'https://www.radarpraxia.com/social/teste.jpg',
      instagram_caption: 'Legenda Instagram',
      facebook_caption: 'Legenda Facebook',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://hook.eu2.make.com/example'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-make-apikey': 'secret',
        },
      }),
    )
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      content_id: 'publication-1',
      article_title: 'Artigo teste',
      article_url: 'https://www.radarpraxia.com/blog/artigo-teste',
      image_url: 'https://www.radarpraxia.com/social/teste.jpg',
      instagram_caption: 'Legenda Instagram',
      facebook_caption: 'Legenda Facebook',
    })
  })

  it('does not accept an insecure Make webhook URL', async () => {
    process.env.MAKE_WEBHOOK_URL = 'http://hook.eu2.make.com/example'
    process.env.MAKE_WEBHOOK_API_KEY = 'secret'
    await expect(sendToMake({})).rejects.toThrow('MAKE_WEBHOOK_URL deve usar HTTPS')
  })
})
