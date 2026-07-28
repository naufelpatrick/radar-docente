import { ArrowLeft, Clock3 } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { RadarGraphic } from '../components/RadarGraphic'

export function RadarPage() {
  return (
    <main className="preparation">
      <div className="preparation__glow" aria-hidden="true" />
      <header className="preparation__header">
        <a href="/" aria-label="Voltar para a página inicial"><BrandMark inverse /></a>
      </header>
      <section className="preparation__content">
        <div className="preparation__graphic"><RadarGraphic labelled /></div>
        <p className="eyebrow"><Clock3 aria-hidden="true" size={15} /> RADAR EM PREPARAÇÃO</p>
        <h1>Estamos calibrando<br /><em>cada dimensão.</em></h1>
        <p>O questionário definitivo está sendo construído com cuidado para oferecer uma leitura responsável, útil e coerente com a prática docente.</p>
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" size={18} /> Voltar para a página inicial</a>
      </section>
    </main>
  )
}
