import { BrandMark } from './BrandMark'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <BrandMark inverse />
          <p>Transforme fluência em prática docente.</p>
        </div>
        <div className="footer__legal">
          <nav aria-label="Navegação do rodapé">
            <Link to="/">Início</Link>
            <Link to="/metodologia">Metodologia</Link>
            <Link to="/radar-docente">Radar Docente</Link>
            <Link to="/sobre">Sobre</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contato">Contato</Link>
            <Link to="/guias">Guias</Link>
            <Link to="/competencias">Competências</Link>
            <Link to="/ferramentas">Ferramentas</Link>
          </nav>
          <p>Projeto independente de Patrick Naufel.</p>
          <p>Suas respostas serão tratadas com privacidade e usadas apenas para gerar sua leitura orientativa.</p>
          <p>© {new Date().getFullYear()} PráxIA.</p>
        </div>
      </div>
    </footer>
  )
}
