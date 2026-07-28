import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ButtonLink } from './ButtonLink'

interface InstitutionalHeaderProps {
  currentPage?: 'home' | 'methodology' | 'radar' | 'about' | 'blog' | 'contact' | 'ebook' | 'mentoring' | 'institutions'
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
          <Link to="/radar-docente" aria-current={currentPage === 'radar' ? 'page' : undefined}>Diagnóstico</Link>
          <Link to="/ebook" aria-current={currentPage === 'ebook' ? 'page' : undefined}>E-book</Link>
          <Link to="/mentoria" aria-current={currentPage === 'mentoring' ? 'page' : undefined}>Mentoria</Link>
          <Link to="/para-instituicoes" aria-current={currentPage === 'institutions' ? 'page' : undefined}>Para instituições</Link>
          <Link to="/blog" aria-current={currentPage === 'blog' ? 'page' : undefined}>Blog</Link>
          <ButtonLink href="/radar" variant="light">Fazer o Radar</ButtonLink>
        </nav>
      </div>
    </header>
  )
}
