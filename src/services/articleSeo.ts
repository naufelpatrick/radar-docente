import type { BlogArticle } from '../data/blogArticles'
import { buildSiteUrl } from '../config/site'
import { getAuthorPath, getTeamMemberByName } from '../data/team'

export function createBlogPostingSchema(article: BlogArticle) {
  const author = getTeamMemberByName(article.author)
  const authorPath = getAuthorPath(article.author)
  return {
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: {
      '@type': 'ImageObject',
      url: article.socialImage,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    inLanguage: 'pt-BR',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl,
    },
    author: {
      '@type': 'Person',
      name: article.author,
      ...(authorPath ? { url: buildSiteUrl(authorPath) } : {}),
      ...(author ? { sameAs: author.links.map((link) => link.href) } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'PraxIA',
      url: 'https://www.radarpraxia.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.radarpraxia.com/brand/praxia-logo-positive.svg',
      },
    },
    articleSection: article.category,
  }
}
