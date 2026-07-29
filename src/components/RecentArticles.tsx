import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPublishedBlogArticles } from '../data/blogArticles'

export function RecentArticles() {
  const recentArticles = getPublishedBlogArticles().slice(0, 3)

  if (recentArticles.length === 0) return null

  return (
    <section className="section recent-articles" aria-labelledby="recent-articles-title">
      <div className="shell">
        <div className="section-heading recent-articles__heading" data-reveal="up">
          <div>
            <p className="eyebrow eyebrow--dark">LEITURAS PARA A PRÁTICA</p>
            <h2 id="recent-articles-title">Artigos recentes</h2>
          </div>
          <p>Critérios, perguntas e caminhos para integrar tecnologia e IA com intenção pedagógica.</p>
        </div>

        <div className="recent-articles__grid">
          {recentArticles.map((article) => (
            <Link className="recent-article-card" to={article.path} key={article.path} data-reveal="up" aria-label={`Ler artigo: ${article.title}`}>
              {article.coverImage && <img src={article.coverImage.src} alt={article.coverImage.alt} loading="lazy" decoding="async" />}
              <article>
                <div className="recent-article-card__meta">
                  <span>{article.category}</span>
                  <time dateTime={article.publishedAt!}>{article.publishedDate}</time>
                </div>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <footer>
                  <small>{article.readingTime}</small>
                  <span>Ler artigo <ArrowRight aria-hidden="true" /></span>
                </footer>
              </article>
            </Link>
          ))}
        </div>

        <div className="recent-articles__cta" data-reveal="up">
          <Link to="/blog">Ver todos os artigos <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}
