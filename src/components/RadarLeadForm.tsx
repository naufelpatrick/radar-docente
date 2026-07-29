import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { radarLeadService, validateRadarLead } from '../services/radarLeadService'
import type { ScoreResult } from '../types/result'
import type { RadarLead, RadarLeadErrors } from '../types/radarLead'

const emptyLead: RadarLead = {
  name: '',
  email: '',
  city: '',
  institution: '',
  marketingConsent: false,
}

export function RadarLeadForm({ result, onSubmitted }: { result: ScoreResult; onSubmitted: () => void }) {
  const [lead, setLead] = useState(emptyLead)
  const [errors, setErrors] = useState<RadarLeadErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  const update = <Key extends keyof RadarLead>(key: Key, value: RadarLead[Key]) => {
    setLead((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setStatus('idle')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateRadarLead(lead)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('submitting')
    try {
      await radarLeadService.submit({ lead, result })
      onSubmitted()
    } catch {
      setStatus('error')
    }
  }

  const describedBy = (field: keyof RadarLead) => errors[field] ? `radar-lead-error-${field}` : undefined

  return (
    <form className="radar-lead-form" onSubmit={submit} noValidate>
      <div className="radar-lead-form__heading">
        <p className="flow-eyebrow">ÚLTIMO PASSO</p>
        <h2>Para quem entregaremos o relatório?</h2>
        <p>Informe seus dados para abrir gratuitamente o Score PráxIA e o relatório completo.</p>
      </div>
      <div className="radar-lead-form__grid">
        <label htmlFor="radar-lead-name">
          Nome
          <input id="radar-lead-name" name="name" autoComplete="name" value={lead.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} required />
          {errors.name && <span className="form-error" id="radar-lead-error-name">{errors.name}</span>}
        </label>
        <label htmlFor="radar-lead-email">
          E-mail
          <input id="radar-lead-email" name="email" type="email" autoComplete="email" value={lead.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} required />
          {errors.email && <span className="form-error" id="radar-lead-error-email">{errors.email}</span>}
        </label>
        <label htmlFor="radar-lead-city">
          Cidade (opcional)
          <input id="radar-lead-city" name="city" autoComplete="address-level2" value={lead.city} onChange={(event) => update('city', event.target.value)} aria-invalid={Boolean(errors.city)} aria-describedby={describedBy('city')} />
          {errors.city && <span className="form-error" id="radar-lead-error-city">{errors.city}</span>}
        </label>
        <label htmlFor="radar-lead-institution">
          Instituição de ensino (opcional)
          <input id="radar-lead-institution" name="institution" autoComplete="organization" value={lead.institution} onChange={(event) => update('institution', event.target.value)} aria-invalid={Boolean(errors.institution)} aria-describedby={describedBy('institution')} />
          {errors.institution && <span className="form-error" id="radar-lead-error-institution">{errors.institution}</span>}
        </label>
      </div>
      <p className="form-privacy-notice">
        Usaremos nome, e-mail e dados resumidos do resultado para entregar e mensurar o uso do Radar. As respostas individuais não são enviadas. Consulte a <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
      <label className="radar-lead-form__marketing">
        <input type="checkbox" checked={lead.marketingConsent} onChange={(event) => update('marketingConsent', event.target.checked)} />
        <span>Quero receber conteúdos e novidades da PráxIA por e-mail. Esta autorização é opcional e pode ser revogada.</span>
      </label>
      {status === 'error' && <p className="radar-lead-form__error" role="alert">Não foi possível registrar seus dados. Verifique sua conexão e tente novamente.</p>}
      <button type="submit" className="flow-button" disabled={status === 'submitting'}>
        <CheckCircle2 aria-hidden="true" />
        {status === 'submitting' ? 'Preparando relatório…' : 'Abrir meu relatório gratuito'}
      </button>
    </form>
  )
}
