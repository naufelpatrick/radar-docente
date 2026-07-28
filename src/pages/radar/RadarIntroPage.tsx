import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRadarSession } from '../../context/radarSessionContextValue'

export function RadarIntroPage() {
  const { session, setConsent } = useRadarSession()
  const navigate = useNavigate()
  const [reflectionAccepted, setReflectionAccepted] = useState(session.consent.reflectionAccepted)
  const [anonymousImprovementAccepted, setAnonymousImprovementAccepted] = useState(session.consent.anonymousImprovementAccepted)

  const start = () => {
    if (!reflectionAccepted) return
    setConsent({ reflectionAccepted, anonymousImprovementAccepted })
    navigate('/radar/perfil')
  }

  return (
    <main className="radar-screen radar-intro">
      <div className="radar-screen__content">
        <p className="flow-eyebrow">RADAR PRÁXIA • BETA 0.1</p>
        <h1>Olhe sua prática por<br /><em>novos ângulos.</em></h1>
        <p className="radar-screen__lead">Instrumento de autorreflexão fundamentado em referenciais internacionais. Versão beta em processo de validação.</p>
        <div className="radar-intro__facts">
          <span><Clock3 aria-hidden="true" /> 8 a 10 minutos</span>
          <span><CheckCircle2 aria-hidden="true" /> 30 questões</span>
          <span><ShieldCheck aria-hidden="true" /> Progresso apenas neste navegador</span>
        </div>
        <div className="consent-card">
          <h2>Antes de começar</h2>
          <p>Considere sua prática nos últimos seis meses ou no período letivo mais recente. Responda o que você efetivamente faz, não o que seria ideal.</p>
          <label>
            <input type="checkbox" checked={reflectionAccepted} onChange={(event) => setReflectionAccepted(event.target.checked)} />
            <span><strong>Concordo em participar desta autorreflexão.</strong> Entendo que o resultado é orientativo, baseado em autorrelato e não constitui prova, certificação ou avaliação institucional.</span>
          </label>
          <label>
            <input type="checkbox" checked={anonymousImprovementAccepted} onChange={(event) => setAnonymousImprovementAccepted(event.target.checked)} />
            <span><strong>Autorizo o uso futuro de dados agregados e anônimos</strong> para aperfeiçoar o instrumento. Nesta versão, nenhuma resposta é enviada para um servidor.</span>
          </label>
        </div>
        <button type="button" className="flow-button" disabled={!reflectionAccepted} onClick={start}>Continuar <ArrowRight aria-hidden="true" /></button>
      </div>
    </main>
  )
}
