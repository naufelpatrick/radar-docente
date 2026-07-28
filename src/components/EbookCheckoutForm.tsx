import { FormEvent, useState } from 'react'
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EbookCheckoutForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/ebook/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email') }),
      })
      const body = await response.json()
      if (!response.ok || !body.checkoutUrl) throw new Error(body.error || 'Falha ao iniciar pagamento.')
      window.location.assign(body.checkoutUrl)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível iniciar o pagamento.')
      setStatus('error')
    }
  }

  return (
    <form className="ebook-checkout" onSubmit={submit}>
      <div>
        <p className="eyebrow eyebrow--dark">ACESSO DIGITAL</p>
        <h2>Receba o caderno completo por R$ 19,90.</h2>
        <p>Informe seus dados para seguir ao ambiente seguro de pagamento do ASAAS. Você poderá escolher Pix ou cartão de crédito.</p>
      </div>
      <label htmlFor="ebook-name">Nome completo</label>
      <input id="ebook-name" name="name" autoComplete="name" minLength={3} required />
      <label htmlFor="ebook-email">E-mail para identificar a compra</label>
      <input id="ebook-email" name="email" type="email" autoComplete="email" required />
      <p className="form-privacy-notice">
        Usaremos estes dados para processar a compra e liberar o acesso. Consulte a <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? <LoaderCircle className="spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
        {status === 'sending' ? 'Preparando pagamento…' : 'Comprar por R$ 19,90'}
        {status !== 'sending' && <ArrowRight aria-hidden="true" />}
      </button>
      <small>Pagamento único. O arquivo é liberado após a confirmação do ASAAS.</small>
      <div className="form-submit-status" role="status" aria-live="polite">{error && <p>{error}</p>}</div>
    </form>
  )
}
