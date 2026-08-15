import { ArrowRight, BookOpenText, Building2, GraduationCap, Mic2, UsersRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { institutionalProducts, teacherProducts } from '../data/products'
import { trackCommercialEvent } from '../services/commercialAnalytics'
import { CommercialLink } from './CommercialLink'

const icons = { ebook: BookOpenText, mentoring: GraduationCap, workshop: UsersRound, talk: Mic2 }

export function CommercialSolutions() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackCommercialEvent('view_products_section', { source_page: 'home' })
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section commercial-solutions" ref={sectionRef} aria-labelledby="solucoes-title">
      <div className="shell">
        <div className="commercial-solutions__heading" data-reveal="up">
          <p className="eyebrow eyebrow--dark">SOLUÇÕES PRÁXIA</p>
          <h2 id="solucoes-title">Soluções para transformar<br /><em>fluência em prática.</em></h2>
          <p>A PraxIA ajuda professores e instituições de ensino a compreender, desenvolver e aplicar competências digitais e de inteligência artificial com intencionalidade pedagógica.</p>
        </div>

        <div className="commercial-path commercial-path--teachers">
          <div className="commercial-path__label"><span>01</span><div><p>PARA PROFESSORES</p><h3>Desenvolvimento conectado à sua prática</h3></div></div>
          <div className="commercial-path__products">
            {teacherProducts.map((product) => {
              const Icon = icons[product.id]
              return (
                <article className="commercial-product" key={product.id} data-reveal="up">
                  <Icon aria-hidden="true" />
                  <p>{product.category === 'ebook' ? 'GUIA PRÁTICO' : 'ACOMPANHAMENTO INDIVIDUAL'}</p>
                  <h3>{product.category === 'ebook' ? <>E-book — {product.name}</> : product.name}</h3>
                  <p>{product.description}</p>
                  <ul>{product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                  <CommercialLink
                    to={product.href}
                    event={product.id === 'ebook' ? 'select_ebook' : 'select_mentoring'}
                    parameters={{ product_id: product.id, audience: 'teachers', source_page: 'home' }}
                  >
                    {product.ctaLabel}<ArrowRight aria-hidden="true" />
                  </CommercialLink>
                </article>
              )
            })}
          </div>
        </div>

        <div className="commercial-path commercial-path--institutions">
          <div className="commercial-institution__intro" data-reveal="left">
            <Building2 aria-hidden="true" />
            <p>PARA INSTITUIÇÕES</p>
            <h3>Desenvolvimento para toda a equipe docente</h3>
            <p>Palestras e workshops personalizados para escolas, faculdades e organizações educacionais que desejam desenvolver fluência digital e uso pedagógico responsável da inteligência artificial.</p>
            <CommercialLink
              to="/para-instituicoes#solicitar-proposta"
              event="select_institutional_solution"
              parameters={{ audience: 'institutions', source_page: 'home', solution_type: 'both' }}
              className="button-link"
            >
              Solicitar uma proposta<ArrowRight aria-hidden="true" />
            </CommercialLink>
          </div>
          <div className="commercial-institution__solutions">
            {institutionalProducts.map((product) => {
              const Icon = icons[product.id]
              return (
                <article key={product.id} data-reveal="right">
                  <Icon aria-hidden="true" />
                  <span>{product.id === 'workshop' ? 'WORKSHOP' : 'PALESTRA'}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div>{product.duration?.join(' · ')} · {product.format?.join(' ou ')}</div>
                  <CommercialLink
                    to={product.href}
                    event="select_institutional_solution"
                    parameters={{ product_id: product.id, audience: 'institutions', source_page: 'home', solution_type: product.id === 'workshop' ? 'workshop' : 'talk' }}
                  >
                    {product.ctaLabel}<ArrowRight aria-hidden="true" />
                  </CommercialLink>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
