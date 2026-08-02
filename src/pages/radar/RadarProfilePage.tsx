import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { teachingProfiles } from '../../data/instrument'
import { useRadarSession } from '../../context/radarSessionContextValue'
import type { TeachingProfile } from '../../types/instrument'
import { recordRadarStep, trackRadarProfileComplete, trackRadarProfileStarted } from '../../services/radarFunnelAnalytics'

export function RadarProfilePage() {
  const { session, setTeachingProfile } = useRadarSession()
  const navigate = useNavigate()

  const selectProfile = (profile: TeachingProfile) => {
    trackRadarProfileStarted(session.startedAt)
    setTeachingProfile(profile)
  }

  const completeProfile = () => {
    if (!session.teachingProfile) return
    trackRadarProfileComplete(session.startedAt, session.teachingProfile)
    recordRadarStep(session.startedAt, 'profile')
    navigate('/radar/questoes/1')
  }

  if (!session.consent.reflectionAccepted) {
    return <Navigate to="/radar" replace />
  }

  return (
    <main className="radar-screen">
      <div className="radar-screen__content radar-screen__content--narrow">
        <p className="flow-eyebrow">SEU CONTEXTO</p>
        <h1>Em qual etapa você atua <em>principalmente?</em></h1>
        <p className="radar-screen__lead">Escolha a opção que mais representa sua prática atual. Ela contextualiza sua leitura, mas não altera a fórmula do score.</p>
        <fieldset className="profile-options">
          <legend className="sr-only">Etapa principal de ensino</legend>
          {teachingProfiles.map(({ id, label }) => (
            <label key={id} className={session.teachingProfile === id ? 'is-selected' : ''}>
              <input
                type="radio"
                name="teachingProfile"
                value={id}
                checked={session.teachingProfile === id}
                onChange={() => selectProfile(id as TeachingProfile)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <div className="flow-actions">
          <Link className="flow-back" to="/radar"><ArrowLeft aria-hidden="true" /> Voltar</Link>
          <button type="button" className="flow-button" disabled={!session.teachingProfile} onClick={completeProfile}>
            Começar o questionário <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  )
}
