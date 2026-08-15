import type { CSSProperties } from 'react'
import { ArrowUpRight, CircleCheck } from 'lucide-react'

const axes = [
  { angle: -90, value: 0.82, label: 'Planejamento e curadoria' },
  { angle: -30, value: 0.64, label: 'Criação de experiências' },
  { angle: 30, value: 0.76, label: 'Mediação e colaboração' },
  { angle: 90, value: 0.68, label: 'Avaliação e feedback' },
  { angle: 150, value: 0.58, label: 'Integração pedagógica da IA' },
  { angle: 210, value: 0.74, label: 'Ética, segurança e autoria' },
]

const center = 150
const maxRadius = 104
const point = (angle: number, radius: number) => {
  const radians = (angle * Math.PI) / 180
  return `${center + Math.cos(radians) * radius},${center + Math.sin(radians) * radius}`
}

const score = 72
const scoreAngle = score * 1.8

export function ScorePraxia() {
  const shape = axes.map(({ angle, value }) => point(angle, maxRadius * value)).join(' ')
  const meterStyle = {
    '--score': score,
    '--score-angle': `${scoreAngle}deg`,
  } as CSSProperties

  return (
    <article
      className="score-praxia"
      id="score-praxia"
      data-reveal="scale"
      data-animate="score"
      aria-label={`Score PraxIA demonstrativo: ${score} de 100, faixa Integração`}
    >
      <header className="score-praxia__header">
        <div>
          <p className="mono-label">SCORE PRÁXIA</p>
          <p className="score-praxia__demo">Exemplo demonstrativo</p>
        </div>
        <span className="score-praxia__range"><i aria-hidden="true" /> Faixa: <strong>Integração</strong></span>
      </header>

      <div className="score-praxia__primary">
        <div className="score-meter" style={meterStyle}>
          <svg viewBox="0 0 360 230" role="img" aria-labelledby="score-meter-title score-meter-description">
            <title id="score-meter-title">Score PraxIA: 72 de 100</title>
            <desc id="score-meter-description">Medidor semicircular na faixa Integração, que vai de 60 a 79 pontos.</desc>
            <path className="score-meter__field score-meter__field--outer" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
            <path className="score-meter__field score-meter__field--middle" d="M62 190 A118 118 0 0 1 298 190" pathLength="100" />
            <path className="score-meter__field score-meter__field--inner" d="M84 190 A96 96 0 0 1 276 190" pathLength="100" />
            <path className="score-meter__progress" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
            <g className="score-meter__marker">
              <circle cx="40" cy="190" r="12" />
              <circle cx="40" cy="190" r="4" />
            </g>
            <g className="score-meter__evidence" aria-hidden="true">
              <circle cx="95" cy="88" r="5" />
              <circle cx="181" cy="50" r="5" />
              <circle cx="267" cy="89" r="5" />
            </g>
          </svg>
          <div className="score-meter__value">
            <strong>{score}</strong><span>/100</span>
            <small>Integração</small>
          </div>
          <div className="score-meter__scale" aria-hidden="true"><span>0</span><span>100</span></div>
        </div>

        <div className="score-praxia__bands" aria-label="Faixas de desenvolvimento">
          <span>0–39 <strong>Iniciação</strong></span>
          <span>40–59 <strong>Exploração</strong></span>
          <span className="is-current"><CircleCheck aria-hidden="true" /> 60–79 <strong>Integração</strong></span>
          <span>80–100 <strong>Transformação</strong></span>
        </div>

        <div className="score-praxia__reading">
          <p className="mono-label">SUA LEITURA</p>
          <h3>Você já utiliza recursos digitais e IA com intenção pedagógica.</h3>
          <p>Seu próximo avanço está em tornar essas práticas mais consistentes na avaliação e no feedback.</p>
          <div className="score-praxia__next">
            <ArrowUpRight aria-hidden="true" />
            <div><span>PRÓXIMO PASSO RECOMENDADO</span><strong>Explicite critérios de avaliação e use IA para ampliar a qualidade das devolutivas.</strong></div>
          </div>
        </div>
      </div>

      <div className="dimensional-radar">
        <div className="dimensional-radar__copy">
          <p className="mono-label">COMPOSIÇÃO DO SCORE</p>
          <h3>Seu radar em seis dimensões</h3>
          <p>O gráfico detalha as evidências que compõem a leitura geral.</p>
        </div>
        <svg viewBox="0 0 300 300" role="img" aria-labelledby="radar-title radar-description">
          <title id="radar-title">Radar demonstrativo das seis dimensões</title>
          <desc id="radar-description">{axes.map(({ label, value }) => `${label}: ${Math.round(value * 100)} de 100`).join('; ')}.</desc>
          {[1, 0.66, 0.33].map((scale) => (
            <polygon key={scale} points={axes.map(({ angle }) => point(angle, maxRadius * scale)).join(' ')} fill="none" stroke="currentColor" />
          ))}
          {axes.map(({ angle }) => {
            const [x2, y2] = point(angle, maxRadius).split(',')
            return <line key={angle} x1={center} y1={center} x2={x2} y2={y2} stroke="currentColor" />
          })}
          <polygon points={shape} fill="var(--indigo)" fillOpacity=".14" stroke="var(--indigo)" strokeWidth="3" />
          {axes.map(({ angle, value }) => {
            const [cx, cy] = point(angle, maxRadius * value).split(',')
            return <circle key={angle} cx={cx} cy={cy} r="5" fill="var(--indigo)" />
          })}
        </svg>
      </div>
    </article>
  )
}
