import type { ReactNode } from 'react'
import { CalendarDays, Clock3, List, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from './Footer'
import { InstitutionalHeader } from './InstitutionalHeader'
import { ArticleShare } from './ArticleShare'
import type { BlogArticle } from '../data/blogArticles'
import { GoogleSwgBasic } from './GoogleSwgBasic'

type TocItem = { id: string; label: string }

interface ArticleLayoutProps {
  article: BlogArticle
  categoryPath?: string
  toc: TocItem[]
  children: ReactNode
}

export function ArticleLayout({ article, categoryPath, toc, children }: ArticleLayoutProps) {
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
              <span><UserRound aria-hidden="true" />{article.author}</span>
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
