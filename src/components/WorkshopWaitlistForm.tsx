import { useId, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import {
  submitWorkshopWaitlistLead,
  validateWorkshopWaitlistLead,
  WorkshopWaitlistDuplicateError,
  WorkshopWaitlistIntegrationUnavailableError,
} from '../services/workshopWaitlistService'
import type { WorkshopWaitlistErrors, WorkshopWaitlistLead } from '../types/workshopWaitlist'

const initialLead: WorkshopWaitlistLead = {
  nome: '', email: '', etapaEnsino: '', duvidaPrincipal: '', topaPagar: '',
}

type Props = { compact?: boolean; submitLabel?: string }

export function WorkshopWaitlistForm({ compact = false, submitLabel = 'Entrar na lista de espera' }: Props) {
  const id = useId()
  const [lead, setLead] = useState(initialLead)
  const [errors, setErrors] = useState<WorkshopWaitlistErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function update<K extends keyof WorkshopWaitlistLead>(key: K, value: WorkshopWaitlistLead[K]) {
    setLead((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateWorkshopWaitlistLead(lead)
    setErrors(validation)
    if (Object.keys(validation).length) return

    setStatus('submitting')
    const params = new URLSearchParams(window.location.search)
    try {
      await submitWorkshopWaitlistLead({
        ...lead,
        utmSource: params.get('utm_source') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
      })
      setStatus('success')
      setMessage('Você está na lista! Avisaremos assim que a data for confirmada.')
      setLead(initialLead)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof WorkshopWaitlistDuplicateError
          ? 'Este e-mail já está na lista. Quando tivermos a data, você receberá o aviso.'
          : error instanceof WorkshopWaitlistIntegrationUnavailableError
            ? 'O formulário está temporariamente indisponível. Tente novamente em alguns minutos.'
            : 'Não foi possível concluir seu cadastro agora. Tente novamente em instantes.',
      )
    }
  }

  if (status === 'success') {
    return <div className="workshop-form workshop-form--success" role="status"><CheckCircle2 aria-hidden="true" /><h3>Interesse registrado.</h3><p>{message}</p></div>
  }

  const fieldError = (key: keyof WorkshopWaitlistLead) => errors[key] ? <span className="workshop-form__error" id={`${id}-${key}-error`}>{errors[key]}</span> : null

  return (
    <form className={`workshop-form ${compact ? 'workshop-form--compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="workshop-form__heading">
        <span>LISTA DE ESPERA</span>
        <p>Receba a data em primeira mão. Sem compromisso e sem mensagens em excesso.</p>
      </div>
      <div className="workshop-form__grid">
        <label htmlFor={`${id}-nome`}>Nome <b aria-hidden="true">*</b>
          <input id={`${id}-nome`} name="nome" autoComplete="name" value={lead.nome} onChange={(e) => update('nome', e.target.value)} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? `${id}-nome-error` : undefined} />
          {fieldError('nome')}
        </label>
        <label htmlFor={`${id}-email`}>E-mail <b aria-hidden="true">*</b>
          <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" value={lead.email} onChange={(e) => update('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
          {fieldError('email')}
        </label>
      </div>
      <label htmlFor={`${id}-etapa`}>Você é professor(a) de qual etapa? <b aria-hidden="true">*</b>
        <select id={`${id}-etapa`} name="etapa_ensino" value={lead.etapaEnsino} onChange={(e) => update('etapaEnsino', e.target.value as WorkshopWaitlistLead['etapaEnsino'])} aria-invalid={!!errors.etapaEnsino} aria-describedby={errors.etapaEnsino ? `${id}-etapaEnsino-error` : undefined}>
          <option value="">Selecione uma opção</option><option value="fundamental">Ensino Fundamental</option><option value="medio">Ensino Médio</option><option value="superior">Ensino Superior</option><option value="tecnico">Ensino Técnico</option><option value="outro">Outro</option>
        </select>
        {fieldError('etapaEnsino')}
      </label>
      {!compact && <label htmlFor={`${id}-duvida`}>Qual sua maior dúvida ou dificuldade com IA na sala de aula? <span>(opcional)</span>
        <textarea id={`${id}-duvida`} name="duvida_principal" rows={4} value={lead.duvidaPrincipal} onChange={(e) => update('duvidaPrincipal', e.target.value)} placeholder="Sua resposta também nos ajuda a definir o conteúdo do workshop." maxLength={2000} />
      </label>}
      <fieldset>
        <legend>Você toparia pagar um valor simbólico (R$ 20–30) para participar? <b aria-hidden="true">*</b></legend>
        <div className="workshop-form__radios">
          {([['sim', 'Sim'], ['nao', 'Não'], ['depende', 'Depende do conteúdo']] as const).map(([value, label]) => <label key={value}><input type="radio" name={`${id}-topa-pagar`} value={value} checked={lead.topaPagar === value} onChange={() => update('topaPagar', value)} /> <span>{label}</span></label>)}
        </div>
        {fieldError('topaPagar')}
      </fieldset>
      <button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Registrando…' : submitLabel}<ArrowRight aria-hidden="true" /></button>
      {status === 'error' && <p className="workshop-form__message" role="alert">{message}</p>}
      <small>Ao enviar, você concorda com o uso dos dados para comunicações sobre este workshop. Consulte nossa <a href="/privacidade">política de privacidade</a>.</small>
    </form>
  )
}
