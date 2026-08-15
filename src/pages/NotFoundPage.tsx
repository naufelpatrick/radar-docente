import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Página não encontrada"
        description="A página solicitada não existe ou foi movida."
        path="/pagina-nao-encontrada"
        robots="noindex, follow"
        omitCanonical
      />
      <InstitutionalHeader />
      <main id="conteudo-principal" className="shell" style={{ paddingBlock: '8rem' }}>
        <p className="method-kicker">ERRO 404</p>
        <h1>Página não encontrada</h1>
        <p>O endereço pode estar incorreto ou o conteúdo pode ter sido movido.</p>
        <p><Link to="/">Ir para o início</Link> · <Link to="/radar-docente">Conhecer o Radar Docente</Link> · <Link to="/blog">Explorar o Blog</Link></p>
      </main>
      <Footer />
    </>
  )
}
