import { Menu, X } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'
import { Link } from 'react-router-dom'
import { useMobileNavigation } from '../hooks/useMobileNavigation'

export function SiteHeader() {
  const { open, setOpen, close, rootRef } = useMobileNavigation()

  return (
    <header className="site-header" ref={rootRef}>
      <div className="shell site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="PráxIA, página inicial">
          <BrandMark inverse />
        </Link>
        <button
          className="site-header__menu"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="site-navigation" className={open ? 'is-open' : ''} aria-label="Navegação principal">
          <Link to="/radar-docente" onClick={close}>Diagnóstico</Link>
          <Link to="/fluencia-digital-para-professores" onClick={close}>Fluência Digital</Link>
          <Link to="/ebook" onClick={close}>E-book</Link>
          <Link to="/mentoria" onClick={close}>Mentoria</Link>
          <Link to="/para-instituicoes" onClick={close}>Para instituições</Link>
          <Link to="/blog" onClick={close}>Blog</Link>
          <ButtonLink href="/radar" variant="light" onClick={close}>Fazer o Radar</ButtonLink>
        </nav>
      </div>
    </header>
  )
}
