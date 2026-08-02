import { ArrowLeft, Pencil } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { instrument } from '../../data/instrument'
import { useRadarSession } from '../../context/radarSessionContextValue'
import { RadarLeadForm } from '../../components/RadarLeadForm'
import { calculateScore } from '../../services/scoringService'
import { useEffect } from 'react'
import { recordRadarStep } from '../../services/radarFunnelAnalytics'

export function RadarReviewPage() {
  const { session } = useRadarSession()
  const navigate = useNavigate()
  const missing = instrument.findIndex(({ id }) => !session.answers[id])

  useEffect(() => {
    recordRadarStep(session.startedAt, 'review', Math.min(Object.keys(session.answers).length, instrument.length), instrument.length)
  }, [session.answers, session.startedAt])

  if (!session.teachingProfile) {
    return <Navigate to="/radar/perfil" replace />
  }

  const result = missing < 0
    ? calculateScore(session.answers, session.teachingProfile, session.startedAt)
    : null

  return (
    <main className="radar-screen review-screen">
      <div className="radar-screen__content">
        <p className="flow-eyebrow">REVISÃO OPCIONAL</p>
        <h1>Confira antes de<br /><em>finalizar.</em></h1>
        <p className="radar-screen__lead">Você pode voltar a qualquer questão. A pontuação só será calculada depois das 30 respostas válidas.</p>
        {missing >= 0 && <div className="flow-alert">Ainda há respostas pendentes. Retome a primeira questão sem resposta para continuar.</div>}
        <div className="review-list">
          {instrument.map((item, index) => {
            const selected = item.options.find(({ value }) => value === session.answers[item.id])
            return (
              <article key={item.id}>
                <span>{item.id}</span>
                <div><strong>{item.dimensionName}</strong><p>{selected?.label ?? 'Sem resposta'}</p></div>
                <Link to={`/radar/questoes/${index + 1}`} aria-label={`Editar resposta da questão ${item.id}`}><Pencil aria-hidden="true" /> Editar</Link>
              </article>
            )
          })}
        </div>
        <div className="flow-actions"><Link className="flow-back" to="/radar/questoes/30"><ArrowLeft aria-hidden="true" /> Voltar</Link></div>
        {result && <RadarLeadForm result={result} completionId={session.startedAt} onSubmitted={() => navigate('/radar/resultado')} />}
      </div>
    </main>
  )
}
