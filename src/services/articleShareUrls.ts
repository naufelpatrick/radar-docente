import type { BlogArticle } from '../data/blogArticles'
import { buildShareUrl, getShareBaseUrl, type ShareSource } from './shareTracking'

export function buildArticleShareUrls(article: BlogArticle) {
  const trackedUrl = (source: ShareSource) => buildShareUrl({
    url: getShareBaseUrl({ canonicalUrl: article.canonicalUrl, path: article.path }),
    source,
    campaign: 'article_share',
    content: article.slug,
  })
  const whatsappUrl = trackedUrl('whatsapp')
  const xUrl = trackedUrl('x')
  const emailUrl = trackedUrl('email')
  const message = `Conheça este artigo do Radar PráxIA: ${article.title}\n\n${whatsappUrl}`
  const xText = `Vale a leitura no Radar PráxIA: ${article.title}`
  const emailBody = `Conheça este artigo do Radar PráxIA:\n\n${article.title}\n\n${emailUrl}`

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackedUrl('linkedin'))}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackedUrl('facebook'))}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(xUrl)}`,
    email: `mailto:?subject=${encodeURIComponent('Conheça o Radar PráxIA')}&body=${encodeURIComponent(emailBody)}`,
    copylink: trackedUrl('copylink'),
    nativeShare: trackedUrl('native_share'),
  }
}
