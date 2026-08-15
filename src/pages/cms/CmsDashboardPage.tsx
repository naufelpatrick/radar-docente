import { Archive, Copy, Edit3, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CmsAdminLayout } from '../../components/CmsAdminLayout'
import { getPublishedBlogArticles } from '../../data/blogArticles'
import { cmsAction, loadCms, type CmsPayload } from '../../services/cmsApi'
import type { CmsArticle, CmsArticleStatus } from '../../types/cms'

const statusLabels = { draft: 'Rascunho', in_review: 'Em revisão', approved: 'Aprovado', published: 'Publicado', archived: 'Arquivado' }
type CmsListItem = CmsArticle & { legacy?: false }
type LegacyListItem = {
  id: string; title: string; status: CmsArticleStatus; category_id: string; author_id: string; created_at: string; updated_at: string; canonical_url: string; legacy: true
  author?: { id: string; display_name: string }; cms_categories?: { name: string }
}

export function CmsDashboardPage() {
  const location = useLocation(); const navigate = useNavigate()
  const [data, setData] = useState<CmsPayload | null>(null); const [error, setError] = useState(''); const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [category, setCategory] = useState(''); const [author, setAuthor] = useState('')
  const listMode = location.pathname === '/admin/artigos'
  async function reload() { try { setData(await loadCms()) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o CMS') } }
  useEffect(() => { void loadCms().then(setData).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o CMS')) }, [])
  const allArticles = useMemo<Array<CmsListItem | LegacyListItem>>(() => {
    if (!data) return []
    const patrick = data.profiles.find((profile) => profile.username === 'patrick.naufel')
    const legacy = getPublishedBlogArticles().map((article): LegacyListItem => ({
      id: `legacy:${article.slug}`, title: article.title, status: 'published', legacy: true,
      category_id: data.categories.find((item) => item.slug === article.categorySlug)?.id || article.categorySlug,
      author_id: patrick?.id || article.author, author: { id: patrick?.id || article.author, display_name: article.author },
      cms_categories: { name: article.category }, created_at: article.publishedAt!, updated_at: article.modifiedAt,
      canonical_url: article.canonicalUrl,
    }))
    return [...(data.articles || []), ...legacy]
  }, [data])
  const filtered = useMemo(() => allArticles.filter((article) => (!search || article.title.toLowerCase().includes(search.toLowerCase())) && (!status || article.status === status) && (!category || article.category_id === category) && (!author || article.author_id === author)), [allArticles, search, status, category, author])
  if (error.includes('sessão') || error.includes('autoriz')) return <Navigate to="/admin/login" replace />
  if (!data) return <main className="cms-loading">{error || 'Carregando CMS…'}</main>
  const articles = data.articles || []; const authors = [...new Map(allArticles.map((item) => [item.author_id, item.author])).values()].filter(Boolean)
  async function action(article: CmsArticle, name: 'duplicate' | 'delete') {
    if (name === 'delete' && !window.confirm(`Excluir “${article.title}”?`)) return
    try { const result = await cmsAction<{ article?: CmsArticle }>({ action: name, id: article.id }); if (result.article) navigate(`/admin/artigos/${result.article.id}`); else await reload() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Ação não concluída') }
  }
  return <CmsAdminLayout user={data.user}>
    <header className="cms-page-header"><div><p className="eyebrow eyebrow--dark"><span />PráxIA editorial</p><h1>{listMode ? 'Artigos' : 'Visão geral'}</h1><p>{listMode ? 'Busque, filtre e gerencie o acervo editorial.' : `Olá, ${data.user.display_name}. Acompanhe o essencial da publicação.`}</p></div><Link className="button-link button-link--primary" to="/admin/artigos/novo"><Plus aria-hidden="true" />Novo artigo</Link></header>
    {error && <p className="cms-alert cms-alert--error">{error}</p>}
    {!listMode && <section className="cms-stats"><article><FileText /><strong>{allArticles.length}</strong><span>Total</span></article><article><Edit3 /><strong>{articles.filter((item) => item.status === 'draft').length}</strong><span>Rascunhos</span></article><article><Eye /><strong>{allArticles.filter((item) => item.status === 'published').length}</strong><span>Publicados</span></article><article><Archive /><strong>{articles.filter((item) => item.status === 'archived').length}</strong><span>Arquivados</span></article></section>}
    {listMode && <section className="cms-filters"><label><Search /><span className="sr-only">Buscar</span><input placeholder="Buscar por título" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos os status</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><select aria-label="Filtrar por categoria" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas as categorias</option>{data.categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><select aria-label="Filtrar por autor" value={author} onChange={(event) => setAuthor(event.target.value)}><option value="">Todos os autores</option>{authors.map((item) => item && <option value={item.id} key={item.id}>{item.display_name}</option>)}</select></section>}
    <section className="cms-article-list"><div className="cms-article-list__head"><span>Título</span><span>Autor e categoria</span><span>Status</span><span>Última edição</span><span>Ações</span></div>{filtered.slice(0, listMode ? undefined : 6).map((article) => <article key={article.id}><div><strong>{article.title || 'Sem título'}</strong><small>{article.legacy ? 'Publicado antes do CMS' : `Criado em ${new Date(article.created_at).toLocaleDateString('pt-BR')}`}</small></div><div><span>{article.author?.display_name || 'Autor'}</span><small>{article.cms_categories?.name || 'Sem categoria'}</small></div><span className={`cms-status cms-status--${article.status}`}>{statusLabels[article.status]}</span><time>{new Date(article.updated_at).toLocaleString('pt-BR')}</time><div className="cms-row-actions">{article.legacy ? <a href={article.canonical_url} target="_blank" rel="noreferrer" title="Visualizar artigo publicado"><Eye /></a> : <><Link to={`/admin/artigos/${article.id}`} title="Editar"><Edit3 /></Link>{article.status === 'published' ? <a href={article.canonical_url} target="_blank" rel="noreferrer" title="Visualizar"><Eye /></a> : <Link to={`/admin/artigos/${article.id}?preview=1`} title="Pré-visualizar"><Eye /></Link>}<button title="Duplicar" onClick={() => void action(article, 'duplicate')}><Copy /></button>{data.user.role === 'admin' && <button title="Excluir" onClick={() => void action(article, 'delete')}><Trash2 /></button>}</>}</div></article>)}</section>
  </CmsAdminLayout>
}
