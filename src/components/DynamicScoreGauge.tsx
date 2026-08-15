type DynamicScoreGaugeProps = {
  score: number
  bandName: string
}

export function DynamicScoreGauge({ score, bandName }: DynamicScoreGaugeProps) {
  const angle = score * 1.8
  return (
    <div className="dynamic-gauge" style={{ '--result-score': score, '--result-angle': `${angle}deg` } as React.CSSProperties}>
      <svg viewBox="0 0 360 230" role="img" aria-label={`Score PraxIA: ${score} de 100, faixa ${bandName}`}>
        <path className="dynamic-gauge__track" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
        <path className="dynamic-gauge__accent" d="M62 190 A118 118 0 0 1 298 190" pathLength="100" />
        <path className="dynamic-gauge__progress" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
        <g className="dynamic-gauge__marker">
          <circle cx="40" cy="190" r="12" />
          <circle cx="40" cy="190" r="4" />
        </g>
      </svg>
      <div className="dynamic-gauge__value"><strong>{score}</strong><span>/100</span><small>{bandName}</small></div>
      <div className="dynamic-gauge__limits" aria-hidden="true"><span>0</span><span>100</span></div>
    </div>
  )
}
