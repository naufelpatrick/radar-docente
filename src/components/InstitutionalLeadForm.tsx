import { FormEvent, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { trackCommercialEvent } from '../services/commercialAnalytics'
import { institutionalLeadAdapter, LeadIntegrationUnavailableError, validateInstitutionalLead } from '../services/institutionalLeadService'
import type { InstitutionalLead, InstitutionalLeadErrors } from '../types/institutionalLead'

const initialLead: InstitutionalLead = {
  name: '', institution: '', role: '', email: '', phone: '', city: '', state: '',
  modality: '', interest: '', participantsRange: '', preferredPeriod: '', message: '',
  sourcePage: '/para-instituicoes', privacyConsent: false,
}

export function InstitutionalLeadForm() {
  const [lead, setLead] = useState(initialLead)
  const [errors, setErrors] = useState<InstitutionalLeadErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'integration_pending' | 'error'>('idle')
  const started = useRef(false)

  const startForm = () => {
    if (started.current) return
    started.current = true
    trackCommercialEvent('start_institutional_form', { audience: 'institutions', source_page: '/para-instituicoes' })
  }

  const update = (field: keyof InstitutionalLead, value: string | boolean) => {
    setLead((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting' || status === 'success') return
    const nextErrors = validateInstitutionalLead(lead)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      trackCommercialEvent('submit_institutional_lead', { audience: 'institutions', source_page: '/para-instituicoes', form_status: 'validation_error' })
      document.getElementById(`field-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }
    setStatus('submitting')
    try {
      await institutionalLeadAdapter.submit(lead)
      setStatus('success')
      trackCommercialEvent('submit_institutional_lead', { audience: 'institutions', source_page: '/para-instituicoes', form_status: 'success' })
    } catch (error) {
      const integrationPending = error instanceof LeadIntegrationUnavailableError
      setStatus(integrationPending ? 'integration_pending' : 'error')
      trackCommercialEvent('submit_institutional_lead', { audience: 'institutions', source_page: '/para-instituicoes', form_status: integrationPending ? 'integration_pending' : 'error' })
    }
  }

  const fieldProps = (field: keyof InstitutionalLead) => ({
    id: `field-${field}`,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `error-${field}` : undefined,
  })
  const error = (field: keyof InstitutionalLead) => errors[field] && <span className="form-error" id={`error-${field}`}>{errors[field]}</span>

  return (
    <form className="institutional-form" onSubmit={submit} onFocus={startForm} noValidate aria-describedby="form-intro">
      <div className="institutional-form__grid">
        <label>Nome completo<input {...fieldProps('name')} autoComplete="name" value={lead.name} onChange={(e) => update('name', e.target.value)} required />{error('name')}</label>
        <label>Instituição<input {...fieldProps('institution')} autoComplete="organization" value={lead.institution} onChange={(e) => update('institution', e.target.value)} required />{error('institution')}</label>
        <label>Cargo ou função<input {...fieldProps('role')} autoComplete="organization-title" value={lead.role} onChange={(e) => update('role', e.target.value)} required />{error('role')}</label>
        <label>E-mail<input {...fieldProps('email')} type="email" autoComplete="email" value={lead.email} onChange={(e) => update('email', e.target.value)} required />{error('email')}</label>
        <label>WhatsApp<input {...fieldProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={lead.phone} onChange={(e) => update('phone', e.target.value)} required />{error('phone')}</label>
        <label>Cidade<input {...fieldProps('city')} autoComplete="address-level2" value={lead.city} onChange={(e) => update('city', e.target.value)} required />{error('city')}</label>
        <label>Estado<input {...fieldProps('state')} autoComplete="address-level1" value={lead.state} onChange={(e) => update('state', e.target.value)} required />{error('state')}</label>
        <label>Modalidade<select {...fieldProps('modality')} value={lead.modality} onChange={(e) => update('modality', e.target.value)} required><option value="">Selecione</option><option value="presential">Presencial</option><option value="online">On-line</option><option value="undecided">A definir</option></select>{error('modality')}</label>
        <label>Interesse<select {...fieldProps('interest')} value={lead.interest} onChange={(e) => update('interest', e.target.value)} required><option value="">Selecione</option><option value="talk">Palestra</option><option value="workshop">Workshop</option><option value="both">Ambos</option></select>{error('interest')}</label>
        <label>Quantidade aproximada de participantes<input {...fieldProps('participantsRange')} inputMode="numeric" value={lead.participantsRange} onChange={(e) => update('participantsRange', e.target.value)} required />{error('participantsRange')}</label>
        <label className="institutional-form__wide">Período ou data pretendida<input {...fieldProps('preferredPeriod')} value={lead.preferredPeriod} onChange={(e) => update('preferredPeriod', e.target.value)} required />{error('preferredPeriod')}</label>
        <label className="institutional-form__wide">Necessidade da instituição<textarea {...fieldProps('message')} rows={5} value={lead.message} onChange={(e) => update('message', e.target.value)} required />{error('message')}</label>
      </div>
      <label className="institutional-form__consent">
        <input {...fieldProps('privacyConsent')} type="checkbox" checked={lead.privacyConsent} onChange={(e) => update('privacyConsent', e.target.checked)} required />
        <span>Concordo com o uso destes dados exclusivamente para o contato sobre esta solicitação, conforme a política de privacidade.</span>
      </label>
      {error('privacyConsent')}
      <button type="submit" disabled={status === 'submitting' || status === 'success'}>
        {status === 'submitting' ? 'Enviando…' : status === 'success' ? 'Solicitação enviada' : 'Solicitar proposta'}<ArrowRight aria-hidden="true" />
      </button>
      <div className="institutional-form__status" role="status" aria-live="polite">
        {status === 'integration_pending' && <p>O formulário está pronto, mas o envio online ainda não foi conectado. Seus dados não foram enviados. Por enquanto, escreva para <a href="mailto:praxia@radarpraxia.com">praxia@radarpraxia.com</a>.</p>}
        {status === 'success' && <p><CheckCircle2 aria-hidden="true" /> Solicitação recebida.</p>}
        {status === 'error' && <p>Não foi possível registrar sua solicitação agora. Seus dados continuam no formulário para uma nova tentativa. Se preferir, escreva para <a href="mailto:praxia@radarpraxia.com">praxia@radarpraxia.com</a>.</p>}
      </div>
    </form>
  )
}
