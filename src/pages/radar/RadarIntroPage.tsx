import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { useRadarSession } from '../../context/radarSessionContextValue'
import { trackRadarStart } from '../../services/radarStartAnalytics'

export function RadarIntroPage() {
  const { session, setConsent } = useRadarSession()
  const navigate = useNavigate()
  const [reflectionAccepted, setReflectionAccepted] = useState(false)

  const start = () => {
    if (!reflectionAccepted) return
    setConsent({ reflectionAccepted: true, anonymousImprovementAccepted: false })
    trackRadarStart(session.startedAt)
    navigate('/radar/perfil')
  }

  return (
    <>
      <Seo
        title="Radar PráxIA: diagnóstico gratuito de fluência digital e IA"
        description="Reflita sobre sua prática docente e receba uma leitura orientativa de sua fluência digital e do uso pedagógico de inteligência artificial."
        path="/radar"
      />
      <main className="radar-screen radar-intro">
        <div className="radar-screen__content">
          <p className="flow-eyebrow">Radar PráxIA</p>
          <h1>Vamos começar seu<br /><em>Radar PráxIA.</em></h1>
          <p className="radar-screen__lead">Responda com base na sua prática docente recente. Ao final, você receberá uma leitura orientativa sobre sua fluência digital e o uso pedagógico de inteligência artificial.</p>
          <div className="consent-card">
            <label>
              <input type="checkbox" checked={reflectionAccepted} onChange={(event) => setReflectionAccepted(event.target.checked)} />
              <span>Concordo em participar desta autorreflexão e estou ciente de que o resultado é orientativo, baseado nas minhas respostas. Consulte a <Link to="/privacidade">Política de Privacidade</Link>.</span>
            </label>
          </div>
          <button type="button" className="flow-button" disabled={!reflectionAccepted} onClick={start}>Começar o diagnóstico <ArrowRight aria-hidden="true" /></button>
          <p className="radar-intro__duration">Leva cerca de 5 minutos.</p>
        </div>
      </main>
    </>
  )
}
