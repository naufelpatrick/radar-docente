import { FormEvent, useState } from 'react'
import { ArrowRight, Download, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const teachingProfiles = [
  ['fundamental', 'Professor(a) do Ensino Fundamental'],
  ['medio', 'Professor(a) do Ensino Médio'],
  ['superior', 'Professor(a) do Ensino Superior'],
  ['tecnico', 'Professor(a) do Ensino Técnico'],
  ['outro', 'Professor(a) de outra etapa ou modalidade'],
  ['nao_professor', 'Não sou professor(a)'],
] as const

export function EbookCheckoutForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ready' | 'error'>('idle')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/ebook/free-download', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          teachingProfile: form.get('teachingProfile'),
          email: form.get('email'),
          phone: form.get('phone'),
          messagingConsent: form.get('messagingConsent') === 'on',
          website: form.get('website'),
        }),
      })
      const body = await response.json()
      if (!response.ok || !body.downloadUrl) throw new Error(body.error || 'Não foi possível liberar o e-book.')
      setDownloadUrl(body.downloadUrl)
      setStatus('ready')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível liberar o e-book.')
      setStatus('error')
    }
  }

  if (status === 'ready') {
    return (
      <div className="ebook-checkout ebook-checkout--ready">
        <div>
          <p className="eyebrow eyebrow--dark">DOWNLOAD LIBERADO</p>
          <h2>Seu e-book está pronto.</h2>
          <p>O link é temporário. Se ele expirar, basta preencher o formulário novamente.</p>
        </div>
        <a className="button-link button-link--primary" href={downloadUrl} target="_blank" rel="noopener noreferrer">
          <Download aria-hidden="true" />Baixar e-book gratuito
        </a>
      </div>
    )
  }

  return (
    <form className="ebook-checkout" onSubmit={submit}>
      <div>
        <p className="eyebrow eyebrow--dark">DOWNLOAD GRATUITO</p>
        <h2>Preencha para receber acesso imediato.</h2>
        <p>Conte um pouco sobre você e baixe gratuitamente o caderno completo.</p>
      </div>
      <label htmlFor="ebook-name">Nome completo</label>
      <input id="ebook-name" name="name" autoComplete="name" minLength={2} required />
      <label htmlFor="ebook-profile">Qual é o seu perfil?</label>
      <select id="ebook-profile" name="teachingProfile" required defaultValue="">
        <option value="" disabled>Selecione uma opção</option>
        {teachingProfiles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label htmlFor="ebook-email">E-mail</label>
      <input id="ebook-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="ebook-phone">Telefone com DDD</label>
      <input id="ebook-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" required />
      <label className="form-consent" htmlFor="ebook-messaging-consent">
        <input id="ebook-messaging-consent" name="messagingConsent" type="checkbox" required />
        <span>Concordo em receber mensagens da PráxIA por e-mail e telefone/WhatsApp sobre conteúdos, produtos e eventos. Posso cancelar a qualquer momento.</span>
      </label>
      <input className="form-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="form-privacy-notice">
        Seus dados serão usados para liberar o material e enviar as mensagens autorizadas. Consulte a <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? <LoaderCircle className="spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
        {status === 'sending' ? 'Liberando acesso…' : 'Quero baixar gratuitamente'}
        {status !== 'sending' && <ArrowRight aria-hidden="true" />}
      </button>
      <div className="form-submit-status" role="status" aria-live="polite">{error && <p>{error}</p>}</div>
    </form>
  )
}
