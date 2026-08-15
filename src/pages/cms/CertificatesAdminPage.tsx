import { Download, ExternalLink, Plus, RotateCcw, Search, ShieldX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { CmsAdminLayout } from '../../components/CmsAdminLayout'
import { currentSession } from '../../services/cmsApi'
import { issueCertificate, listCertificates, revokeCertificate } from '../../services/certificateApi'
import { downloadCertificatePdf } from '../../services/certificatePdf'
import type { Certificate } from '../../types/certificate'
import type { CmsUser } from '../../types/cms'

export function CertificatesAdminPage() {
  const [user, setUser] = useState<CmsUser | null>(null); const [items, setItems] = useState<Certificate[]>([]); const [loading, setLoading] = useState(true)
  const [error, setError] = useState(''); const [name, setName] = useState(''); const [eventDate, setEventDate] = useState(''); const [search, setSearch] = useState(''); const [saving, setSaving] = useState(false)
  useEffect(() => { Promise.all([currentSession(), listCertificates()]).then(([session, result]) => { setUser(session.user); setItems(result.certificates) }).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar')).finally(() => setLoading(false)) }, [])
  const filtered = useMemo(() => items.filter((item) => `${item.nome_participante} ${item.codigo_validacao}`.toLowerCase().includes(search.toLowerCase())), [items, search])
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setSaving(true); try { const { certificate } = await issueCertificate(name, eventDate); setItems((current) => [certificate, ...current]); setName(''); await downloadCertificatePdf(certificate) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Emissão não concluída') } finally { setSaving(false) } }
  async function revoke(item: Certificate) { if (!item.id || !window.confirm(`Revogar o certificado de ${item.nome_participante}?`)) return; setError(''); try { await revokeCertificate(item.id); setItems((current) => current.map((certificate) => certificate.id === item.id ? { ...certificate, status: 'revogado' } : certificate)) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Revogação não concluída') } }
  if (loading) return <main className="cms-loading">Carregando certificados…</main>
  if (!user || error.includes('sessão') || error.includes('autoriz')) return <Navigate to="/admin/login" replace />
  return <CmsAdminLayout user={user}><header className="cms-page-header"><div><p className="eyebrow eyebrow--dark"><span />Credenciais PraxIA</p><h1>Certificados</h1><p>Emita, baixe e acompanhe certificados do workshop.</p></div></header>
    {error && <p className="cms-alert cms-alert--error">{error}</p>}
    <section className="certificate-admin-form"><div><span>Emissão individual</span><h2>IA na Prática Docente</h2><p>Certificado nominal de 4 horas com código exclusivo e QR Code.</p></div><form onSubmit={(event) => void submit(event)}><label>Nome completo<input required minLength={3} maxLength={160} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do participante" /></label><label>Data de realização<input required type="date" max={new Date().toISOString().slice(0, 10)} value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label><button className="button-link button-link--primary" disabled={saving}><Plus />{saving ? 'Emitindo…' : 'Emitir e baixar PDF'}</button></form></section>
    <section className="certificate-admin-list"><div className="certificate-admin-list__toolbar"><div><h2>Certificados emitidos</h2><span>{items.length} credencial(is)</span></div><label><Search /><span className="sr-only">Buscar certificados</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou código" /></label></div>
      <div className="certificate-admin-table"><div className="certificate-admin-table__head"><span>Participante</span><span>Realização</span><span>Status</span><span>Ações</span></div>{filtered.map((item) => <article key={item.codigo_validacao}><div><strong>{item.nome_participante}</strong><code>{item.codigo_validacao}</code></div><time>{new Date(`${item.data_realizacao}T12:00:00`).toLocaleDateString('pt-BR')}</time><span className={`certificate-admin-status certificate-admin-status--${item.status}`}>{item.status}</span><div><a title="Abrir validação" href={`/certificados/${item.codigo_validacao}`} target="_blank" rel="noreferrer"><ExternalLink /></a><button title="Baixar PDF" onClick={() => void downloadCertificatePdf(item)}><Download /></button>{item.status === 'emitido' && <button className="is-danger" title="Revogar certificado" onClick={() => void revoke(item)}><ShieldX /></button>}</div></article>)}{filtered.length === 0 && <p className="certificate-admin-empty"><RotateCcw />Nenhum certificado encontrado.</p>}</div>
    </section>
  </CmsAdminLayout>
}
