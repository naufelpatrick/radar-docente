const quadrants = [
  { className: 'use', label: 'Usar', title: 'Valor alto · risco baixo', text: 'Aplicar com orientações claras e evidências previstas.' },
  { className: 'mediate', label: 'Mediar', title: 'Valor alto · risco alto', text: 'Incluir limites, alternativas, supervisão e revisão.' },
  { className: 'question', label: 'Questionar', title: 'Valor baixo · risco baixo', text: 'Verificar se a complexidade acrescentada vale a pena.' },
  { className: 'avoid', label: 'Não utilizar', title: 'Valor baixo · risco alto', text: 'Escolher outra experiência ou outro recurso.' },
]

export function DecisionMatrix() {
  return (
    <figure className="decision-matrix" aria-labelledby="decision-matrix-caption">
      <div className="decision-matrix__axis decision-matrix__axis--risk"><span>Risco menor</span><span>Risco maior</span></div>
      <div className="decision-matrix__grid">
        {quadrants.map((quadrant) => <div className={`decision-matrix__cell decision-matrix__cell--${quadrant.className}`} key={quadrant.label}><small>{quadrant.label}</small><strong>{quadrant.title}</strong><p>{quadrant.text}</p></div>)}
      </div>
      <div className="decision-matrix__axis decision-matrix__axis--value"><span>Valor pedagógico menor</span><span>Valor pedagógico maior</span></div>
      <figcaption id="decision-matrix-caption">Matriz orientativa para relacionar valor pedagógico e riscos à aprendizagem, autoria, privacidade ou acesso.</figcaption>
    </figure>
  )
}
