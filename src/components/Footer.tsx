import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <BrandMark inverse />
          <p>Transforme fluência em prática docente.</p>
        </div>
        <div className="footer__legal">
          <p>Projeto independente de Patrick Naufel.</p>
          <p>Suas respostas serão tratadas com privacidade e usadas apenas para gerar sua leitura orientativa.</p>
          <p>© {new Date().getFullYear()} PráxIA.</p>
        </div>
      </div>
    </footer>
  )
}
