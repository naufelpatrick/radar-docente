import { useState, type FormEvent } from 'react'
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react'
import { startWorkshopCheckout } from '../services/workshopRegistrationService'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digits = (value: string) => value.replace(/\D/g, '')

function validCpf(value: string) {
  const cpf = digits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const digit = (length: number) => { let sum = 0; for (let i = 0; i < length; i += 1) sum += Number(cpf[i]) * (length + 1 - i); const result = (sum * 10) % 11; return result === 10 ? 0 : result }
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10])
}

export function WorkshopRegistrationForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input = { nome: String(form.get('nome') || '').trim(), email: String(form.get('email') || '').trim(), cpf: String(form.get('cpf') || ''), telefone: String(form.get('telefone') || '') }
    if (input.nome.length < 3) return setError('Informe seu nome completo.')
    if (!emailPattern.test(input.email)) return setError('Informe um e-mail válido.')
    if (!validCpf(input.cpf)) return setError('Informe um CPF válido.')
    if (digits(input.telefone).length < 10) return setError('Informe um telefone com DDD.')
    setStatus('sending'); setError('')
    try {
      const checkout = await startWorkshopCheckout(input)
      sessionStorage.setItem('praxia:workshop:confirmation-url', checkout.confirmationUrl)
      window.location.assign(checkout.checkoutUrl)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível iniciar o pagamento.')
      setStatus('error')
    }
  }

  return <form className="workshop-registration-form" onSubmit={submit} noValidate>
    <div><span>INSCRIÇÃO</span><h2>Garanta sua vaga.</h2><p>Preencha seus dados para seguir ao ambiente seguro do ASAAS.</p></div>
    <label>Nome completo<input name="nome" autoComplete="name" required /></label>
    <label>E-mail<input name="email" type="email" inputMode="email" autoComplete="email" required /></label>
    <div className="workshop-registration-form__row">
      <label>CPF<input name="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" required /></label>
      <label>Telefone/WhatsApp<input name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" required /></label>
    </div>
    <p className="workshop-registration-form__privacy"><LockKeyhole aria-hidden="true" /> Seus dados são enviados com segurança e não aparecem na URL. Consulte a <a href="/privacidade">Política de Privacidade</a>.</p>
    <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? <LoaderCircle className="spin" aria-hidden="true" /> : null}{status === 'sending' ? 'Preparando pagamento…' : 'QUERO ME INSCREVER — R$ 50'}{status !== 'sending' && <ArrowRight aria-hidden="true" />}</button>
    {error && <p className="workshop-registration-form__error" role="alert">{error}</p>}
    <small>Pagamento via Pix ou cartão. A vaga é confirmada pelo webhook do ASAAS.</small>
  </form>
}
