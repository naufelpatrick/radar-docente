import { ArrowRight, BookOpenText, Building2, GraduationCap } from 'lucide-react'
import { getRecommendedProduct, teacherProducts } from '../data/products'
import type { ScoreBandId } from '../types/result'
import { CommercialLink } from './CommercialLink'

interface ResultCommercialOffersProps {
  bandId: ScoreBandId
  sourcePage: 'result' | 'demo_result'
}

export function ResultCommercialOffers({ bandId, sourcePage }: ResultCommercialOffersProps) {
  const recommended = getRecommendedProduct(bandId)

  return (
    <section className="result-commercial" aria-labelledby={`${sourcePage}-commercial-title`}>
      <div className="result-commercial__heading">
        <p className="flow-eyebrow">PRÓXIMOS CAMINHOS</p>
        <h2 id={`${sourcePage}-commercial-title`}>Continue sua trajetória com a PraxIA</h2>
        <p>Seu resultado é um ponto de partida. Escolha uma forma de transformar essa leitura em desenvolvimento e prática docente.</p>
      </div>
      <div className="result-commercial__individual">
        {teacherProducts.map((product) => {
          const Icon = product.id === 'ebook' ? BookOpenText : GraduationCap
          const isRecommended = product.id === recommended?.id
          return (
            <article key={product.id} className={isRecommended ? 'is-recommended' : ''}>
              {isRecommended && <span>Recomendado para o seu momento</span>}
              <Icon aria-hidden="true" />
              <h3>{product.name}</h3>
              <p>{product.id === 'ebook'
                ? 'Transforme os próximos passos do seu resultado em atividades, critérios e decisões aplicáveis ao cotidiano docente.'
                : 'Interprete seus resultados com acompanhamento individual e construa um plano conectado aos seus desafios reais.'}</p>
              <CommercialLink
                to={product.href}
                event={product.id === 'ebook' ? 'select_ebook' : 'select_mentoring'}
                parameters={{ product_id: product.id, audience: 'teachers', source_page: sourcePage }}
              >
                {product.ctaLabel}<ArrowRight aria-hidden="true" />
              </CommercialLink>
            </article>
          )
        })}
      </div>
      <aside className="result-commercial__institutional">
        <Building2 aria-hidden="true" />
        <div>
          <span>PARA ESCOLAS, FACULDADES E ORGANIZAÇÕES</span>
          <h3>Quer desenvolver toda a equipe docente?</h3>
          <p>A PraxIA oferece palestras e workshops para escolas, faculdades e organizações educacionais.</p>
          <p>Leve a discussão sobre fluência digital, inteligência artificial, autoria e transformação da aprendizagem para sua instituição.</p>
        </div>
        <div className="result-commercial__actions">
          <CommercialLink
            to="/para-instituicoes#solicitar-proposta"
            event="select_institutional_solution"
            parameters={{ audience: 'institutions', source_page: sourcePage, solution_type: 'both' }}
            className="button-link"
          >Solicitar proposta para minha instituição<ArrowRight aria-hidden="true" /></CommercialLink>
          <CommercialLink
            to="/para-instituicoes"
            event="select_institutional_solution"
            parameters={{ audience: 'institutions', source_page: sourcePage, solution_type: 'both' }}
          >Conhecer soluções institucionais</CommercialLink>
        </div>
      </aside>
    </section>
  )
}
