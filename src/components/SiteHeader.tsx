import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'
import { Link } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" aria-label="PráxIA, página inicial">
        <BrandMark inverse />
      </Link>
      <nav aria-label="Navegação principal">
        <Link to="/radar-docente">Diagnóstico</Link>
        <Link to="/ebook">E-book</Link>
        <Link to="/mentoria">Mentoria</Link>
        <Link to="/para-instituicoes">Para instituições</Link>
        <Link to="/blog">Blog</Link>
        <ButtonLink href="/radar" variant="light">Fazer o Radar</ButtonLink>
      </nav>
    </header>
  )
}
