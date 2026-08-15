import { BrandMark } from './BrandMark'
import { Link } from 'react-router-dom'
import { Facebook, Instagram } from 'lucide-react'
import { openCookiePreferences } from '../services/cookieConsent'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <BrandMark inverse />
            <p>Transforme fluência em prática docente.</p>
            <nav className="footer__social" aria-label="Redes sociais da PraxIA">
              <a href="https://www.instagram.com/radarpraxia/" target="_blank" rel="noopener noreferrer" aria-label="Acompanhar a PraxIA no Instagram">
                <Instagram aria-hidden="true" />
                <span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/radarpraxia" target="_blank" rel="noopener noreferrer" aria-label="Acompanhar a PraxIA no Facebook">
                <Facebook aria-hidden="true" />
                <span>Facebook</span>
              </a>
            </nav>
          </div>
          <nav className="footer__navigation" aria-label="Navegação do rodapé">
            <div>
              <strong>Conheça</strong>
              <Link to="/">Início</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/contato">Contato</Link>
              <Link to="/para-instituicoes">Para instituições</Link>
              <Link to="/privacidade">Política de Privacidade</Link>
            </div>
            <div>
              <strong>Radar</strong>
              <Link to="/radar-docente">Radar Docente</Link>
              <Link to="/metodologia">Metodologia</Link>
              <Link to="/competencias">Competências</Link>
            </div>
            <div>
              <strong>Conteúdos</strong>
              <Link to="/blog">Blog</Link>
              <Link to="/guias">Guias</Link>
              <Link to="/ferramentas">Ferramentas</Link>
              <a href="/feed.xml" type="application/rss+xml" aria-label="Assinar o feed RSS do Blog PraxIA">RSS</a>
              <Link to="/ebook">E-book</Link>
              <Link to="/mentoria">Mentoria</Link>
            </div>
          </nav>
        </div>
        <div className="footer__bottom">
          <span>Projeto independente de Patrick Naufel e Giovani Letti.</span>
          <span><Link to="/privacidade">Política de Privacidade</Link> · <button type="button" onClick={openCookiePreferences}>Preferências de cookies</button></span>
          <span>© {new Date().getFullYear()} PraxIA.</span>
        </div>
      </div>
    </footer>
  )
}
