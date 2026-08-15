import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CmsAdminLayout } from '../../components/CmsAdminLayout'
import { cmsAction, loadCms, type CmsPayload } from '../../services/cmsApi'

export function CmsSettingsPage() {
  const [data, setData] = useState<CmsPayload | null>(null); const [settings, setSettings] = useState<Record<string, unknown>>({}); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false)
  useEffect(() => { void loadCms().then((payload) => { setData(payload); setSettings(payload.settings) }).catch((error) => setMessage(error instanceof Error ? error.message : 'Não foi possível carregar') ) }, [])
  if (message.includes('sessão') || message.includes('autoriz')) return <Navigate to="/admin/login" replace />
  if (!data) return <main className="cms-loading">{message || 'Carregando configurações…'}</main>
  if (data.user.role !== 'admin') return <Navigate to="/admin" replace />
  const cta = (settings.default_cta || {}) as Record<string, string>; const publisher = (settings.publisher || {}) as Record<string, string>
  async function save() { setBusy(true); setMessage(''); try { const result = await cmsAction<{ settings: Record<string, unknown> }>({ action: 'settings', settings }); setSettings(result.settings); setMessage('Configurações atualizadas.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível salvar') } finally { setBusy(false) } }
  return <CmsAdminLayout user={data.user}><header className="cms-page-header"><div><p className="eyebrow eyebrow--dark"><span />Administração</p><h1>Configurações editoriais</h1><p>Diretivas globais usadas na criação, publicação e marcação estruturada.</p></div><button className="button-link button-link--primary" disabled={busy} onClick={() => void save()}><Save />Salvar</button></header>{message && <p className="cms-alert">{message}</p>}<section className="cms-settings">
    <label>Diretiva global da imagem<textarea rows={14} value={String(settings.image_directive || '')} onChange={(event) => setSettings({ ...settings, image_directive: event.target.value })} /></label>
    <label>Aviso editorial padrão<textarea rows={5} value={String(settings.editorial_notice || '')} onChange={(event) => setSettings({ ...settings, editorial_notice: event.target.value })} /></label>
    <fieldset><legend>CTA padrão</legend><label>Título<input value={cta.title || ''} onChange={(event) => setSettings({ ...settings, default_cta: { ...cta, title: event.target.value } })} /></label><label>Texto<textarea value={cta.text || ''} onChange={(event) => setSettings({ ...settings, default_cta: { ...cta, text: event.target.value } })} /></label><label>Botão<input value={cta.label || ''} onChange={(event) => setSettings({ ...settings, default_cta: { ...cta, label: event.target.value } })} /></label><label>Destino<input value={cta.href || ''} onChange={(event) => setSettings({ ...settings, default_cta: { ...cta, href: event.target.value } })} /></label></fieldset>
    <fieldset><legend>Publisher e schemas</legend><label>Organização<input value={publisher.name || ''} onChange={(event) => setSettings({ ...settings, publisher: { ...publisher, name: event.target.value } })} /></label><label>Site<input value={publisher.url || ''} onChange={(event) => setSettings({ ...settings, publisher: { ...publisher, url: event.target.value } })} /></label><label>Logo<input value={publisher.logo || ''} onChange={(event) => setSettings({ ...settings, publisher: { ...publisher, logo: event.target.value } })} /></label></fieldset>
    <label>Quantidade de artigos relacionados<input type="number" min="1" max="6" value={Number(settings.related_articles_limit || 3)} onChange={(event) => setSettings({ ...settings, related_articles_limit: Number(event.target.value) })} /></label>
  </section></CmsAdminLayout>
}
