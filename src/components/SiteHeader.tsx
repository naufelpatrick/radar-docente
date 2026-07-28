import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'

export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#inicio" className="site-header__brand" aria-label="PráxIA, voltar ao início">
        <BrandMark inverse />
      </a>
      <nav aria-label="Navegação principal">
        <a href="#o-que-voce-recebe">O que você recebe</a>
        <a href="#como-funciona">Como funciona</a>
        <ButtonLink href="/radar" variant="light">Fazer o Radar</ButtonLink>
      </nav>
    </header>
  )
}
