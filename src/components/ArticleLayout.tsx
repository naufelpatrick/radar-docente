import { useEffect, type ReactNode } from 'react'
import { CalendarDays, Clock3, List, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from './Footer'
import { InstitutionalHeader } from './InstitutionalHeader'
import { ArticleShare } from './ArticleShare'
import type { BlogArticle } from '../data/blogArticles'
import { GoogleSwgBasic } from './GoogleSwgBasic'
import { getAuthorPath } from '../data/team'
import {
  trackBlogArticleView,
  trackBlogRadarCtaClick,
  trackBlogScrollDepth,
  type BlogRadarCtaLocation,
} from '../services/blogGrowthAnalytics'
import { ANALYTICS_CONSENT_GRANTED_EVENT, MARKETING_CONSENT_GRANTED_EVENT } from '../services/cookieConsent'

type TocItem = { id: string; label: string }

interface ArticleLayoutProps {
  article: BlogArticle
  categoryPath?: string
  toc: TocItem[]
  children: ReactNode
}

function ctaLocation(anchor: HTMLAnchorElement): BlogRadarCtaLocation {
  const cta = anchor.closest('.article-cta')
  if (!cta) return 'inline'
  return cta.classList.contains('article-cta--intermediate') ? 'intermediate' : 'final'
}

export function ArticleLayout({ article, categoryPath, toc, children }: ArticleLayoutProps) {
  const authorPath = getAuthorPath(article.author)

  useEffect(() => {
    if (article.status !== 'published') return
    const articleContent = document.getElementById('conteudo-artigo')
    if (!articleContent) return

    const evaluateScrollDepth = () => {
      const rect = articleContent.getBoundingClientRect()
      const articleTop = window.scrollY + rect.top
      const articleHeight = Math.max(articleContent.scrollHeight, rect.height, 1)
      const viewportBottom = window.scrollY + window.innerHeight
      const depth = ((viewportBottom - articleTop) / articleHeight) * 100
      if (depth >= 50) trackBlogScrollDepth(article, 50)
      if (depth >= 90) trackBlogScrollDepth(article, 90)
    }

    const handleArticleClick = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement) || !articleContent.contains(anchor)) return
      const href = anchor.getAttribute('href')
      if (!href) return
      const destination = new URL(href, window.location.origin)
      if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/radar')) return
      trackBlogRadarCtaClick(article, ctaLocation(anchor), destination.pathname)
    }

    const handleAnalyticsConsent = () => {
      trackBlogArticleView(article)
      evaluateScrollDepth()
    }
    const handleMarketingConsent = () => trackBlogArticleView(article)

    trackBlogArticleView(article)
    evaluateScrollDepth()
    window.addEventListener('scroll', evaluateScrollDepth, { passive: true })
    window.addEventListener('resize', evaluateScrollDepth, { passive: true })
    window.addEventListener(ANALYTICS_CONSENT_GRANTED_EVENT, handleAnalyticsConsent)
    window.addEventListener(MARKETING_CONSENT_GRANTED_EVENT, handleMarketingConsent)
    articleContent.addEventListener('click', handleArticleClick)

    return () => {
      window.removeEventListener('scroll', evaluateScrollDepth)
      window.removeEventListener('resize', evaluateScrollDepth)
      window.removeEventListener(ANALYTICS_CONSENT_GRANTED_EVENT, handleAnalyticsConsent)
      window.removeEventListener(MARKETING_CONSENT_GRANTED_EVENT, handleMarketingConsent)
      articleContent.removeEventListener('click', handleArticleClick)
    }
  }, [article])

  return (
    <>
      <GoogleSwgBasic />
      <a className="skip-link" href="#conteudo-artigo">Pular para o artigo</a>
      <InstitutionalHeader currentPage="blog" />
      <main className="article-page">
        <header className="article-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><span>/</span><Link to="/blog">Blog</Link><span>/</span>{categoryPath ? <Link to={categoryPath}>{article.category}</Link> : <span>{article.category}</span>}<span>/</span><span aria-current="page">{article.title}</span>
            </nav>
            <p className="method-kicker">{article.category}</p>
            <h1>{article.title}</h1>
            <p className="article-hero__description">{article.metaDescription}</p>
            <div className="article-meta">
              <span><UserRound aria-hidden="true" />{authorPath ? <Link to={authorPath}>{article.author}</Link> : article.author}</span>
              <span><CalendarDays aria-hidden="true" />{article.displayDate}</span>
              <span><Clock3 aria-hidden="true" />{article.readingTime}</span>
              <ArticleShare article={article} variant="compact" />
            </div>
          </div>
        </header>
        <div className="shell article-layout">
          <aside className="article-toc" aria-labelledby="toc-title">
            <div><List aria-hidden="true" /><strong id="toc-title">Neste artigo</strong></div>
            <ol>{toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol>
          </aside>
          <article id="conteudo-artigo" className="article-content">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  )
}
