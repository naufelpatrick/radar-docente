import type { BlogArticle } from '../data/blogArticles'
import { analyticsAllowed, loadGoogleAnalytics } from './cookieConsent'

export type BlogScrollDepth = 50 | 90
export type BlogRadarCtaLocation = 'intermediate' | 'final' | 'inline'

const SESSION_PREFIX = 'praxia:ga4:blog-growth:'

function sessionStorageSafe() {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function eventParameters(article: BlogArticle) {
  return {
    article_slug: article.slug,
    article_category: article.categorySlug,
    article_path: article.path,
  }
}

function dispatch(name: string, parameters: Record<string, string | number>) {
  if (typeof window === 'undefined' || !analyticsAllowed()) return false
  loadGoogleAnalytics()
  if (typeof window.gtag !== 'function') return false
  window.gtag('event', name, parameters)
  return true
}

function trackOnce(article: BlogArticle, suffix: string, name: string, parameters: Record<string, string | number> = {}) {
  if (article.status !== 'published') return false
  const storage = sessionStorageSafe()
  const key = `${SESSION_PREFIX}${article.slug}:${suffix}`
  if (storage?.getItem(key)) return false
  if (!dispatch(name, { ...eventParameters(article), ...parameters })) return false
  storage?.setItem(key, 'sent')
  return true
}

export function trackBlogArticleView(article: BlogArticle) {
  return trackOnce(article, 'view', 'blog_article_view')
}

export function trackBlogScrollDepth(article: BlogArticle, depth: BlogScrollDepth) {
  return trackOnce(article, `scroll:${depth}`, 'blog_scroll_depth', { scroll_depth: depth })
}

export function trackBlogRadarCtaClick(article: BlogArticle, ctaLocation: BlogRadarCtaLocation, destinationPath: string) {
  if (article.status !== 'published') return false
  return dispatch('blog_radar_cta_click', {
    ...eventParameters(article),
    cta_location: ctaLocation,
    destination_path: destinationPath,
  })
}
