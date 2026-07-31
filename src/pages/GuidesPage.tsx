import { ArrowRight, BookMarked, ChevronRight, ClipboardCheck, Compass, Layers3, Route, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'

const guideTracks = [
  { icon: Compass, title: 'Começar com IA sem começar pela ferramenta', text: 'Um percurso para definir propósito, dados, transparência, autoria e revisão antes de escolher uma plataforma.', status: 'Artigo disponível', href: '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta' },
  { icon: ClipboardCheck, title: 'Planejar uma atividade com evidências observáveis', text: 'Perguntas para aproximar objetivo, participação dos estudantes, critérios e acompanhamento da aprendizagem.', status: 'Em preparação' },
  { icon: Layers3, title: 'Ler as seis dimensões da fluência digital e em IA', text: 'Um guia para relacionar planejamento, criação, mediação, avaliação, IA e ética sem isolar competências.', status: 'Em preparação' },
]

const guideSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', name: 'Guias PráxIA', description: 'Guias práticos para professores sobre fluência digital, inteligência artificial, planejamento, avaliação, ética e autoria.', url: 'https://radar-docente-pi.vercel.app/guias', inLanguage: 'pt-BR' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Guias', item: 'https://radar-docente-pi.vercel.app/guias' },
    ] },
  ],
}

export function GuidesPage() {
  return (
    <>
      <Seo title="Guias" description="Percursos práticos para planejar, avaliar e utilizar tecnologia e IA com intenção, critérios, autoria e responsabilidade." path="/guias" jsonLd={guideSchema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader />
      <main id="conteudo-principal" className="guides-page">
        <header className="guides-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Guias</span></nav>
            <div className="guides-hero__grid">
              <div><p className="method-kicker">PERCURSOS PARA A PRÁTICA</p><h1>Guias para transformar uma pergunta pedagógica em <em>decisões observáveis.</em></h1><p>Materiais organizados por situações reais de planejamento, avaliação e uso de IA — com critérios, exemplos, limites e um próximo movimento possível.</p></div>
              <div className="guides-hero__visual" aria-hidden="true"><BookMarked /><span>pergunta</span><Route /><span>critério</span><Sparkles /><span>prática</span></div>
            </div>
          </div>
        </header>

        <section className="guides-principles">
          <div className="shell">
            <div className="method-heading"><div><p className="method-kicker">COMO LER ESTES GUIAS</p><h2>Orientação suficiente para agir. Contexto suficiente para adaptar.</h2></div><p>Os materiais não funcionam como receitas. Cada percurso explicita o que precisa ser decidido pelo professor e o que depende da turma e da instituição.</p></div>
            <div className="guides-principles__grid"><article><span>01</span><h3>Começar pelo objetivo</h3><p>A ferramenta só entra depois que a aprendizagem esperada está clara.</p></article><article><span>02</span><h3>Tornar critérios visíveis</h3><p>Participação, dados, autoria e revisão são parte do planejamento.</p></article><article><span>03</span><h3>Observar e ajustar</h3><p>Cada guia termina em evidência e pergunta para a próxima decisão.</p></article></div>
          </div>
        </section>

        <section className="guides-collection">
          <div className="shell">
            <div className="method-heading"><div><p className="method-kicker">GUIAS E PERCURSOS</p><h2>Escolha pela decisão que você precisa tomar.</h2></div><p>A disponibilidade aparece explicitamente. Nenhum botão leva a um material vazio.</p></div>
            <div className="guides-collection__grid">
              {guideTracks.map(({ icon: Icon, title, text, status, href }, index) => (
                <article key={title}><div><Icon aria-hidden="true" /><span>0{index + 1}</span></div><small className={href ? 'is-available' : ''}>{status}</small><h3>{title}</h3><p>{text}</p>{href ? <Link to={href}>Abrir percurso <ArrowRight aria-hidden="true" /></Link> : <span className="guides-coming">Publicação futura</span>}</article>
              ))}
            </div>
          </div>
        </section>

        <section className="guides-cta"><div className="shell"><div><p className="method-kicker">UM GUIA PERSONALIZADO COMEÇA NO RADAR</p><h2>Reconheça a dimensão que pede seu próximo experimento.</h2></div><ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar</ButtonLink></div></section>
      </main>
      <Footer />
    </>
  )
}
