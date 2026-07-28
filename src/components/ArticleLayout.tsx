import type { ReactNode } from 'react'
import { CalendarDays, Clock3, List, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from './Footer'
import { InstitutionalHeader } from './InstitutionalHeader'

type TocItem = { id: string; label: string }

interface ArticleLayoutProps {
  category: string
  title: string
  description: string
  date: string
  readingTime: string
  author: string
  toc: TocItem[]
  children: ReactNode
}

export function ArticleLayout({ category, title, description, date, readingTime, author, toc, children }: ArticleLayoutProps) {
  return (
    <>
      <a className="skip-link" href="#conteudo-artigo">Pular para o artigo</a>
      <InstitutionalHeader currentPage="blog" />
      <main className="article-page">
        <header className="article-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><span>/</span><Link to="/blog">Blog</Link><span>/</span><span aria-current="page">{category}</span>
            </nav>
            <p className="method-kicker">{category}</p>
            <h1>{title}</h1>
            <p className="article-hero__description">{description}</p>
            <div className="article-meta">
              <span><UserRound aria-hidden="true" />{author}</span>
              <span><CalendarDays aria-hidden="true" />{date}</span>
              <span><Clock3 aria-hidden="true" />{readingTime}</span>
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
