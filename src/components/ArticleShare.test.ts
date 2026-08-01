import { describe, expect, it } from 'vitest'
import { getBlogArticleBySlug } from '../data/blogArticles'
import { buildArticleShareUrls } from '../services/articleShareUrls'

describe('links de compartilhamento de artigo', () => {
  const article = getBlogArticleBySlug('como-conversar-sobre-autoria-em-atividades-com-ia')
  const urls = buildArticleShareUrls(article)

  it('preserva o título e inclui a URL rastreada na mensagem do WhatsApp', () => {
    const message = new URL(urls.whatsapp).searchParams.get('text')

    expect(message).toContain('Como conversar sobre autoria em atividades com IA')
    const sharedUrl = new URL(message!.split('\n').at(-1)!)
    expect(sharedUrl.searchParams.get('utm_source')).toBe('whatsapp')
    expect(sharedUrl.searchParams.get('utm_campaign')).toBe('article_share')
    expect(sharedUrl.searchParams.get('utm_content')).toBe(article.slug)
  })

  it('usa uma URL específica para cada canal', () => {
    expect(new URL(new URL(urls.linkedin).searchParams.get('url')!).searchParams.get('utm_source')).toBe('linkedin')
    expect(new URL(new URL(urls.facebook).searchParams.get('u')!).searchParams.get('utm_source')).toBe('facebook')
    expect(new URL(new URL(urls.x).searchParams.get('url')!).searchParams.get('utm_source')).toBe('x')
    expect(new URL(urls.copylink).searchParams.get('utm_source')).toBe('copylink')
    expect(new URL(urls.nativeShare).searchParams.get('utm_source')).toBe('native_share')
  })
})
