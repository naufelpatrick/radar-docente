import type { BlogArticle } from '../data/blogArticles'

export function createBlogPostingSchema(article: BlogArticle) {
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
      url: 'http://lattes.cnpq.br/0026328778886854',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PráxIA',
      url: 'https://www.radarpraxia.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.radarpraxia.com/favicon.png',
      },
    },
    articleSection: article.category,
  }
}
