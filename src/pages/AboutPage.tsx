import {
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  Compass,
  HeartHandshake,
  Layers3,
  MessageCircleMore,
  Route,
  Scale,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { TeamProfiles } from '../components/TeamProfiles'
import { team, teamIntroduction } from '../data/team'
import { useScrollMotion } from '../hooks/useScrollMotion'

const values = [
  {
    icon: MessageCircleMore,
    title: 'Clareza',
    text: 'Explicar tecnologia e IA em linguagem acessível, sem simplificar demais as decisões pedagógicas.',
  },
  {
    icon: Scale,
    title: 'Responsabilidade',
    text: 'Reconhecer limites, explicitar critérios e evitar promessas que o instrumento ou a tecnologia não podem sustentar.',
  },
  {
    icon: HeartHandshake,
    title: 'Acolhimento',
    text: 'Respeitar diferentes contextos, repertórios e ritmos de desenvolvimento profissional docente.',
  },
  {
    icon: BookOpenCheck,
    title: 'Intenção pedagógica',
    text: 'Começar por objetivos de aprendizagem e pelo contexto antes de escolher ferramentas ou automatizar processos.',
  },
  {
    icon: Route,
    title: 'Desenvolvimento',
    text: 'Transformar reflexão em pequenos experimentos que possam ser observados, revistos e incorporados à prática.',
  },
  {
    icon: Layers3,
    title: 'Coerência',
    text: 'Articular planejamento, criação, mediação, avaliação, IA e ética como partes de uma mesma prática.',
  },
]

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'Sobre a PraxIA',
      description: 'Conheça a história, o propósito, a missão, a visão e os valores da PraxIA.',
      url: 'https://www.radarpraxia.com/sobre',
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'WebSite', name: 'PraxIA', url: 'https://www.radarpraxia.com/' },
      about: {
        '@type': 'Organization',
        name: 'PraxIA',
        slogan: 'Transforme fluência em prática docente.',
        url: 'https://www.radarpraxia.com/',
        member: team.map((member) => ({
          '@type': 'Person',
          name: member.name,
          url: `https://www.radarpraxia.com/autores/${member.id}`,
          sameAs: member.links.map((link) => link.href),
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Sobre', item: 'https://www.radarpraxia.com/sobre' },
      ],
    },
  ],
}

export function AboutPage() {
  useScrollMotion()

  return (
    <>
      <Seo
        title="Sobre nós"
        description="Conheça a história, o propósito e os valores da PraxIA, iniciativa que aproxima fluência digital, inteligência artificial e prática pedagógica."
        path="/sobre"
        jsonLd={aboutSchema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="about" />
      <main id="conteudo-principal" className="about-page">
        <section className="about-hero">
          <div className="about-hero__field" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Sobre</span>
            </nav>
            <div className="about-hero__grid">
              <div>
                <p className="method-kicker">SOBRE A PRAXIA</p>
                <h1>Tecnologia faz sentido quando encontra <em>contexto, intenção e prática.</em></h1>
                <p>A PraxIA é uma iniciativa independente criada para ajudar professores a compreender como sua fluência digital e em inteligência artificial se manifesta no cotidiano — e a transformar essa leitura em escolhas pedagógicas conscientes.</p>
              </div>
              <div className="about-hero__manifesto" data-reveal="scale">
                <Sparkles aria-hidden="true" />
                <blockquote>“Transforme fluência em prática docente.”</blockquote>
                <span>PROPÓSITO EM UMA FRASE</span>
              </div>
            </div>
          </div>
        </section>

        <nav className="method-index" aria-label="Nesta página">
          <div className="shell">
            <span>Nesta página</span>
            <a href="#historia">História</a>
            <a href="#proposito">Propósito</a>
            <a href="#missao-visao">Missão e visão</a>
            <a href="#valores">Valores</a>
            <a href="#quem-esta-por-tras">Quem está por trás</a>
          </div>
        </nav>

        <section className="about-section about-story" id="historia">
          <div className="shell about-story__grid">
            <div data-reveal="left">
              <p className="method-kicker">HISTÓRIA</p>
              <h2>Uma pergunta nascida dentro da educação.</h2>
            </div>
            <div className="about-story__content" data-reveal="right">
              <p className="about-story__lead">Como apoiar professores a desenvolver fluência digital e em IA sem reduzir a docência ao uso de ferramentas?</p>
              <p>A PraxIA nasce dessa inquietação. Em vez de partir da novidade tecnológica, o projeto começa pelas decisões que sustentam uma experiência de aprendizagem: o que planejar, como mediar, quais evidências observar, como oferecer feedback e quais cuidados éticos preservar.</p>
              <p>O primeiro produto dessa trajetória é o Radar Docente — um instrumento de autorreflexão que organiza a prática em seis dimensões e oferece uma recomendação possível para continuar avançando.</p>
              <p>O nome reúne duas ideias centrais: <strong>práxis</strong>, como relação entre reflexão e ação, e <strong>IA</strong>, como uma tecnologia que precisa ser situada dentro de escolhas humanas e pedagógicas.</p>
            </div>
          </div>
        </section>

        <section className="about-section about-purpose" id="proposito">
          <div className="shell about-purpose__grid">
            <div className="about-purpose__visual" aria-hidden="true" data-reveal="scale">
              <div><span>reflexão</span><i /><span>ação</span></div>
              <strong>práxis</strong>
            </div>
            <div data-reveal="right">
              <p className="method-kicker">PROPÓSITO</p>
              <h2>Aproximar tecnologia e pedagogia sem afastar o professor de sua autoria.</h2>
              <p>A PraxIA existe para tornar decisões digitais e de IA mais compreensíveis, intencionais e responsáveis. Isso significa oferecer linguagem, critérios e percursos que apoiem autonomia — não receitas prontas.</p>
              <ul className="about-purpose__list">
                <li><Compass aria-hidden="true" /><span><strong>Orientar sem prescrever.</strong> Cada contexto pede escolhas próprias.</span></li>
                <li><BookOpenCheck aria-hidden="true" /><span><strong>Explicar sem banalizar.</strong> Clareza pode conviver com profundidade.</span></li>
                <li><HeartHandshake aria-hidden="true" /><span><strong>Acolher sem julgar.</strong> Desenvolvimento não é competição.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section about-direction" id="missao-visao">
          <div className="shell">
            <div className="about-direction__intro" data-reveal="up">
              <p className="method-kicker">DIREÇÃO</p>
              <h2>O que fazemos agora e o que queremos tornar possível.</h2>
            </div>
            <div className="about-direction__grid">
              <article data-reveal="left">
                <span>MISSÃO</span>
                <h3>Apoiar professores a transformar fluência digital e em IA em prática pedagógica consciente.</h3>
                <p>Por meio de instrumentos, conteúdos e experiências formativas que conectem tecnologia, contexto, aprendizagem, autoria e responsabilidade.</p>
              </article>
              <article data-reveal="right">
                <span>VISÃO</span>
                <h3>Contribuir para uma cultura em que professores participem ativamente das decisões sobre tecnologia na educação.</h3>
                <p>Uma cultura que reconheça o docente como autor, mediador e responsável pelos critérios que orientam o uso de recursos digitais e IA.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section about-values" id="valores">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">VALORES</p><h2>Princípios que orientam produto, conteúdo e relação com professores.</h2></div>
              <p>Esses valores aparecem tanto no que a PraxIA oferece quanto no que escolhe não prometer.</p>
            </div>
            <div className="about-values__grid">
              {values.map(({ icon: Icon, title, text }, index) => (
                <article key={title} data-reveal="up">
                  <span>0{index + 1}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-founder" id="quem-esta-por-tras">
          <div className="shell">
            <div className="about-founder__heading" data-reveal="up">
              <p className="method-kicker">QUEM ESTÁ À FRENTE DA PRAXIA</p>
              <h2>Educação, tecnologia e prática docente</h2>
              <p>{teamIntroduction}</p>
            </div>
            <TeamProfiles showPhotos />
          </div>
        </section>

        <section className="about-next">
          <div className="shell about-next__grid" data-reveal="up">
            <div><p className="method-kicker">CONHEÇA NA PRÁTICA</p><h2>O Radar Docente é o primeiro movimento dessa trajetória.</h2></div>
            <div>
              <p>Reserve cerca de oito minutos para refletir sobre seis dimensões da sua prática e receber um próximo passo orientado.</p>
              <div>
                <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar</ButtonLink>
                <Link to="/metodologia">Ler a metodologia <ArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
