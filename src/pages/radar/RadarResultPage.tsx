import { AlertTriangle, ArrowRight, BookOpen, CalendarClock, CheckCircle2, Compass, Sparkles } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { DynamicScoreGauge } from '../../components/DynamicScoreGauge'
import { dimensions } from '../../data/instrument'
import { useRadarSession } from '../../context/radarSessionContextValue'
import { calculateScore } from '../../services/scoringService'

export function RadarResultPage() {
  const { session } = useRadarSession()
  if (!session.teachingProfile) return <Navigate to="/radar/perfil" replace />

  let result
  try {
    result = calculateScore(session.answers, session.teachingProfile, session.startedAt)
  } catch {
    return <Navigate to="/radar/revisao" replace />
  }

  const getDimensionName = (id: string) => dimensions.find((dimension) => dimension.id === id)?.name ?? id
  const radarData = result.dimensionScores.map((dimension) => ({
    dimension: dimensions.find(({ id }) => id === dimension.dimensionId)?.shortName,
    score: dimension.score,
    fullMark: 100,
  }))

  return (
    <main className="result-page">
      <section className="result-hero">
        <div className="result-hero__copy">
          <p className="flow-eyebrow">SEU RESULTADO • BETA 0.1</p>
          <h1>Seu Score PráxIA é<br /><em>{result.displayedOverallScore} de 100.</em></h1>
          <p>{result.band.message}</p>
          <span>Resultado orientativo e baseado em autorrelato.</span>
        </div>
        <DynamicScoreGauge score={result.displayedOverallScore} bandName={result.band.name} />
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

      <section className="result-section insights-grid">
        <article className="insight-card insight-card--strength">
          <CheckCircle2 aria-hidden="true" /><p className="flow-eyebrow">FORÇA</p>
          <h2>{result.strengths.map(getDimensionName).join(' e ')}</h2>
          <p>{result.strengths.length > 1 ? 'Essas dimensões aparecem com desempenho semelhante e representam práticas mais consolidadas.' : 'Esta dimensão representa uma prática mais consolidada no seu resultado.'}</p>
        </article>
        <article className="insight-card insight-card--development">
          <Compass aria-hidden="true" /><p className="flow-eyebrow">ZONA PRIORITÁRIA</p>
          <h2>{result.developmentZones.map(getDimensionName).join(' e ')}</h2>
          <p>Uma oportunidade concreta para aproximar intenção, critérios e consistência na prática.</p>
        </article>
        {result.balanceProfile && (
          <article className="insight-card insight-card--profile">
            <Sparkles aria-hidden="true" /><p className="flow-eyebrow">LEITURA DO PERFIL</p>
            <h2>{result.balanceProfile === 'balanced' ? 'Desenvolvimento equilibrado' : 'Competências em estágios diferentes'}</h2>
            <p>{result.balanceProfile === 'balanced'
              ? 'Suas dimensões apresentam desenvolvimento relativamente equilibrado. O próximo passo é aumentar a consistência dessas práticas e transformá-las em repertório consciente.'
              : 'Seu próximo avanço não depende de aprender mais ferramentas, mas de aproximar suas práticas mais desenvolvidas das dimensões que ainda precisam de atenção.'}</p>
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

      <section className="recommendation-card">
        <div><p className="flow-eyebrow">PRÓXIMO PASSO RECOMENDADO</p><h2>{getDimensionName(result.recommendationDimension)}</h2><p>{result.recommendation}</p></div>
        <ArrowRight aria-hidden="true" />
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
