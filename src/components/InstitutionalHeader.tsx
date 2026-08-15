import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMobileNavigation } from '../hooks/useMobileNavigation'
import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'

interface InstitutionalHeaderProps {
  currentPage?: 'home' | 'methodology' | 'radar' | 'fluency' | 'about' | 'blog' | 'contact' | 'ebook' | 'mentoring' | 'institutions'
}

export function InstitutionalHeader({ currentPage }: InstitutionalHeaderProps) {
  const { open, setOpen, close, rootRef } = useMobileNavigation()

  return (
    <header className="institutional-header" ref={rootRef}>
      <div className="shell institutional-header__inner">
        <Link to="/" className="institutional-header__brand" aria-label="PráxIA, página inicial">
          <BrandMark inverse />
        </Link>
        <button
          className="institutional-header__menu"
          type="button"
          aria-expanded={open}
          aria-controls="institutional-navigation"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="institutional-navigation"
          className={open ? 'is-open' : ''}
          aria-label="Navegação principal"
        >
          <Link to="/radar-docente" onClick={close} aria-current={currentPage === 'radar' ? 'page' : undefined}>Diagnóstico</Link>
          <Link to="/fluencia-digital-para-professores" onClick={close} aria-current={currentPage === 'fluency' ? 'page' : undefined}>Fluência Digital</Link>
          <Link to="/ebook" onClick={close} aria-current={currentPage === 'ebook' ? 'page' : undefined}>E-book</Link>
          <Link to="/mentoria" onClick={close} aria-current={currentPage === 'mentoring' ? 'page' : undefined}>Mentoria</Link>
          <Link to="/para-instituicoes" onClick={close} aria-current={currentPage === 'institutions' ? 'page' : undefined}>Para instituições</Link>
          <Link to="/blog" onClick={close} aria-current={currentPage === 'blog' ? 'page' : undefined}>Blog</Link>
          <ButtonLink href="/radar" variant="light" onClick={close}>Fazer o Radar</ButtonLink>
        </nav>
      </div>
    </header>
  )
}
