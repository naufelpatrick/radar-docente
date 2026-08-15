import { useCallback, useEffect, useState } from 'react'
import { CalendarClock, Check, ExternalLink, ImageIcon, RefreshCw, RotateCcw, Send, ShieldCheck } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { channelImageError, type DistributionChannel } from '../services/distributionImages'

type DistributionStatus = 'draft' | 'approved' | 'scheduled' | 'publishing' | 'published' | 'error'
type ChannelStatus = 'pending' | 'published' | 'error'

type DistributionItem = {
  id: string
  article_title: string
  article_url: string
  article_category: string
  article_image_url: string | null
  instagram_image_url: string | null
  facebook_image_url: string | null
  instagram_caption: string
  facebook_caption: string
  linkedin_caption: string
  instagram_enabled: boolean
  facebook_enabled: boolean
  linkedin_enabled: boolean
  instagram_status: ChannelStatus
  facebook_status: ChannelStatus
  linkedin_status: ChannelStatus
  instagram_error: string | null
  facebook_error: string | null
  linkedin_error: string | null
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

const channelLabels: Record<ChannelStatus, string> = {
  pending: 'Pendente',
  published: 'Publicado',
  error: 'Erro',
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

  function imagePreview(item: DistributionItem, channel: DistributionChannel) {
    const isInstagram = channel === 'instagram'
    const isLinkedIn = channel === 'linkedin'
    const channelName = isInstagram ? 'Instagram' : isLinkedIn ? 'LinkedIn' : 'Facebook'
    const imageUrl = isLinkedIn ? item.instagram_image_url : item[`${channel}_image_url`]
    const status = item[`${channel}_status`]
    const enabled = item[`${channel}_enabled`] !== false
    const validation = channelImageError(item, channel)
    return (
      <section className={`distribution-channel distribution-channel--${channel}`} aria-labelledby={`${item.id}-${channel}-title`}>
        <div className="distribution-channel__heading">
          <div>
            <h3 id={`${item.id}-${channel}-title`}>{channelName}</h3>
            <small>{isInstagram ? '1080 × 1350 · proporção 4:5' : isLinkedIn ? 'Reutiliza a imagem vertical do Instagram' : '1200 × 630 · proporção 1.91:1'}</small>
          </div>
          <span className={`distribution-channel-status distribution-channel-status--${status}`}>
            {channelLabels[status || 'pending']}
          </span>
        </div>
        <label className="distribution-channel__selector">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => changeItem(item.id, { [`${channel}_enabled`]: event.target.checked })}
          />
          <span>Incluir {channelName} na publicação</span>
        </label>
        <div className="distribution-channel__preview">
          {imageUrl ? (
            <img src={imageUrl} alt={`Prévia da arte de ${channelName} para “${item.article_title}”`} />
          ) : (
            <div className="distribution-channel__missing"><ImageIcon aria-hidden="true" /><span>Imagem ausente</span></div>
          )}
        </div>
        <label htmlFor={`${item.id}-${channel}-url`}>{isLinkedIn ? 'Imagem vinculada ao Instagram' : 'URL HTTPS da imagem'}</label>
        {isLinkedIn ? (
          <output id={`${item.id}-${channel}-url`} className="distribution-channel__linked-image">{imageUrl || 'Aguardando imagem do Instagram'}</output>
        ) : (
          <input
            id={`${item.id}-${channel}-url`}
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={imageUrl || ''}
            aria-describedby={`${item.id}-${channel}-help`}
            onChange={(event) => changeItem(item.id, { [`${channel}_image_url`]: event.target.value || null })}
          />
        )}
        <p id={`${item.id}-${channel}-help`} className={validation ? 'distribution-channel__validation' : 'distribution-channel__ready'}>
          {validation || 'Imagem válida e exclusiva para este canal.'}
        </p>
        {item[`${channel}_error`] && <p className="distribution-channel__validation">{item[`${channel}_error`]}</p>}
        <label htmlFor={`${item.id}-${channel}-caption`}>
          {isInstagram ? 'Legenda publicada com esta imagem' : `Texto publicado no ${channelName} com esta imagem`}
        </label>
        <textarea
          id={`${item.id}-${channel}-caption`}
          className="distribution-channel__caption"
          value={item[`${channel}_caption`]}
          onChange={(event) => changeItem(item.id, { [`${channel}_caption`]: event.target.value })}
        />
        <div className="distribution-channel__actions">
          {!isLinkedIn && <button type="button" disabled={busy} onClick={() => void run(
            () => api({ action: 'generate_image', id: item.id, channel }),
            `Nova arte de ${channelName} gerada.`,
          )}><RotateCcw aria-hidden="true" /> {imageUrl ? 'Gerar novamente' : 'Gerar imagem'}</button>}
          <button type="button" disabled={busy || !enabled || Boolean(validation) || status === 'published'} onClick={() => window.confirm(`Publicar somente no ${channelName}?`) && void run(
            () => api({ action: 'update', id: item.id, changes: {
              instagram_caption: item.instagram_caption,
              facebook_caption: item.facebook_caption,
              linkedin_caption: item.linkedin_caption,
              instagram_image_url: item.instagram_image_url,
              facebook_image_url: item.facebook_image_url,
              instagram_enabled: item.instagram_enabled,
              facebook_enabled: item.facebook_enabled,
              linkedin_enabled: item.linkedin_enabled,
            } }).then(() => api({ action: 'publish', id: item.id, channels: [channel] })),
            `Conteúdo enviado ao ${channelName}.`,
          )}><Send aria-hidden="true" /> Publicar imagem + {isInstagram ? 'legenda' : 'texto'}</button>
        </div>
      </section>
    )
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
            <p className="eyebrow"><span />Agente PraxIA</p>
            <h1>Distribuição de conteúdo</h1>
            <p>Revise, aprove e publique artigos no Instagram, Facebook e LinkedIn.</p>
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
              {item.article_image_url && <img src={item.article_image_url} alt={`Social Graph do artigo “${item.article_title}”`} />}
              <div>
                <span className={`distribution-status distribution-status--${item.status}`}>{labels[item.status]}</span>
                <small>{item.article_category}</small>
                <h2>{item.article_title}</h2>
                <a href={item.article_url} target="_blank" rel="noreferrer">Abrir artigo <ExternalLink aria-hidden="true" /></a>
              </div>
            </div>

            <section className="distribution-images" aria-labelledby={`${item.id}-images-title`}>
              <div className="distribution-images__intro">
                <p className="eyebrow eyebrow--dark"><span />Publicação social</p>
                <h2 id={`${item.id}-images-title`}>Imagens por canal</h2>
                <p>Cada rede recebe uma composição própria. O Social Graph acima permanece separado para SEO.</p>
              </div>
              <div className="distribution-images__grid">
                {imagePreview(item, 'instagram')}
                {imagePreview(item, 'facebook')}
                {imagePreview(item, 'linkedin')}
              </div>
            </section>

            {item.error_message && <p className="distribution-error">{item.error_message}</p>}
            <div className="distribution-card__actions">
              <button type="button" disabled={busy || item.status === 'published'} onClick={() => void run(
                () => api({ action: 'update', id: item.id, changes: {
                  instagram_caption: item.instagram_caption,
                  facebook_caption: item.facebook_caption,
                  linkedin_caption: item.linkedin_caption,
                  instagram_image_url: item.instagram_image_url,
                  facebook_image_url: item.facebook_image_url,
                  instagram_enabled: item.instagram_enabled,
                  facebook_enabled: item.facebook_enabled,
                  linkedin_enabled: item.linkedin_enabled,
                  status: 'approved',
                } }),
                'Rascunho salvo e aprovado.',
              )}><Check aria-hidden="true" /> Salvar e aprovar</button>
              <label className="distribution-schedule"><CalendarClock aria-hidden="true" /><span>Agendar</span>
                <input type="datetime-local" value={item.scheduled_for?.slice(0, 16) || ''} onChange={(event) => changeItem(item.id, { scheduled_for: event.target.value })} />
              </label>
              <button type="button" disabled={busy || !item.scheduled_for || item.status === 'published'} onClick={() => void run(
                () => api({ action: 'update', id: item.id, changes: {
                  instagram_caption: item.instagram_caption,
                  facebook_caption: item.facebook_caption,
                  linkedin_caption: item.linkedin_caption,
                  instagram_enabled: item.instagram_enabled,
                  facebook_enabled: item.facebook_enabled,
                  linkedin_enabled: item.linkedin_enabled,
                  status: 'scheduled',
                  scheduled_for: new Date(item.scheduled_for!).toISOString(),
                } }),
                'Publicação agendada.',
              )}>Confirmar agenda</button>
              <button className="distribution-publish" type="button" disabled={
                busy || item.status === 'published'
                || (item.instagram_enabled && Boolean(channelImageError(item, 'instagram')))
                || (item.facebook_enabled && Boolean(channelImageError(item, 'facebook')))
                || (item.linkedin_enabled && Boolean(channelImageError(item, 'linkedin')))
              } onClick={() => window.confirm('Publicar agora nos canais ainda pendentes?') && void run(
                () => api({ action: 'update', id: item.id, changes: {
                  instagram_caption: item.instagram_caption,
                  facebook_caption: item.facebook_caption,
                  linkedin_caption: item.linkedin_caption,
                  instagram_image_url: item.instagram_image_url,
                  facebook_image_url: item.facebook_image_url,
                  instagram_enabled: item.instagram_enabled,
                  facebook_enabled: item.facebook_enabled,
                  linkedin_enabled: item.linkedin_enabled,
                } }).then(() => api({ action: 'publish', id: item.id })),
                'Conteúdo enviado aos canais selecionados.',
              )}><Send aria-hidden="true" /> Publicar agora</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
