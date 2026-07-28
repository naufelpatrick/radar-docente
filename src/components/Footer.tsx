import { BrandMark } from './BrandMark'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <BrandMark inverse />
            <p>Transforme fluência em prática docente.</p>
          </div>
          <nav className="footer__navigation" aria-label="Navegação do rodapé">
            <div>
              <strong>Conheça</strong>
              <Link to="/">Início</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/contato">Contato</Link>
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
            </div>
          </nav>
        </div>
        <div className="footer__bottom">
          <span>Projeto independente de Patrick Naufel.</span>
          <span>Suas respostas são tratadas com privacidade e usadas apenas para gerar sua leitura orientativa.</span>
          <span>© {new Date().getFullYear()} PráxIA.</span>
        </div>
      </div>
    </footer>
  )
}
