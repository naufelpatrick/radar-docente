import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CommercialLink } from '../components/CommercialLink'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { getProduct } from '../data/products'
import { useScrollMotion } from '../hooks/useScrollMotion'

interface TeacherProductPageProps {
  productId: 'ebook' | 'mentoring'
}

export function TeacherProductPage({ productId }: TeacherProductPageProps) {
  useScrollMotion()
  const product = getProduct(productId)!
  const isEbook = productId === 'ebook'
  const title = `${product.name} | PráxIA`

  return (
    <>
      <Seo title={title} description={product.description} path={product.href} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage={productId} />
      <main id="conteudo-principal" className="teacher-product-page">
        <section className="teacher-product-hero">
          <div className="shell teacher-product-hero__grid">
            <div>
              <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">{isEbook ? 'E-book' : 'Mentoria'}</span></nav>
              <p className="eyebrow">{isEbook ? 'GUIA PARA PROFESSORES' : 'ACOMPANHAMENTO INDIVIDUAL'}</p>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <CommercialLink
                to={isEbook ? '/contato' : '/contato'}
                event={isEbook ? 'select_ebook' : 'select_mentoring'}
                parameters={{ product_id: product.id, audience: 'teachers', source_page: product.href }}
                className="button-link button-link--light"
              >
                Manifestar interesse<ArrowRight aria-hidden="true" />
              </CommercialLink>
              <small>Os detalhes de disponibilização estão em preparação. Não há pagamento nesta etapa.</small>
            </div>
            <div className="teacher-product-visual" aria-hidden="true"><span>{isEbook ? 'IA' : '1:1'}</span><i /><i /><i /></div>
          </div>
        </section>
        <section className="section teacher-product-content">
          <div className="shell teacher-product-content__grid">
            <div><p className="eyebrow eyebrow--dark">O QUE VOCÊ ENCONTRA</p><h2>{isEbook ? 'Decisões pedagógicas traduzidas em prática.' : 'Uma conversa orientada pelo seu contexto.'}</h2></div>
            <ul>{product.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" />{benefit}</li>)}</ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
