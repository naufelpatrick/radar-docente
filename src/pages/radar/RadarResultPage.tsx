import { AlertTriangle, ArrowRight, BookOpen, CalendarClock, CheckCircle2, ChevronDown, Clock3, Compass, Eye, Sparkles, Target } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { DynamicScoreGauge } from '../../components/DynamicScoreGauge'
import { PdfExportButton } from '../../components/PdfExportButton'
import { dimensions, instrument } from '../../data/instrument'
import { useRadarSession } from '../../context/radarSessionContextValue'
import { buildResultNarrative } from '../../services/resultNarrativeService'
import { calculateScore } from '../../services/scoringService'

export function RadarResultPage() {
  const { session } = useRadarSession()
  const isLocalDemo = import.meta.env.DEV && new URLSearchParams(window.location.search).get('demo') === '1'
  const teachingProfile = session.teachingProfile ?? (isLocalDemo ? 'higher_postgraduate' : null)
  const answers = isLocalDemo
    ? Object.fromEntries(instrument.map(({ id }) => [id, 4]))
    : session.answers

  if (!teachingProfile) return <Navigate to="/radar/perfil" replace />

  let result
  try {
    result = calculateScore(answers, teachingProfile, session.startedAt)
  } catch {
    return <Navigate to="/radar/revisao" replace />
  }

  const getDimensionName = (id: string) => dimensions.find((dimension) => dimension.id === id)?.name ?? id
  const radarData = result.dimensionScores.map((dimension) => ({
    dimension: dimensions.find(({ id }) => id === dimension.dimensionId)?.shortName,
    score: dimension.score,
    fullMark: 100,
  }))
  const narrative = buildResultNarrative(result)
  const plan = narrative.developmentPlan

  return (
    <main className="result-page">
      <section className="result-hero">
        <div className="result-hero__copy">
          <PdfExportButton result={result} narrative={narrative} />
          <p className="flow-eyebrow">SEU RESULTADO • BETA 0.1</p>
          <h1>Seu Score PráxIA é<br /><em>{result.displayedOverallScore} de 100.</em></h1>
          <p>{result.band.message}</p>
          <span>Resultado orientativo e baseado em autorrelato.</span>
        </div>
        <DynamicScoreGauge score={result.displayedOverallScore} bandName={result.band.name} />
      </section>

      <section className="result-reveal result-section">
        <div className="result-editorial-heading">
          <p className="flow-eyebrow">LEITURA PERSONALIZADA</p>
          <h2>O que seu resultado<br /><em>revela.</em></h2>
        </div>
        <div className="result-reveal__text">
          <span aria-hidden="true">“</span>
          <p>{narrative.summary}</p>
        </div>
      </section>

      <section className="teaching-impact">
        <div className="result-section">
          <div className="result-section__heading">
            <div><p className="flow-eyebrow">NA PRÁTICA</p><h2>Como isso pode aparecer<br />na sua docência.</h2></div>
            <p>Possibilidades de leitura — não afirmações sobre você ou seus estudantes.</p>
          </div>
          <div className="teaching-impact__grid">
            {narrative.implications.map((implication, index) => (
              <article key={implication.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{implication.title}</h3>
                <p>{implication.manifestation}</p>
                <div><ArrowRight aria-hidden="true" /><p>{implication.impact}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="result-section result-dimensions">
        <div className="result-section__heading">
          <div><p className="flow-eyebrow">LEITURA DIMENSIONAL</p><h2>O que compõe<br />seu score.</h2></div>
          <p>O radar mostra como as seis dimensões se relacionam. Ele explica a pontuação geral, sem substituir a leitura do seu contexto.</p>
        </div>
        <div className="result-radar-card">
          <div className="result-radar-chart" role="img" aria-label="Radar com os scores das seis dimensões">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 25, right: 45, bottom: 25, left: 45 }}>
                <PolarGrid stroke="#d9dcec" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#4f596b', fontSize: 11 }} />
                <Radar dataKey="score" stroke="#5142E8" fill="#5142E8" fillOpacity={0.2} strokeWidth={3} isAnimationActive />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="dimension-values">
            {result.dimensionScores.map((dimension) => (
              <div key={dimension.dimensionId}>
                <span>{dimension.dimensionName}</span><strong>{Math.round(dimension.score)}</strong>
                <progress max="100" value={dimension.score}>{dimension.score}</progress>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dimension-understanding">
        <div className="result-section">
          <div className="result-editorial-heading">
            <p className="flow-eyebrow">LEITURA APROFUNDADA</p>
            <h2>Entenda cada<br /><em>dimensão.</em></h2>
            <p>Abra cada dimensão para relacionar a pontuação a decisões reconhecíveis da prática docente.</p>
          </div>
          <div className="dimension-accordions">
            {narrative.dimensionInterpretations.map((dimension, index) => (
              <details key={dimension.dimensionId} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{dimension.dimensionName}</strong><small>{dimension.bandName}</small></div>
                  <b>{Math.round(dimension.score)}<small>/100</small></b>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <div className="dimension-accordion__body">
                  <div className="dimension-accordion__lead">
                    <p className="flow-eyebrow">O QUE A DIMENSÃO AVALIA</p>
                    <p>{dimension.content.evaluates}</p>
                  </div>
                  <div className="dimension-accordion__reading">
                    <article><h3>O que o resultado sugere</h3><p>{dimension.content.suggests}</p></article>
                    <article><h3>Como pode aparecer</h3><p>{dimension.content.inPractice}</p></article>
                    <article><h3>Impacto possível</h3><p>{dimension.content.impact}</p></article>
                  </div>
                  <div className="dimension-accordion__actions">
                    <article><CheckCircle2 aria-hidden="true" /><div><span>UMA PRÁTICA PARA MANTER</span><p>{dimension.content.practiceToMaintain}</p></div></article>
                    <article><ArrowRight aria-hidden="true" /><div><span>UMA AÇÃO PARA AVANÇAR</span><p>{dimension.content.actionToAdvance}</p></div></article>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="result-section insights-grid">
        {result.strengths.length > 0 && <article className="insight-card insight-card--strength">
            <CheckCircle2 aria-hidden="true" /><p className="flow-eyebrow">FORÇA</p>
            <h2>{result.strengths.map(getDimensionName).join(' e ')}</h2>
            <p>{result.strengths.length > 1 ? 'Essas dimensões aparecem com desempenho semelhante e representam práticas mais consolidadas.' : 'Esta dimensão representa uma prática mais consolidada no seu resultado.'}</p>
          </article>}
        {result.developmentZones.length > 0 && <article className="insight-card insight-card--development">
            <Compass aria-hidden="true" /><p className="flow-eyebrow">ZONA DE DESENVOLVIMENTO</p>
            <h2>{result.developmentZones.map(getDimensionName).join(' e ')}</h2>
            <p>Uma oportunidade concreta para aproximar intenção, critérios e consistência na prática.</p>
          </article>}
        {result.balanceProfile && (
          <article className="insight-card insight-card--profile">
            <Sparkles aria-hidden="true" /><p className="flow-eyebrow">LEITURA DO PERFIL</p>
            <h2>{result.balanceProfile === 'balanced' ? 'Desenvolvimento equilibrado' : 'Competências em estágios diferentes'}</h2>
            <p>{result.balanceProfile === 'balanced'
              ? 'Suas dimensões apresentam desenvolvimento relativamente equilibrado. O próximo passo é aumentar a consistência dessas práticas e transformá-las em repertório consciente.'
              : 'Seu próximo avanço não depende de aprender mais ferramentas, mas de aproximar suas práticas mais desenvolvidas das dimensões que ainda precisam de atenção.'}</p>
          </article>
        )}
        {narrative.balancedExplanation && (
          <article className="insight-card insight-card--balanced">
            <Target aria-hidden="true" /><p className="flow-eyebrow">COMO LER ESTE PERFIL</p>
            <h2>Sem contraste suficiente</h2>
            <p>{narrative.balancedExplanation}</p>
          </article>
        )}
      </section>

      {result.attentionSignals.length > 0 && (
        <section className="attention-card">
          <AlertTriangle aria-hidden="true" />
          <div>
            <p className="flow-eyebrow">SINAL DE ATENÇÃO</p>
            <h2>Um cuidado antes do próximo avanço</h2>
            {result.attentionSignals.map((signal) => <p key={signal}>{signal}</p>)}
          </div>
        </section>
      )}

      <section className="development-plan">
        <div className="development-plan__intro">
          <p className="flow-eyebrow">SEU PLANO DE DESENVOLVIMENTO</p>
          <h2>Um experimento pequeno.<br /><em>Uma evidência real.</em></h2>
          <p>{plan.whyPrioritized}</p>
          <span>DIMENSÃO PRIORIZADA</span>
          <strong>{getDimensionName(plan.dimensionId)}</strong>
        </div>
        <div className="development-plan__content">
          <article className="development-plan__objective"><Target aria-hidden="true" /><div><span>OBJETIVO DE DESENVOLVIMENTO</span><p>{plan.objective}</p></div></article>
          <article className="development-plan__action"><span>PARA A PRÓXIMA ATIVIDADE</span><h3>{plan.nextActivityAction}</h3></article>
          <div className="development-plan__details">
            <article><h3>Critérios para executar</h3><ul>{plan.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></article>
            <article><Eye aria-hidden="true" /><h3>Evidência observável</h3><p>{plan.observableEvidence}</p></article>
            <article><Clock3 aria-hidden="true" /><h3>Tempo de preparação</h3><p>{plan.preparationTime}</p></article>
          </div>
          <div className="development-plan__reflection"><span>DEPOIS DA EXPERIÊNCIA, PERGUNTE-SE</span><p>{plan.reflection}</p></div>
        </div>
      </section>

      <section className="takeaway-question">
        <span className="takeaway-question__arc" aria-hidden="true" />
        <p className="flow-eyebrow">PERGUNTA PARA LEVAR COM VOCÊ</p>
        <blockquote>“{narrative.reflectionQuestion}”</blockquote>
        <span>{getDimensionName(result.recommendationDimension)}</span>
      </section>

      <section className="future-offers">
        <article><BookOpen aria-hidden="true" /><span>EM PREPARAÇÃO</span><h2>E-book PráxIA</h2><p>Um aprofundamento prático alinhado ao seu resultado estará disponível futuramente.</p><button disabled>Conhecer em breve</button></article>
        <article><CalendarClock aria-hidden="true" /><span>EM PREPARAÇÃO</span><h2>Mentoria individual</h2><p>Uma sessão para aplicar IA a um desafio real da sua prática será oferecida futuramente.</p><button disabled>Agendamento futuro</button></article>
      </section>

      <footer className="result-footer">
        <p>Instrumento de autorreflexão fundamentado em referenciais internacionais. Versão beta em processo de validação.</p>
        <Link to="/">Voltar para a página inicial</Link>
      </footer>
    </main>
  )
}
