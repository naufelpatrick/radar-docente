import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'

interface InstitutionalHeaderProps {
  currentPage?: 'home' | 'methodology' | 'radar' | 'about' | 'blog' | 'contact'
}

export function InstitutionalHeader({ currentPage }: InstitutionalHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="institutional-header">
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
          <Link to="/" aria-current={currentPage === 'home' ? 'page' : undefined}>Início</Link>
          <Link to="/radar-docente" aria-current={currentPage === 'radar' ? 'page' : undefined}>Radar Docente</Link>
          <Link to="/metodologia" aria-current={currentPage === 'methodology' ? 'page' : undefined}>Metodologia</Link>
          <Link to="/sobre" aria-current={currentPage === 'about' ? 'page' : undefined}>Sobre</Link>
          <Link to="/blog" aria-current={currentPage === 'blog' ? 'page' : undefined}>Blog</Link>
          <Link to="/contato" aria-current={currentPage === 'contact' ? 'page' : undefined}>Contato</Link>
          <ButtonLink href="/radar" variant="light">Fazer o Radar</ButtonLink>
        </nav>
      </div>
    </header>
  )
}
