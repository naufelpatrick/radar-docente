import { useCallback, useEffect, useState } from 'react'
import { CalendarClock, Check, ExternalLink, RefreshCw, Send, ShieldCheck } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'

type DistributionStatus = 'draft' | 'approved' | 'scheduled' | 'publishing' | 'published' | 'error'

type DistributionItem = {
  id: string
  article_title: string
  article_url: string
  article_category: string
  article_image_url: string | null
  instagram_caption: string
  facebook_caption: string
  status: DistributionStatus
  scheduled_for: string | null
  error_message: string | null
  created_at: string
}

const labels: Record<DistributionStatus, string> = {
  draft: 'Aguardando revisão',
  approved: 'Aprovado',
  scheduled: 'Agendado',
  publishing: 'Publicando',
  published: 'Publicado',
  error: 'Requer atenção',
}

export function DistributionAdminPage() {
  const [key, setKey] = useState(() => sessionStorage.getItem('praxia_distribution_key') || '')
  const [accessKey, setAccessKey] = useState(key)
  const [items, setItems] = useState<DistributionItem[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const api = useCallback(async (body?: object) => {
    const response = await fetch('/api/admin/distribution', {
      method: body ? 'POST' : 'GET',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a ação')
    return result
  }, [key])

  const load = useCallback(async () => {
    if (!key) return
    try {
      const result = await api()
      setItems(result.items)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao carregar')
    }
  }, [api, key])

  useEffect(() => {
    if (!key) return
    void api()
      .then((result) => setItems(result.items))
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Erro ao carregar'))
  }, [api, key])

  function enter() {
    sessionStorage.setItem('praxia_distribution_key', accessKey)
    setKey(accessKey)
  }

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true)
    setMessage('')
    try {
      await action()
      setMessage(success)
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro inesperado')
    } finally {
      setBusy(false)
    }
  }

  function changeItem(id: string, changes: Partial<DistributionItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
  }

  if (!key) {
    return (
      <main className="distribution-login">
        <section aria-labelledby="distribution-login-title">
          <BrandMark />
          <ShieldCheck aria-hidden="true" />
          <p className="eyebrow eyebrow--dark"><span />Área restrita</p>
          <h1 id="distribution-login-title">Distribuição de conteúdo</h1>
          <p>Informe a chave administrativa configurada para acessar a fila de publicações.</p>
          <label htmlFor="distribution-key">Chave de acesso</label>
          <input id="distribution-key" type="password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && enter()} />
          <button className="button-link button-link--primary" type="button" onClick={enter}>Entrar</button>
        </section>
      </main>
    )
  }

  return (
    <main className="distribution-admin">
      <header className="distribution-admin__header">
        <div className="shell">
          <BrandMark />
          <div>
            <p className="eyebrow"><span />Agente PráxIA</p>
            <h1>Distribuição de conteúdo</h1>
            <p>Revise, aprove e publique artigos no Instagram e Facebook.</p>
          </div>
          <button type="button" disabled={busy} onClick={() => void run(() => api({ action: 'sync' }), 'RSS sincronizado.')}>
            <RefreshCw aria-hidden="true" /> Sincronizar RSS
          </button>
        </div>
      </header>

      <section className="shell distribution-admin__content" aria-live="polite">
        {message && <p className="distribution-message">{message}</p>}
        {!items.length && <div className="distribution-empty">Nenhum artigo na fila. Sincronize o RSS para começar.</div>}
        {items.map((item) => (
          <article className="distribution-card" key={item.id}>
            <div className="distribution-card__summary">
              {item.article_image_url && <img src={item.article_image_url} alt="" />}
              <div>
                <span className={`distribution-status distribution-status--${item.status}`}>{labels[item.status]}</span>
                <small>{item.article_category}</small>
                <h2>{item.article_title}</h2>
                <a href={item.article_url} target="_blank" rel="noreferrer">Abrir artigo <ExternalLink aria-hidden="true" /></a>
              </div>
            </div>

            <div className="distribution-card__editors">
              <label>Legenda do Instagram
                <textarea value={item.instagram_caption} onChange={(event) => changeItem(item.id, { instagram_caption: event.target.value })} />
              </label>
              <label>Texto do Facebook
                <textarea value={item.facebook_caption} onChange={(event) => changeItem(item.id, { facebook_caption: event.target.value })} />
              </label>
            </div>

            {item.error_message && <p className="distribution-error">{item.error_message}</p>}
            <div className="distribution-card__actions">
              <button type="button" disabled={busy || item.status === 'published'} onClick={() => void run(
                () => api({ action: 'update', id: item.id, changes: { instagram_caption: item.instagram_caption, facebook_caption: item.facebook_caption, status: 'approved' } }),
                'Rascunho salvo e aprovado.',
              )}><Check aria-hidden="true" /> Salvar e aprovar</button>
              <label className="distribution-schedule"><CalendarClock aria-hidden="true" /><span>Agendar</span>
                <input type="datetime-local" value={item.scheduled_for?.slice(0, 16) || ''} onChange={(event) => changeItem(item.id, { scheduled_for: event.target.value })} />
              </label>
              <button type="button" disabled={busy || !item.scheduled_for || item.status === 'published'} onClick={() => void run(
                () => api({ action: 'update', id: item.id, changes: { instagram_caption: item.instagram_caption, facebook_caption: item.facebook_caption, status: 'scheduled', scheduled_for: new Date(item.scheduled_for!).toISOString() } }),
                'Publicação agendada.',
              )}>Confirmar agenda</button>
              <button className="distribution-publish" type="button" disabled={busy || item.status === 'published'} onClick={() => window.confirm('Publicar agora no Instagram e Facebook?') && void run(
                () => api({ action: 'publish', id: item.id }),
                'Conteúdo publicado nas duas redes.',
              )}><Send aria-hidden="true" /> Publicar agora</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
