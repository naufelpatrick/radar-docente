import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createDraft,
  createMakePublicationPayload,
  generateChannelHashtags,
  missingImageChannels,
  parseRss,
  selectedPublicationChannels,
  sendToMake,
  validateChannelImages,
} from './distribution.js'
import { createChannelJpeg } from './distribution-images.js'

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
    expect(draft.facebook_image_url).toBeNull()
    expect(draft.instagram_image_url).toBeNull()
    expect(draft.linkedin_caption).toContain('professores, gestores escolares e instituições de ensino')
    expect(draft.linkedin_status).toBe('pending')
  })

  it.each([
    ['instagram', 5, 10],
    ['facebook', 3, 5],
    ['linkedin', 3, 5],
  ])('generates relevant, unique hashtags for %s', (channel, minimum, maximum) => {
    const hashtags = generateChannelHashtags({ category: 'Avaliação' }, channel)
    expect(hashtags.length).toBeGreaterThanOrEqual(minimum)
    expect(hashtags.length).toBeLessThanOrEqual(maximum)
    expect(new Set(hashtags).size).toBe(hashtags.length)
    expect(hashtags).toContain('#AvaliaçãoDaAprendizagem')
    expect(hashtags).toContain('#PráxIA')
  })

  it('automatically identifies every missing channel image after RSS sync', () => {
    expect(missingImageChannels({
      article_image_url: 'https://cdn.example.com/social-graph.jpg',
      instagram_image_url: null,
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    })).toEqual(['instagram'])
    expect(missingImageChannels({
      article_image_url: 'https://cdn.example.com/social-graph.jpg',
      instagram_image_url: null,
      facebook_image_url: null,
    })).toEqual(['instagram', 'facebook'])
    expect(missingImageChannels({
      instagram_image_url: 'https://cdn.example.com/instagram.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    })).toEqual([])
    expect(missingImageChannels({
      instagram_image_url: 'https://project.supabase.co/storage/v1/object/public/distribution-images/article-instagram-1080x1350-123.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    })).toEqual(['instagram'])
    expect(missingImageChannels({
      instagram_image_url: 'https://project.supabase.co/storage/v1/object/public/distribution-images/article-instagram-1080x1350-v2-123.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    })).toEqual([])
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
      instagram_image_url: 'https://cdn.radarpraxia.com/teste-instagram.jpg',
      facebook_image_url: 'https://cdn.radarpraxia.com/teste-facebook.jpg',
      instagram_caption: 'Legenda Instagram',
      facebook_caption: 'Legenda Facebook',
      linkedin_caption: 'Legenda LinkedIn',
      publish_channels: ['instagram', 'facebook', 'linkedin'],
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
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(payload).toEqual({
      content_id: 'publication-1',
      article_title: 'Artigo teste',
      article_url: 'https://www.radarpraxia.com/blog/artigo-teste',
      instagram_image_url: 'https://cdn.radarpraxia.com/teste-instagram.jpg',
      facebook_image_url: 'https://cdn.radarpraxia.com/teste-facebook.jpg',
      linkedin_image_url: 'https://cdn.radarpraxia.com/teste-instagram.jpg',
      instagram_caption: 'Legenda Instagram',
      facebook_caption: 'Legenda Facebook',
      linkedin_caption: 'Legenda LinkedIn',
      publish_instagram: true,
      publish_facebook: true,
      publish_linkedin: true,
    })
    expect(payload).not.toHaveProperty('image_url')
  })

  it('builds a channel-specific Make payload without the legacy image_url field', () => {
    const payload = createMakePublicationPayload({
      id: 'publication-2',
      article_title: 'Outro artigo',
      article_url: 'https://www.radarpraxia.com/blog/outro-artigo',
      image_url: 'https://cdn.example.com/legacy.jpg',
      instagram_image_url: 'https://cdn.example.com/instagram.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
      instagram_caption: 'Legenda do Instagram',
      facebook_caption: 'Texto do Facebook',
      linkedin_caption: 'Texto do LinkedIn',
      publish_channels: ['facebook'],
    })

    expect(payload).toEqual({
      content_id: 'publication-2',
      article_title: 'Outro artigo',
      article_url: 'https://www.radarpraxia.com/blog/outro-artigo',
      instagram_image_url: 'https://cdn.example.com/instagram.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
      linkedin_image_url: 'https://cdn.example.com/instagram.jpg',
      instagram_caption: 'Legenda do Instagram',
      facebook_caption: 'Texto do Facebook',
      linkedin_caption: 'Texto do LinkedIn',
      publish_instagram: false,
      publish_facebook: true,
      publish_linkedin: false,
    })
    expect(payload).not.toHaveProperty('image_url')
  })

  it('selects the three channels independently', () => {
    const item = {
      instagram_enabled: true,
      facebook_enabled: false,
      linkedin_enabled: true,
    }
    expect(selectedPublicationChannels(item)).toEqual(['instagram', 'linkedin'])
    expect(selectedPublicationChannels(item, ['facebook'])).toEqual([])
    expect(selectedPublicationChannels(item, ['linkedin'])).toEqual(['linkedin'])
  })

  it('rejects missing, equal, invalid and insecure channel images', () => {
    expect(() => validateChannelImages({ facebook_image_url: 'https://cdn.example.com/fb.jpg' }, ['instagram']))
      .toThrow('Instagram: adicione')
    expect(() => validateChannelImages({ instagram_image_url: 'https://cdn.example.com/ig.jpg' }, ['facebook']))
      .toThrow('Facebook: adicione')
    expect(() => validateChannelImages({
      instagram_image_url: 'https://cdn.example.com/same.jpg',
      facebook_image_url: 'https://cdn.example.com/same.jpg',
    })).toThrow('URLs não podem ser iguais')
    expect(() => validateChannelImages({
      instagram_image_url: 'not-a-url',
      facebook_image_url: 'https://cdn.example.com/fb.jpg',
    })).toThrow('URL da imagem é inválida')
    expect(() => validateChannelImages({
      instagram_image_url: 'http://cdn.example.com/ig.jpg',
      facebook_image_url: 'https://cdn.example.com/fb.jpg',
    })).toThrow('URL HTTPS')
  })

  it('does not silently accept legacy content with only article_image_url for Instagram', () => {
    expect(() => validateChannelImages({
      article_image_url: 'https://cdn.example.com/social-graph.jpg',
      facebook_image_url: 'https://cdn.example.com/social-graph.jpg',
      instagram_image_url: null,
    })).toThrow('Instagram: adicione')
  })

  it('propagates a Make failure without exposing credentials', async () => {
    process.env.MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/example'
    process.env.MAKE_WEBHOOK_API_KEY = 'server-only-secret'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('route failed', { status: 500 })))
    await expect(sendToMake({})).rejects.toThrow('Make recusou a publicação (500): route failed')
  })

  it('generates genuinely different JPEG dimensions for each channel', async () => {
    const item = { article_title: 'Avaliação com apoio de IA', article_category: 'Avaliação' }
    const instagram = await createChannelJpeg(item, 'instagram')
    const facebook = await createChannelJpeg(item, 'facebook')
    const [instagramMetadata, facebookMetadata] = await Promise.all([
      import('sharp').then(({ default: sharp }) => sharp(instagram).metadata()),
      import('sharp').then(({ default: sharp }) => sharp(facebook).metadata()),
    ])
    expect(instagramMetadata).toMatchObject({ width: 1080, height: 1350, format: 'jpeg' })
    expect(facebookMetadata).toMatchObject({ width: 1200, height: 630, format: 'jpeg' })
    expect(instagram.equals(facebook)).toBe(false)
  })

  it('does not accept an insecure Make webhook URL', async () => {
    process.env.MAKE_WEBHOOK_URL = 'http://hook.eu2.make.com/example'
    process.env.MAKE_WEBHOOK_API_KEY = 'secret'
    await expect(sendToMake({})).rejects.toThrow('MAKE_WEBHOOK_URL deve usar HTTPS')
  })
})
