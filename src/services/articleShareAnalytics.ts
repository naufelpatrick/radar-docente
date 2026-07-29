import { analyticsAllowed } from './cookieConsent'

export type ArticleShareMethod = 'whatsapp' | 'linkedin' | 'facebook' | 'native' | 'copy_link'

export function trackArticleShare(articleTitle: string, articleSlug: string, shareMethod: ArticleShareMethod) {
  if (typeof window === 'undefined' || !analyticsAllowed() || typeof window.gtag !== 'function') return

  const event = shareMethod === 'copy_link' ? 'article_copy_link' : 'article_share'
  window.gtag('event', event, {
    article_title: articleTitle,
    article_slug: articleSlug,
    share_method: shareMethod,
  })
}
