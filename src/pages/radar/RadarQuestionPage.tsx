import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { instrument } from '../../data/instrument'
import { useRadarSession } from '../../context/radarSessionContextValue'

export function RadarQuestionPage() {
  const { session, setAnswer } = useRadarSession()
  const navigate = useNavigate()
  const { questionNumber } = useParams()
  const index = Math.max(0, Math.min(instrument.length - 1, Number(questionNumber) - 1))
  const item = instrument[index]
  const answer = session.answers[item.id]
  const progress = ((index + 1) / instrument.length) * 100

  useEffect(() => {
    document.querySelector<HTMLElement>('.question-card h1')?.focus()
  }, [index])

  if (!session.teachingProfile) {
    return <Navigate to="/radar/perfil" replace />
  }

  const previous = () => navigate(index === 0 ? '/radar/perfil' : `/radar/questoes/${index}`)
  const next = () => {
    if (!answer) return
    navigate(index === instrument.length - 1 ? '/radar/revisao' : `/radar/questoes/${index + 2}`)
  }

  return (
    <main className="question-screen">
      <div className="question-progress" aria-label={`Questão ${index + 1} de ${instrument.length}`}>
        <div><span>Questão {index + 1} de {instrument.length}</span><strong>{Math.round(progress)}%</strong></div>
        <progress max="100" value={progress}>{progress}%</progress>
      </div>
      <div className="question-layout">
        <aside>
          <p className="flow-eyebrow">DIMENSÃO</p>
          <h2>{item.dimensionName}</h2>
          <p>{item.type === 'situational' ? 'Situação de decisão' : 'Prática observável'}</p>
          <span>{item.id}</span>
        </aside>
        <section className="question-card">
          <p className="question-card__instruction">
            {item.type === 'behavioral' ? 'Com que frequência isso acontece na sua prática?' : 'Escolha a decisão que mais se aproxima do que você faria.'}
          </p>
          <h1 tabIndex={-1}>{item.prompt}</h1>
          <fieldset className="answer-options">
            <legend className="sr-only">Alternativas para {item.id}</legend>
            {item.options.map((option) => (
              <label key={option.id} className={answer === option.value ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name={item.id}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={() => setAnswer(item.id, option.value)}
                />
                <span className="answer-options__key" aria-hidden="true">
                  {item.type === 'situational' ? option.id : ''}
                </span>
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="flow-actions">
            <button type="button" className="flow-back" onClick={previous}><ArrowLeft aria-hidden="true" /> Anterior</button>
            <button type="button" className="flow-button" disabled={!answer} onClick={next}>
              {index === instrument.length - 1 ? 'Revisar respostas' : 'Continuar'} <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
