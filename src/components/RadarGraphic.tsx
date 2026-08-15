import brandSymbol from '../assets/praxia-symbol.svg'

type RadarGraphicProps = {
  className?: string
  labelled?: boolean
}

export function RadarGraphic({ className = '', labelled = false }: RadarGraphicProps) {
  return (
    <img
      className={className}
      src={brandSymbol}
      alt={labelled ? 'Símbolo PraxIA: arcos e pontos representando desenvolvimento' : ''}
      aria-hidden={labelled ? undefined : true}
    />
  )
}
