import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { EbookCheckoutForm } from '../components/EbookCheckoutForm'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { MentoringLeadForm } from '../components/MentoringLeadForm'
import { Seo } from '../components/Seo'
import { getProduct } from '../data/products'
import { team } from '../data/team'
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
              <a className="button-link button-link--light" href={isEbook ? '#comprar' : '#manifestar-interesse'}>
                {isEbook ? 'Baixar gratuitamente' : 'Manifestar interesse'}<ArrowRight aria-hidden="true" />
              </a>
              <small>{isEbook ? 'Acesso digital gratuito após o preenchimento do formulário.' : 'Os detalhes de disponibilização estão em preparação. Não há pagamento nesta etapa.'}</small>
            </div>
            {isEbook
              ? <img className="ebook-cover" src="/ebook-cover.jpg" alt="Capa do caderno IA na prática docente" width="540" height="720" />
              : <div className="teacher-product-visual" aria-hidden="true"><span>1:1</span><i /><i /><i /></div>}
          </div>
        </section>
        {isEbook && (
          <section className="section ebook-purchase" id="comprar">
            <div className="shell ebook-purchase__grid">
              <div>
                <p className="eyebrow eyebrow--dark">O QUE VEM NO CADERNO</p>
                <h2>32 páginas para levar a IA da intenção à prática.</h2>
                <ul>
                  <li><strong>12 atividades</strong><span>Propostas que podem ser adaptadas a diferentes contextos.</span></li>
                  <li><strong>3 sequências didáticas</strong><span>Percursos completos para planejar, criar e avaliar.</span></li>
                  <li><strong>Instrumentos aplicáveis</strong><span>Rubricas, perguntas e páginas de trabalho para apoiar decisões.</span></li>
                </ul>
              </div>
              <EbookCheckoutForm />
            </div>
          </section>
        )}
        <section className="section teacher-product-content">
          <div className="shell teacher-product-content__grid">
            <div>
              <p className="eyebrow eyebrow--dark">O QUE VOCÊ ENCONTRA</p>
              <h2>{isEbook ? 'Decisões pedagógicas traduzidas em prática.' : 'Uma conversa orientada pelo seu contexto.'}</h2>
              {!isEbook && <p>A mentoria é conduzida pessoalmente pelos professores Patrick Naufel e Giovani Letti, a partir dos desafios e das condições reais de cada docente.</p>}
            </div>
            <ul>{product.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" />{benefit}</li>)}</ul>
          </div>
        </section>
        {!isEbook && (
          <section className="section mentoring-interest" id="manifestar-interesse">
            <div className="shell mentoring-interest__grid">
              <div>
                <p className="eyebrow eyebrow--dark">MANIFESTE SEU INTERESSE</p>
                <h2>Conte um pouco sobre seu contexto.</h2>
                <p>Este primeiro contato ajuda a compreender sua necessidade e verificar como a mentoria pode contribuir. O envio não implica contratação ou pagamento.</p>
                <div className="mentoring-experts" aria-label="Professores responsáveis pela mentoria">
                  {team.map((member) => member.photo && (
                    <div key={member.id}>
                      <img src={member.photo.src} alt="" width={member.photo.width} height={member.photo.height} loading="lazy" decoding="async" />
                      <span><strong>{member.name}</strong><small>Professor e pesquisador</small></span>
                    </div>
                  ))}
                </div>
              </div>
              <MentoringLeadForm />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
