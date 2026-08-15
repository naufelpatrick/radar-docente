import {
  ArrowRight,
  BookOpenText,
  ExternalLink,
  Gauge,
  Globe2,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  Mic2,
  UsersRound,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Seo } from '../components/Seo'
import { getPublishedBlogArticles } from '../data/blogArticles'
import { praxiaLinks, type LinksPageEvent } from '../data/linksPage'
import { trackLinksClick } from '../services/linksAnalytics'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

type LinkCard = {
  title: string
  description: string
  label: string
  href: string
  event: LinksPageEvent
  icon: Icon
}

const offers: LinkCard[] = [
  {
    title: 'IA na Prática Docente',
    description: 'Um guia aplicado para professores que desejam utilizar inteligência artificial com intencionalidade pedagógica, senso crítico e segurança.',
    label: 'Conhecer o e-book',
    href: praxiaLinks.ebook,
    event: 'links_ebook_click',
    icon: BookOpenText,
  },
  {
    title: 'Mentoria para professores',
    description: 'Acompanhamento individual para desenvolver Fluência Digital e aplicar tecnologias e inteligência artificial à realidade da docência.',
    label: 'Conhecer a mentoria',
    href: praxiaLinks.mentoring,
    event: 'links_mentoria_click',
    icon: GraduationCap,
  },
  {
    title: 'Workshops para escolas',
    description: 'Formações práticas para equipes docentes sobre Fluência Digital, inteligência artificial e inovação educacional.',
    label: 'Solicitar proposta',
    href: praxiaLinks.workshops,
    event: 'links_workshop_click',
    icon: UsersRound,
  },
  {
    title: 'Palestras',
    description: 'Conteúdos para eventos, semanas pedagógicas, encontros de formação e jornadas de desenvolvimento docente.',
    label: 'Consultar disponibilidade',
    href: praxiaLinks.lectures,
    event: 'links_palestra_click',
    icon: Mic2,
  },
]

function eventHandler(event: LinksPageEvent, name: string, destination: string, position: number) {
  return () => trackLinksClick(event, {
    link_name: name,
    link_destination: destination,
    link_position: position,
  })
}

export function LinksPage() {
  const latestArticle = getPublishedBlogArticles()[0]

  return (
    <>
      <Seo
        title="Links"
        description="Diagnóstico, artigos, conteúdos, mentorias, workshops e palestras para desenvolver a Fluência Digital e em IA de professores."
        path="/links"
        robots="noindex, follow"
      />
      <main className="links-page">
        <div className="links-page__shell">
          <header className="links-page__header">
            <Link to="/" aria-label="PraxIA, ir para o site oficial"><BrandMark inverse /></Link>
            <p>Fluência Digital e em IA para professores.</p>
            <h1>A IA não substitui professores.<br /><em>Amplia quem está preparado.</em></h1>
          </header>

          <section className="links-primary" aria-labelledby="links-diagnostic-title">
            <Gauge aria-hidden="true" />
            <div>
              <span>DIAGNÓSTICO GRATUITO</span>
              <h2 id="links-diagnostic-title">Descubra seu nível de Fluência Digital</h2>
              <p>Faça o diagnóstico gratuito e receba uma leitura inicial sobre sua preparação para integrar tecnologias digitais e inteligência artificial à prática docente.</p>
              <Link to={praxiaLinks.diagnostic} onClick={eventHandler('links_diagnostico_click', 'Diagnóstico', praxiaLinks.diagnostic, 1)}>
                Fazer diagnóstico <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="links-blog" aria-labelledby="links-blog-title">
            {latestArticle?.coverImage && <img src={latestArticle.coverImage.src} alt={latestArticle.coverImage.alt} loading="lazy" />}
            <div>
              <span>{latestArticle ? `ARTIGO RECENTE · ${latestArticle.category}` : 'CONTEÚDOS PRÁXIA'}</span>
              <h2 id="links-blog-title">Conteúdos para a prática docente</h2>
              <p>Artigos sobre Fluência Digital, inteligência artificial, inovação educacional e uso consciente de tecnologia por professores.</p>
              {latestArticle && <strong>{latestArticle.title}</strong>}
              <Link to={praxiaLinks.blog} onClick={eventHandler('links_blog_click', 'Blog', praxiaLinks.blog, 2)}>
                Acessar o blog <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="links-offers" aria-label="Produtos e serviços PraxIA">
            {offers.map((offer, index) => {
              const Icon = offer.icon
              return (
                <article key={offer.href}>
                  <Icon aria-hidden="true" />
                  <div>
                    <h2>{offer.title}</h2>
                    <p>{offer.description}</p>
                    <Link to={offer.href} onClick={eventHandler(offer.event, offer.title, offer.href, index + 3)}>
                      {offer.label} <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="links-social" aria-labelledby="links-social-title">
            <h2 id="links-social-title">Acompanhe a PraxIA</h2>
            <div>
              <a href={praxiaLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={eventHandler('links_instagram_click', 'Instagram', praxiaLinks.instagram, 7)}>
                <Instagram aria-hidden="true" /> Instagram <ExternalLink aria-hidden="true" />
              </a>
              <a href={praxiaLinks.linkedin} target="_blank" rel="noopener noreferrer" onClick={eventHandler('links_linkedin_click', 'LinkedIn', praxiaLinks.linkedin, 8)}>
                <Linkedin aria-hidden="true" /> LinkedIn <ExternalLink aria-hidden="true" />
              </a>
              <Link to={praxiaLinks.website} onClick={eventHandler('links_site_click', 'Site oficial', praxiaLinks.website, 9)}>
                <Globe2 aria-hidden="true" /> Site oficial <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="links-contact" aria-labelledby="links-contact-title">
            <Mail aria-hidden="true" />
            <div>
              <h2 id="links-contact-title">Fale com o PraxIA</h2>
              <p>Entre em contato para contratar palestras, workshops, mentorias ou conversar sobre parcerias.</p>
            </div>
            <Link to={praxiaLinks.contact} onClick={eventHandler('links_contato_click', 'Contato', praxiaLinks.contact, 10)}>
              Entrar em contato <ArrowRight aria-hidden="true" />
            </Link>
          </section>

          <section className="links-about" aria-labelledby="links-about-title">
            <span>QUEM SOMOS</span>
            <h2 id="links-about-title">Educação, tecnologia e prática docente.</h2>
            <p>O PraxIA é uma iniciativa de Patrick Naufel e Giovani Letti voltada ao desenvolvimento da Fluência Digital e em IA de professores, escolas e instituições de ensino.</p>
            <Link to={praxiaLinks.about}>Conheça a PraxIA <ArrowRight aria-hidden="true" /></Link>
          </section>

          <footer className="links-footer">
            <BrandMark inverse compact />
            <p>Patrick Naufel e Giovani Letti</p>
            <Link to={praxiaLinks.privacy}>Política de Privacidade</Link>
            <small>© {new Date().getFullYear()} PraxIA.</small>
          </footer>
        </div>
      </main>
    </>
  )
}
