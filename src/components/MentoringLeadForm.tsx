import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { mentoringLeadService, validateMentoringLead } from '../services/publicLeadService'
import type { LeadErrors, MentoringLead } from '../types/publicLead'

const initialLead: MentoringLead = {
  name: '',
  email: '',
  phone: '',
  teachingContext: '',
  mainChallenge: '',
}

export function MentoringLeadForm() {
  const [lead, setLead] = useState(initialLead)
  const [errors, setErrors] = useState<LeadErrors<MentoringLead>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const update = (field: keyof MentoringLead, value: string | boolean) => {
    setLead((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting' || status === 'success') return
    const nextErrors = validateMentoringLead(lead)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      document.getElementById(`mentoring-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }
    setStatus('submitting')
    try {
      await mentoringLeadService.submit(lead)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldProps = (field: keyof MentoringLead) => ({
    id: `mentoring-${field}`,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `mentoring-error-${field}` : undefined,
  })
  const error = (field: keyof MentoringLead) => errors[field] && <span className="form-error" id={`mentoring-error-${field}`}>{errors[field]}</span>

  return (
    <form className="contact-form mentoring-form" onSubmit={submit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="mentoring-name">Nome completo</label>
        <input {...fieldProps('name')} autoComplete="name" value={lead.name} onChange={(event) => update('name', event.target.value)} />
        {error('name')}
      </div>
      <div className="contact-form__field">
        <label htmlFor="mentoring-email">E-mail</label>
        <input {...fieldProps('email')} type="email" autoComplete="email" value={lead.email} onChange={(event) => update('email', event.target.value)} />
        {error('email')}
      </div>
      <div className="contact-form__field">
        <label htmlFor="mentoring-phone">WhatsApp</label>
        <input {...fieldProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={lead.phone} onChange={(event) => update('phone', event.target.value)} />
        {error('phone')}
      </div>
      <div className="contact-form__field">
        <label htmlFor="mentoring-teachingContext">Contexto de atuação</label>
        <input {...fieldProps('teachingContext')} placeholder="Ex.: ensino superior, anos finais, coordenação" value={lead.teachingContext} onChange={(event) => update('teachingContext', event.target.value)} />
        {error('teachingContext')}
      </div>
      <div className="contact-form__field">
        <label htmlFor="mentoring-mainChallenge">Qual desafio você gostaria de trabalhar?</label>
        <textarea {...fieldProps('mainChallenge')} rows={5} value={lead.mainChallenge} onChange={(event) => update('mainChallenge', event.target.value)} />
        {error('mainChallenge')}
      </div>
      <p className="form-privacy-notice">Os dados informados serão utilizados para responder à sua solicitação de mentoria e dar continuidade a este contato. Saiba mais na <a href="/privacidade">Política de Privacidade</a>.</p>
      <button type="submit" disabled={status === 'submitting' || status === 'success'}>
        {status === 'submitting' ? 'Enviando…' : status === 'success' ? 'Interesse registrado' : 'Manifestar interesse'} <ArrowRight aria-hidden="true" />
      </button>
      <div className="form-submit-status" role="status" aria-live="polite">
        {status === 'success' && <p><CheckCircle2 aria-hidden="true" /> Recebemos seu interesse e entraremos em contato.</p>}
        {status === 'error' && <p>Não foi possível registrar agora. Tente novamente ou escreva para <a href="mailto:praxia@radarpraxia.com">praxia@radarpraxia.com</a>.</p>}
      </div>
    </form>
  )
}
