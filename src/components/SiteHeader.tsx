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
        <Link to="/" aria-current="page">Início</Link>
        <Link to="/radar-docente">Radar Docente</Link>
        <Link to="/metodologia">Metodologia</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contato">Contato</Link>
        <ButtonLink href="/radar" variant="light">Fazer o Radar</ButtonLink>
      </nav>
    </header>
  )
}
