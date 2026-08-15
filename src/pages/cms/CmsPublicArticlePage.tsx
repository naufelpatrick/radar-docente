import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import type { BlogArticle } from '../../data/blogArticles'
import { loadPreviewArticle, loadPublicArticle, loadPublicArticles } from '../../services/cmsApi'
import { cmsHeadings } from '../../services/cmsContent'
import type { CmsArticle } from '../../types/cms'
import { getPublishedBlogArticles } from '../../data/blogArticles'

function articleView(article: CmsArticle): BlogArticle {
  const date = article.published_at ? new Date(article.published_at) : new Date(article.updated_at)
  return {
    slug: article.slug, path: article.canonical_url ? new URL(article.canonical_url).pathname : `/admin/artigos/${article.id}/preview`, category: article.cms_categories?.name || 'Blog', categorySlug: article.cms_categories?.slug || 'blog', editorialLabel: 'CONTEÚDO PRÁXIA', title: article.title, summary: article.excerpt, seoTitle: article.meta_title, metaDescription: article.meta_description, readingTime: `${article.reading_time_minutes} min de leitura`, publishedAt: article.published_at, modifiedAt: article.updated_at.slice(0, 10), publishedDate: date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }), displayDate: date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }), canonicalUrl: article.canonical_url, socialImage: article.cover_image_url || '', socialImageAlt: article.cover_image_alt, author: article.author?.display_name || article.cms_profiles?.display_name || 'PraxIA', status: article.status === 'published' ? 'published' : 'draft', coverImage: article.cover_image_webp_url || article.cover_image_url ? { src: article.cover_image_webp_url || article.cover_image_url || '', alt: article.cover_image_alt } : undefined, faq: article.faq_json,
  }
}

function ContentWithCta({ article }: { article: CmsArticle }) {
  const cta = article.cta_json
  if (!cta || !article.cta_heading_id) return <div className="cms-public-content" dangerouslySetInnerHTML={{ __html: article.content_html }} />
  const marker = `<h2 id="${article.cta_heading_id}"`
  const headingStart = article.content_html.indexOf(marker)
  if (headingStart < 0) return <div className="cms-public-content" dangerouslySetInnerHTML={{ __html: article.content_html }} />
  const nextHeading = article.content_html.indexOf('<h2', headingStart + marker.length)
  const split = nextHeading < 0 ? article.content_html.length : nextHeading
  return <><div className="cms-public-content" dangerouslySetInnerHTML={{ __html: article.content_html.slice(0, split) }} /><section className="article-cta article-cta--intermediate"><h2>{cta.title}</h2><p>{cta.text}</p><ButtonLink href={cta.href || '/radar'} variant="light" showArrow>{cta.label}</ButtonLink></section><div className="cms-public-content" dangerouslySetInnerHTML={{ __html: article.content_html.slice(split) }} /></>
}

export function CmsPublicArticlePage({ preview = false }: { preview?: boolean }) {
  const { category, slug, id } = useParams(); const [article, setArticle] = useState<CmsArticle | null>(null); const [related, setRelated] = useState<CmsArticle[]>([]); const [error, setError] = useState('')
  useEffect(() => {
    const load = preview && id ? loadPreviewArticle(id) : category && slug ? loadPublicArticle(category, slug) : Promise.reject(new Error('Artigo não encontrado'))
    void load.then(({ article: loaded }) => { setArticle(loaded); return loadPublicArticles().then(({ articles }) => { const manual = loaded.related_article_ids || []; setRelated(articles.filter((item) => item.id !== loaded.id && (manual.includes(item.id) || item.category_id === loaded.category_id)).sort((first, second) => { const firstIndex = manual.indexOf(first.id); const secondIndex = manual.indexOf(second.id); if (firstIndex >= 0 && secondIndex >= 0) return firstIndex - secondIndex; if (firstIndex >= 0) return -1; if (secondIndex >= 0) return 1; return 0 }).slice(0, 3)) }).catch(() => undefined) }).catch((caught) => setError(caught instanceof Error ? caught.message : 'Artigo não encontrado'))
  }, [category, id, preview, slug])
  const headings = useMemo(() => cmsHeadings(article?.content_json?.doc), [article])
  if (error) return <main className="cms-public-error"><h1>{error}</h1><Link to="/blog">Voltar ao blog</Link></main>
  if (!article) return <main className="cms-loading">Carregando artigo…</main>
  const view = articleView(article)
  const faq = article.faq_json?.filter((item) => item.question && item.answer) || []
  const graph: Record<string, unknown>[] = [{ '@type': 'BlogPosting', headline: article.title, description: article.meta_description, image: article.cover_image_url, author: { '@type': 'Person', name: view.author }, publisher: { '@type': 'Organization', name: 'PraxIA', url: 'https://www.radarpraxia.com/', logo: { '@type': 'ImageObject', url: 'https://www.radarpraxia.com/favicon.png' } }, datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: article.canonical_url }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://www.radarpraxia.com/blog' }, { '@type': 'ListItem', position: 2, name: view.category, item: `https://www.radarpraxia.com/blog/categoria/${view.categorySlug}` }, { '@type': 'ListItem', position: 3, name: view.title, item: view.canonicalUrl }] }]
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  return <>
    <Seo title={preview ? `Prévia: ${view.title} | PraxIA` : view.seoTitle} description={view.metaDescription} path={view.path} type="article" image={view.socialImage} imageAlt={view.socialImageAlt} robots={preview ? 'noindex, nofollow' : 'index, follow'} jsonLd={{ '@context': 'https://schema.org', '@graph': graph }} />
    {preview && <div className="cms-preview-banner">Pré-visualização privada · este conteúdo não está indexado nem no RSS.</div>}
    <ArticleLayout article={view} categoryPath={`/blog/categoria/${view.categorySlug}`} toc={article.show_table_of_contents ? headings : []}>
      <p className="article-lead">{article.excerpt}</p>{article.cover_image_url && <figure className="article-cover"><picture>{article.cover_image_webp_url && <source srcSet={article.cover_image_webp_url} type="image/webp" />}<img src={article.cover_image_url} alt={article.cover_image_alt} width="1200" height="630" /></picture></figure>}
      <ContentWithCta article={article} />
      {article.protocol_json?.title && <section className="cms-protocol"><h2>{article.protocol_json.title}</h2>{article.protocol_json.introduction && <p>{article.protocol_json.introduction}</p>}<ol>{article.protocol_json.steps.map((step, index) => <li key={`${step.title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></section>}
      {article.checklist_json?.length > 0 && <section><h2>Checklist</h2><ul className="article-checklist">{article.checklist_json.map((item) => <li key={item}><CheckCircle2 /><span>{item}</span></li>)}</ul></section>}
      {article.show_editorial_notice && <aside className="article-callout"><p>{article.editorial_notice_text || 'Este conteúdo apresenta orientação educacional geral e não substitui avaliação jurídica, parecer especializado ou as políticas, normas e procedimentos da instituição.'}</p></aside>}
      {!preview && <ArticleShare article={view} />}{faq.length > 0 && <FaqSection items={faq} title="Perguntas frequentes" />}
      {(related.length > 0 || article.legacy_related_paths?.length > 0) && <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div>{related.map((item) => <Link key={item.id} to={new URL(item.canonical_url).pathname}>{item.title}<ArrowRight /></Link>)}{article.legacy_related_paths?.slice(0, Math.max(0, 3 - related.length)).map((path) => <Link key={path} to={path}>{getPublishedBlogArticles().find((item) => item.path === path)?.title || 'Conteúdo relacionado'}<ArrowRight /></Link>)}</div></section>}
    </ArticleLayout>
  </>
}
