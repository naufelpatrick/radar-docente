import { Archive, Check, Eye, ImageIcon, RotateCcw, Save, Sparkles, Upload, WandSparkles } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CmsAdminLayout } from '../../components/CmsAdminLayout'
import { CmsRichTextEditor } from '../../components/CmsRichTextEditor'
import { cmsAction, imageAction, loadCms, type CmsPayload } from '../../services/cmsApi'
import { cmsHeadings, cmsSlugify } from '../../services/cmsContent'
import { emptyCmsArticle, type CmsArticle, type CmsFaq, type EditorDoc } from '../../types/cms'
import { getPublishedBlogArticles } from '../../data/blogArticles'

const legacyArticles = getPublishedBlogArticles()

export function CmsArticleEditorPage() {
  const { id } = useParams(); const navigate = useNavigate(); const fileRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<CmsPayload | null>(null); const [article, setArticle] = useState<Partial<CmsArticle>>({}); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [dirty, setDirty] = useState(false); const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [formatBackup, setFormatBackup] = useState<EditorDoc | null>(null)
  useEffect(() => { void loadCms(id === 'novo' ? undefined : id).then((payload) => { setData(payload); setArticle(payload.article || emptyCmsArticle(payload.user.id)) }).catch((error) => setMessage(error instanceof Error ? error.message : 'Não foi possível abrir o editor')) }, [id])
  const update = useCallback((changes: Partial<CmsArticle>) => { setArticle((current) => ({ ...current, ...changes })); setDirty(true) }, [])
  const headings = useMemo(() => cmsHeadings(article.content_json?.doc), [article.content_json])
  const save = useCallback(async (status?: CmsArticle['status'], silent = false) => {
    if (!data || !article.title?.trim()) { if (!silent) setMessage('Informe o título para salvar.'); return null }
    setBusy(true); if (!silent) setMessage('')
    try {
      const result = await cmsAction<{ article: CmsArticle }>({ action: 'save', article: { ...article, status: status || article.status || 'draft' } })
      setArticle(result.article); setDirty(false); setSavedAt(new Date()); if (!silent) setMessage(status === 'published' ? 'Artigo publicado.' : 'Artigo salvo.'); if (!article.id) navigate(`/admin/artigos/${result.article.id}`, { replace: true }); return result.article
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível salvar'); return null } finally { setBusy(false) }
  }, [article, data, navigate])
  useEffect(() => { if (!dirty || !article.id || !article.title) return; const timer = window.setTimeout(() => void save(undefined, true), 8000); return () => window.clearTimeout(timer) }, [article.id, article.title, dirty, save])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn) }, [dirty])
  if (message.includes('sessão') || message.includes('autoriz')) return <Navigate to="/admin/login" replace />
  if (!data) return <main className="cms-loading">{message || 'Abrindo editor…'}</main>
  async function prepare() {
    setMessage('Salvando o rascunho antes da preparação…')
    const saved = await save('draft', true)
    if (!saved) return
    setBusy(true)
    try { const result = await cmsAction<{ suggestions: Partial<CmsArticle> }>({ action: 'prepare', article: saved }); update({ ...result.suggestions, faq_json: saved.faq_json?.length ? saved.faq_json : result.suggestions.faq_json }); setMessage('Sugestões preparadas. O texto original foi preservado; revise os campos sugeridos.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível preparar o artigo') } finally { setBusy(false) }
  }
  async function standardize() {
    setMessage('Salvando o rascunho antes da padronização…')
    const saved = await save('draft', true)
    if (!saved) return
    setBusy(true)
    try {
      const result = await cmsAction<{ doc: EditorDoc; changes: string[] }>({ action: 'standardize', article: saved })
      if (!result.changes.length) { setMessage('A estrutura já segue os padrões reconhecidos. Nenhuma alteração foi necessária.'); return }
      const summary = result.changes.slice(0, 6).map((item) => `• ${item}`).join('\n')
      if (!window.confirm(`Foram encontrados ${result.changes.length} ajustes de formatação:\n\n${summary}\n\nAplicar agora?`)) { setMessage('Padronização cancelada. O rascunho original permanece salvo.'); return }
      setFormatBackup(saved.content_json.doc)
      update({ content_json: { doc: result.doc } })
      setMessage('Formatação padronizada. Revise o texto e salve quando estiver satisfeito.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível padronizar a formatação') } finally { setBusy(false) }
  }
  function undoStandardize() {
    if (!formatBackup) return
    update({ content_json: { doc: formatBackup } }); setFormatBackup(null); setMessage('Padronização desfeita. O conteúdo anterior foi restaurado.')
  }
  async function cover(action: string, extra: Record<string, unknown> = {}) {
    let target = article as CmsArticle
    if (!article.id) { const saved = await save('draft'); if (!saved) return; target = saved }
    setBusy(true); setMessage(action === 'generate' ? 'Gerando a imagem de capa…' : '')
    try { const result = await imageAction(target.id, action, extra); setArticle((current) => ({ ...current, ...result.article })); setDirty(false); setMessage(action === 'approve' ? 'Imagem aprovada.' : action === 'remove' ? 'Imagem removida.' : 'Imagem atualizada. Revise e aprove antes de publicar.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível gerar a imagem. O artigo foi mantido como rascunho.') } finally { setBusy(false) }
  }
  function upload(file?: File) { if (!file) return; const reader = new FileReader(); reader.onload = () => void cover('upload', { data_url: reader.result }); reader.readAsDataURL(file) }
  function updateFaq(index: number, changes: Partial<CmsFaq>) { const next = [...(article.faq_json || [])]; next[index] = { ...next[index], ...changes }; update({ faq_json: next }) }
  async function createCategory() {
    const name = window.prompt('Nome da nova categoria')?.trim()
    if (!name) return
    try { const result = await cmsAction<{ category: { id: string; name: string; slug: string; description: string } }>({ action: 'category', name, slug: cmsSlugify(name) }); setData((current) => current ? { ...current, categories: [...current.categories, result.category] } : current); update({ category_id: result.category.id }); setMessage('Categoria criada.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível criar a categoria') }
  }
  const category = data.categories.find((item) => item.id === article.category_id)
  return <CmsAdminLayout user={data.user}>
    <header className="cms-page-header cms-page-header--editor"><div><p className="eyebrow eyebrow--dark"><span />{article.id ? 'Editar artigo' : 'Novo artigo'}</p><h1>{article.title || 'Artigo sem título'}</h1><p>{dirty ? 'Alterações ainda não salvas' : savedAt ? `Salvo às ${savedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Rascunho seguro no CMS'}</p></div><div className="cms-editor-actions"><button disabled={busy} onClick={() => void save()}><Save />Salvar rascunho</button>{article.id && <Link to={`/admin/artigos/${article.id}/preview`} target="_blank"><Eye />Pré-visualizar</Link>}<button className="cms-publish" disabled={busy} onClick={() => window.confirm('Publicar este artigo agora?') && void save('published')}><Check />Publicar</button></div></header>
    {message && <p className={`cms-alert ${message.includes('Não') || message.includes('Informe') ? 'cms-alert--error' : ''}`} aria-live="polite">{message}</p>}
    <div className="cms-edit-layout"><section className="cms-edit-main">
      <label className="cms-main-field">Título<input value={article.title || ''} onChange={(event) => update({ title: event.target.value, slug: article.slug || cmsSlugify(event.target.value) })} placeholder="Título do artigo" /></label>
      <label className="cms-main-field">Texto<span className="cms-field-help">Use H2 e H3 para criar automaticamente o índice. O H1 é o título acima.</span><CmsRichTextEditor value={article.content_json?.doc || { type: 'doc', content: [{ type: 'paragraph' }] }} onChange={(doc: EditorDoc) => update({ content_json: { doc } })} /></label>
      <label className="cms-main-field">Instrução de imagem<textarea value={article.image_instruction || ''} onChange={(event) => update({ image_instruction: event.target.value })} rows={5} placeholder="Descreva a cena, o contexto educacional e o que deve ser evitado." /></label>
      <div className="cms-prepare"><div className="cms-prepare__copy"><Sparkles /><strong>Preparação automática</strong><p>Salva o rascunho e sugere categoria, slug, resumo, SEO, texto alternativo e FAQs identificadas. Não reescreve nem formata o corpo do texto e nada é publicado automaticamente.</p></div><button disabled={busy || !article.title} onClick={() => void prepare()}>Salvar e preparar</button></div>
      <div className="cms-prepare"><div className="cms-prepare__copy"><WandSparkles /><strong>Padronização de formatação</strong><p>Organiza padrões explícitos como H2/H3, listas, citações e espaçamentos. Preserva as palavras, salva o rascunho primeiro e pede confirmação antes de aplicar.</p></div><div className="cms-prepare__actions"><button disabled={busy || !article.title} onClick={() => void standardize()}>Padronizar formatação</button>{formatBackup && <button type="button" disabled={busy} onClick={undoStandardize}><RotateCcw />Desfazer</button>}</div></div>
      <details className="cms-panel"><summary>Blocos editoriais</summary><div className="cms-panel__body">
        <fieldset><legend>Protocolo</legend><input placeholder="Título do protocolo" value={article.protocol_json?.title || ''} onChange={(event) => update({ protocol_json: { title: event.target.value, introduction: article.protocol_json?.introduction || '', steps: article.protocol_json?.steps || [] } })} /><textarea rows={2} placeholder="Introdução opcional" value={article.protocol_json?.introduction || ''} onChange={(event) => update({ protocol_json: { title: article.protocol_json?.title || '', introduction: event.target.value, steps: article.protocol_json?.steps || [] } })} /><textarea rows={5} placeholder={'Uma etapa por linha: Título | Descrição'} value={(article.protocol_json?.steps || []).map((step) => `${step.title} | ${step.description}`).join('\n')} onChange={(event) => update({ protocol_json: { title: article.protocol_json?.title || '', introduction: article.protocol_json?.introduction || '', steps: event.target.value.split('\n').filter(Boolean).map((line) => { const [title, ...rest] = line.split('|'); return { title: title.trim(), description: rest.join('|').trim() } }) } })} /></fieldset>
        <fieldset><legend>Checklist</legend><textarea rows={6} placeholder="Um item por linha" value={(article.checklist_json || []).join('\n')} onChange={(event) => update({ checklist_json: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} /></fieldset>
        <fieldset><legend>Perguntas frequentes</legend>{(article.faq_json || []).map((item, index) => <div className="cms-repeat" key={index}><input aria-label={`Pergunta ${index + 1}`} placeholder="Pergunta" value={item.question} onChange={(event) => updateFaq(index, { question: event.target.value })} /><textarea aria-label={`Resposta ${index + 1}`} placeholder="Resposta" value={item.answer} onChange={(event) => updateFaq(index, { answer: event.target.value })} /><button type="button" onClick={() => update({ faq_json: article.faq_json?.filter((_, current) => current !== index) })}>Remover</button></div>)}<button type="button" onClick={() => update({ faq_json: [...(article.faq_json || []), { question: '', answer: '' }] })}>Adicionar pergunta</button></fieldset>
        <fieldset><legend>CTA intermediário</legend><select value={article.cta_heading_id || ''} onChange={(event) => update({ cta_heading_id: event.target.value || null })}><option value="">Não inserir</option>{headings.map((heading) => <option key={heading.id} value={heading.id}>Depois de: {heading.label}</option>)}</select><input placeholder="Título do CTA" value={article.cta_json?.title || ''} onChange={(event) => update({ cta_json: { title: event.target.value, text: article.cta_json?.text || '', label: article.cta_json?.label || 'Fazer meu Radar Docente', href: article.cta_json?.href || '/radar' } })} /><textarea placeholder="Texto do CTA" value={article.cta_json?.text || ''} onChange={(event) => update({ cta_json: { title: article.cta_json?.title || '', text: event.target.value, label: article.cta_json?.label || 'Fazer meu Radar Docente', href: article.cta_json?.href || '/radar' } })} /></fieldset>
      </div></details>
    </section><aside className="cms-edit-aside">
      <section className="cms-cover-panel"><h2>Imagem de capa</h2>{article.cover_image_url ? <img src={article.cover_image_url} alt={article.cover_image_alt || 'Prévia da capa'} /> : <div><ImageIcon /><span>Nenhuma imagem</span></div>}<p>Status: <strong>{article.cover_image_status === 'approved' ? 'Aprovada' : article.cover_image_status === 'uploaded' ? 'Enviada' : article.cover_image_status === 'generated' ? 'Aguardando aprovação' : 'Ausente'}</strong></p><button disabled={busy} onClick={() => void cover('generate')}><Sparkles />{article.cover_image_url ? 'Gerar novamente' : 'Gerar imagem'}</button><button disabled={busy} onClick={() => fileRef.current?.click()}><Upload />Substituir por upload</button><input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event.target.files?.[0])} />{article.cover_image_status === 'generated' && <button disabled={busy} onClick={() => void cover('approve')}><Check />Aprovar imagem</button>}{article.cover_image_url && <button disabled={busy} onClick={() => void cover('remove')}>Remover imagem</button>}</section>
      <details className="cms-panel" open><summary>SEO e publicação</summary><div className="cms-panel__body">
        <label>Categoria<select value={article.category_id || ''} onChange={(event) => update({ category_id: event.target.value })}><option value="">Selecione</option>{data.categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>{data.user.role === 'admin' && <button type="button" onClick={() => void createCategory()}>Criar categoria</button>}
        <label>Slug<input value={article.slug || ''} onChange={(event) => update({ slug: cmsSlugify(event.target.value) })} /><small>https://www.radarpraxia.com/blog/{category?.slug || 'categoria'}/{article.slug || 'slug'}</small></label>
        <label>Meta title<input value={article.meta_title || ''} onChange={(event) => update({ meta_title: event.target.value })} /><small className={(article.meta_title?.length || 0) > 60 ? 'is-warning' : ''}>{article.meta_title?.length || 0}/60 caracteres</small></label>
        <label>Meta description<textarea rows={4} value={article.meta_description || ''} onChange={(event) => update({ meta_description: event.target.value })} /><small className={(article.meta_description?.length || 0) > 160 ? 'is-warning' : ''}>{article.meta_description?.length || 0}/160 caracteres</small></label>
        <label>Resumo<textarea rows={4} value={article.excerpt || ''} onChange={(event) => update({ excerpt: event.target.value })} /></label><label>Texto alternativo<input value={article.cover_image_alt || ''} onChange={(event) => update({ cover_image_alt: event.target.value })} /></label>
        <label>Autor<select value={article.author_id || data.user.id} disabled={data.user.role !== 'admin'} onChange={(event) => update({ author_id: event.target.value })}>{data.profiles.map((profile) => <option value={profile.id} key={profile.id}>{profile.display_name}</option>)}</select></label>
        <fieldset><legend>Artigos relacionados</legend><p className="cms-field-help">Selecione até três. A seleção manual tem prioridade sobre a sugestão automática.</p>{(data.articles || []).filter((item) => item.id !== article.id && item.status === 'published').map((item) => <label className="cms-check" key={item.id}><input type="checkbox" checked={Boolean(article.related_article_ids?.includes(item.id))} disabled={!article.related_article_ids?.includes(item.id) && (article.related_article_ids?.length || 0) + (article.legacy_related_paths?.length || 0) >= 3} onChange={(event) => update({ related_article_ids: event.target.checked ? [...(article.related_article_ids || []), item.id].slice(0, 3) : article.related_article_ids?.filter((current) => current !== item.id) })} />{item.title}</label>)}{legacyArticles.map((item) => <label className="cms-check" key={item.path}><input type="checkbox" checked={Boolean(article.legacy_related_paths?.includes(item.path))} disabled={!article.legacy_related_paths?.includes(item.path) && (article.related_article_ids?.length || 0) + (article.legacy_related_paths?.length || 0) >= 3} onChange={(event) => update({ legacy_related_paths: event.target.checked ? [...(article.legacy_related_paths || []), item.path].slice(0, 3) : article.legacy_related_paths?.filter((current) => current !== item.path) })} />{item.title}</label>)}</fieldset>
        <label className="cms-check"><input type="checkbox" checked={article.show_table_of_contents !== false} onChange={(event) => update({ show_table_of_contents: event.target.checked })} />Exibir índice navegável</label><label className="cms-check"><input type="checkbox" checked={Boolean(article.show_editorial_notice)} onChange={(event) => update({ show_editorial_notice: event.target.checked })} />Exibir aviso editorial</label>{article.show_editorial_notice && <textarea rows={4} placeholder="Deixe vazio para usar o aviso padrão" value={article.editorial_notice_text || ''} onChange={(event) => update({ editorial_notice_text: event.target.value })} />}
        <label>Status<select value={article.status || 'draft'} onChange={(event) => update({ status: event.target.value as CmsArticle['status'] })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived" disabled={data.user.role !== 'admin'}>Arquivado</option></select></label>
      </div></details>
      {article.status === 'published' && <button className="cms-danger-action" disabled={busy} onClick={() => window.confirm('Despublicar e voltar para rascunho?') && void save('draft')}>Despublicar</button>}{data.user.role === 'admin' && article.id && <button className="cms-danger-action" disabled={busy} onClick={() => window.confirm('Arquivar este artigo?') && void save('archived')}><Archive />Arquivar</button>}
    </aside></div>
  </CmsAdminLayout>
}
