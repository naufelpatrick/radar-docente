import { trackShare, type ShareSource } from './shareTracking'

export type ArticleShareMethod = ShareSource

export function trackArticleShare(shareMethod: ArticleShareMethod) {
  trackShare({
    method: shareMethod,
    contentType: 'article',
    itemId: 'article_share',
  })
}
