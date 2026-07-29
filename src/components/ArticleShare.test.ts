import { describe, expect, it } from 'vitest'
import { getBlogArticleBySlug } from '../data/blogArticles'
import { buildArticleShareUrls } from '../services/articleShareUrls'

describe('links de compartilhamento de artigo', () => {
  const article = getBlogArticleBySlug('como-conversar-sobre-autoria-em-atividades-com-ia')
  const urls = buildArticleShareUrls(article)

  it('preserva título acentuado e URL canônica na mensagem do WhatsApp', () => {
    const message = new URL(urls.whatsapp).searchParams.get('text')

    expect(message).toContain('Como conversar sobre autoria em atividades com IA')
    expect(message).toContain(article.canonicalUrl)
  })

  it('envia sempre a URL canônica para LinkedIn e Facebook', () => {
    expect(new URL(urls.linkedin).searchParams.get('url')).toBe(article.canonicalUrl)
    expect(new URL(urls.facebook).searchParams.get('u')).toBe(article.canonicalUrl)
  })
})
