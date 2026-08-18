import { ArrowRight, ChevronRight, FileText, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { getPublishedBlogArticles } from '../data/blogArticles'
import { getTeamMember } from '../data/team'
import { buildSiteUrl } from '../config/site'

export function AuthorPage({ memberId }: { memberId: string }) {
  const member = getTeamMember(memberId)
  if (!member) return null
  const path = `/autores/${member.id}`
  const articles = getPublishedBlogArticles().filter((article) => article.author === member.name)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        name: `${member.name} — autor na PraxIA`,
        url: buildSiteUrl(path),
        inLanguage: 'pt-BR',
        mainEntity: {
          '@type': 'Person',
          name: member.name,
          description: member.fullBio,
          image: buildSiteUrl(member.photo!.src),
          url: buildSiteUrl(path),
          sameAs: member.links.map((link) => link.href),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: buildSiteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Sobre', item: buildSiteUrl('/sobre') },
          { '@type': 'ListItem', position: 3, name: member.name, item: buildSiteUrl(path) },
        ],
      },
    ],
  }

  return (
    <>
      <Seo title={`${member.name} — autor`} description={member.shortBio} path={path} jsonLd={schema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="about" />
      <main id="conteudo-principal" className="author-page">
        <header className="author-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><Link to="/sobre">Sobre</Link><ChevronRight aria-hidden="true" /><span aria-current="page">{member.name}</span></nav>
            <div className="author-hero__grid">
              <img src={member.photo!.src} alt={member.photo!.alt} width={member.photo!.width} height={member.photo!.height} />
              <div><p className="method-kicker">AUTOR E EQUIPE PRAXIA</p><h1>{member.name}</h1><p className="author-hero__lead">{member.shortBio}</p><p>{member.fullBio}</p><div className="author-links">{member.links.map((link) => { const Icon = link.type === 'linkedin' ? Linkedin : FileText; return <a key={link.type} href={link.href} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true" />{link.label}</a> })}</div></div>
            </div>
          </div>
        </header>
        <section className="author-articles">
          <div className="shell"><p className="method-kicker">PUBLICAÇÕES</p><h2>Artigos de {member.name}</h2>{articles.length ? <div>{articles.map((article) => <article key={article.path}><span>{article.category}</span><h3><Link to={article.path}>{article.title}</Link></h3><p>{article.summary}</p><Link to={article.path}>Ler artigo <ArrowRight aria-hidden="true" /></Link></article>)}</div> : <p>Novos artigos serão reunidos nesta página quando publicados.</p>}</div>
        </section>
      </main>
      <Footer />
    </>
  )
}
