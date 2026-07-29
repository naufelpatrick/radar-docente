import type { BlogArticle } from '../data/blogArticles'

export function buildArticleShareUrls(article: BlogArticle) {
  const message = `Encontrei este artigo da PráxIA e achei que vale a leitura: ${article.title} — ${article.canonicalUrl}`
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.canonicalUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.canonicalUrl)}`,
  }
}
