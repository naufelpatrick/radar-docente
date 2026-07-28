import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  ClipboardCheck,
  Compass,
  FileSearch,
  Lightbulb,
  ListChecks,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { useScrollMotion } from '../hooks/useScrollMotion'

const categories = [
  {
    slug: 'ia-para-professores',
    icon: Bot,
    name: 'IA para Professores',
    description: 'Conceitos, possibilidades e critérios para compreender a IA antes de levá-la ao planejamento ou à sala de aula.',
  },
  {
    slug: 'competencias-docentes',
    icon: Compass,
    name: 'Competências Docentes',
    description: 'Leituras sobre fluência digital, desenvolvimento profissional e as seis dimensões observadas pelo Radar.',
  },
  {
    slug: 'ferramentas',
    icon: Wrench,
    name: 'Ferramentas',
    description: 'Análises orientadas por propósito pedagógico — não listas de novidades ou recomendações sem contexto.',
  },
  {
    slug: 'planejamento',
    icon: ListChecks,
    name: 'Planejamento',
    description: 'Caminhos para selecionar recursos, explicitar objetivos e desenhar experiências coerentes com a aprendizagem.',
  },
  {
    slug: 'avaliacao',
    icon: ClipboardCheck,
    name: 'Avaliação',
    description: 'Evidências, feedback, autoria e acompanhamento da aprendizagem em experiências digitais e com IA.',
  },
  {
    slug: 'etica',
    icon: Scale,
    name: 'Ética',
    description: 'Privacidade, transparência, vieses, segurança, autoria e responsabilidade nas decisões educacionais.',
  },
  {
    slug: 'pesquisa',
    icon: FileSearch,
    name: 'Pesquisa',
    description: 'Sínteses acessíveis de referenciais, estudos e debates relevantes para a prática docente.',
  },
  {
    slug: 'estudos-de-caso',
    icon: BriefcaseBusiness,
    name: 'Estudos de Caso',
    description: 'Análises contextualizadas de decisões, experimentos e aprendizados — incluindo limites e ajustes necessários.',
  },
]

const editorialTracks = [
  {
    label: 'PRIMEIROS PASSOS',
    title: 'Usar IA com estudantes começa antes da ferramenta',
    summary: 'Um percurso para definir objetivo, dados envolvidos, transparência e forma de revisão antes de escolher uma solução.',
    category: 'IA para Professores',
    time: 'Leitura estimada: 7 min',
  },
  {
    label: 'PLANEJAMENTO',
    title: 'Da possibilidade tecnológica ao objetivo de aprendizagem',
    summary: 'Perguntas para decidir quando um recurso amplia a experiência — e quando apenas adiciona complexidade.',
    category: 'Planejamento',
    time: 'Leitura estimada: 9 min',
  },
  {
    label: 'ÉTICA E AUTORIA',
    title: 'Como conversar sobre autoria em atividades com IA',
    summary: 'Critérios para tornar participação, revisão, citação e responsabilidade visíveis para os estudantes.',
    category: 'Ética',
    time: 'Leitura estimada: 8 min',
  },
]

const blogFaq = [
  {
    question: 'Os conteúdos recomendarão ferramentas específicas?',
    answer: 'Quando uma ferramenta for analisada, o texto partirá do objetivo pedagógico, do contexto, dos dados envolvidos e das condições de uso. A proposta não é acompanhar lançamentos nem criar rankings de plataformas.',
  },
  {
    question: 'Como as referências serão apresentadas?',
    answer: 'Artigos baseados em estudos ou documentos indicarão as fontes consultadas e diferenciarão evidência, interpretação e recomendação prática. A PráxIA não apresentará afirmações científicas sem referência verificável.',
  },
  {
    question: 'Os textos substituirão formação ou orientação institucional?',
    answer: 'Não. Os conteúdos oferecem repertório e perguntas para reflexão. Decisões sobre currículo, dados, avaliação e uso de IA precisam considerar políticas e condições de cada instituição.',
  },
  {
    question: 'Como os artigos se conectam ao Radar Docente?',
    answer: 'As categorias acompanham temas presentes nas seis dimensões do Radar. Ao longo do desenvolvimento, a devolutiva poderá indicar leituras alinhadas ao próximo passo de cada participante.',
  },
]

const blogSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Blog PráxIA',
      description: 'Conteúdos para professores sobre inteligência artificial, competências digitais, planejamento, avaliação, ferramentas, ética e pesquisa.',
      url: 'https://radar-docente-pi.vercel.app/blog',
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'WebSite', name: 'PráxIA', url: 'https://radar-docente-pi.vercel.app/' },
      about: categories.map((category) => category.name),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://radar-docente-pi.vercel.app/blog' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: blogFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export function BlogPage() {
  useScrollMotion()

  return (
    <>
      <Seo
        title="Blog PráxIA: IA, competências digitais e prática docente"
        description="Conteúdos para professores sobre IA, competências digitais, planejamento, avaliação, ferramentas, ética, pesquisa e experiências de ensino."
        path="/blog"
        jsonLd={blogSchema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="blog" />
      <main id="conteudo-principal" className="blog-page">
        <section className="blog-hero">
          <div className="blog-hero__field" aria-hidden="true"><span /><span /><span /></div>
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Blog</span>
            </nav>
            <div className="blog-hero__grid">
              <div>
                <p className="method-kicker">CONHECIMENTO PARA A PRÁTICA</p>
                <h1>Ideias, critérios e perguntas para ensinar em contextos <em>digitais e com IA.</em></h1>
                <p>Um espaço editorial para professores que querem compreender tecnologia sem correr atrás de cada novidade — e tomar decisões mais conscientes sobre planejamento, avaliação, autoria e aprendizagem.</p>
              </div>
              <div className="blog-hero__visual" data-reveal="scale" aria-hidden="true">
                <BookOpen />
                <span>contexto</span><span>evidência</span><span>prática</span>
                <i /><i /><i />
              </div>
            </div>
          </div>
        </section>

        <nav className="method-index" aria-label="Nesta página">
          <div className="shell">
            <span>Explorar</span>
            <a href="#categorias">Categorias</a>
            <a href="#em-preparacao">Em preparação</a>
            <a href="#criterios-editoriais">Critérios editoriais</a>
            <a href="#perguntas">FAQ</a>
          </div>
        </nav>

        <section className="blog-section blog-intro">
          <div className="shell blog-intro__grid">
            <div data-reveal="left">
              <p className="method-kicker">POR QUE ESTE BLOG EXISTE</p>
              <h2>Menos respostas prontas. Mais condições para decidir.</h2>
            </div>
            <div data-reveal="right">
              <p className="blog-intro__lead">Entre o entusiasmo e a recusa, professores precisam de espaço para compreender o que muda, o que permanece e quais perguntas precisam ser feitas.</p>
              <p>Os conteúdos da PráxIA aproximam conceitos, referenciais e situações concretas. O foco não está em prescrever uma ferramenta, mas em apoiar escolhas coerentes com objetivos de aprendizagem, contexto, participação, autoria e segurança.</p>
            </div>
          </div>
        </section>

        <section className="blog-section blog-categories" id="categorias">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">CATEGORIAS</p><h2>Oito caminhos para chegar à prática por diferentes perguntas.</h2></div>
              <p>A arquitetura está preparada para páginas próprias de categoria e para relações entre artigos, dimensões e próximos passos.</p>
            </div>
            <div className="blog-categories__grid">
              {categories.map(({ slug, icon: Icon, name, description }, index) => (
                <article key={slug} data-reveal="up">
                  <div><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
                  <h3><Link to={`/blog/categoria/${slug}`}>{name}</Link></h3>
                  <p>{description}</p>
                  <Link className="blog-category-status" to={`/blog/categoria/${slug}`}>{['ia-para-professores', 'planejamento', 'etica'].includes(slug) ? '1 artigo publicado' : 'Conteúdos em preparação'} <ArrowRight aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="blog-section blog-roadmap" id="em-preparacao">
          <div className="shell">
            <div className="method-heading method-heading--light" data-reveal="up">
              <div><p className="method-kicker">AGENDA EDITORIAL</p><h2>Primeiras leituras em desenvolvimento.</h2></div>
              <p>Os temas abaixo mostram a direção editorial. Eles só receberão data, autoria e URL quando o conteúdo integral estiver publicado.</p>
            </div>
            <div className="blog-roadmap__grid">
              {editorialTracks.map((track, index) => (
                <article key={track.title} data-reveal="up">
                  <div><span>{track.label}</span><small>0{index + 1}</small></div>
                  <h3>{track.title}</h3>
                  <p>{track.summary}</p>
                  {index === 0 && <Link className="blog-roadmap__link" to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Ler artigo <ArrowRight aria-hidden="true" /></Link>}
                  {index === 1 && <Link className="blog-roadmap__link" to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Ler artigo <ArrowRight aria-hidden="true" /></Link>}
                  {index === 2 && <Link className="blog-roadmap__link" to="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia">Ler artigo <ArrowRight aria-hidden="true" /></Link>}
                  <footer><span>{track.category}</span><span>{track.time}</span></footer>
                </article>
              ))}
            </div>
            <p className="blog-roadmap__note"><Lightbulb aria-hidden="true" /> Estes itens não são artigos publicados. São pautas editoriais apresentadas com transparência para não criar páginas vazias ou conteúdo superficial.</p>
          </div>
        </section>

        <section className="blog-section blog-standards" id="criterios-editoriais">
          <div className="shell blog-standards__grid">
            <div data-reveal="left">
              <p className="method-kicker">CRITÉRIOS EDITORIAIS</p>
              <h2>Como cada conteúdo será construído.</h2>
              <p>O mesmo compromisso metodológico do Radar orienta a produção editorial: explicar o alcance de cada afirmação e preservar autonomia docente.</p>
            </div>
            <ol>
              <li data-reveal="up"><span>01</span><div><h3>Partir de uma decisão real</h3><p>Todo artigo deve responder a uma pergunta que possa aparecer no planejamento, na mediação, na avaliação ou no cuidado ético.</p></div></li>
              <li data-reveal="up"><span>02</span><div><h3>Distinguir evidência e interpretação</h3><p>Referências serão indicadas quando houver base documental ou científica. Recomendações serão apresentadas como orientação contextual.</p></div></li>
              <li data-reveal="up"><span>03</span><div><h3>Explicitar limites</h3><p>Ferramentas, estudos e exemplos serão situados em suas condições de uso, sem generalizações ou promessas automáticas de aprendizagem.</p></div></li>
              <li data-reveal="up"><span>04</span><div><h3>Terminar em reflexão ou ação</h3><p>Cada leitura deve deixar uma pergunta, critério ou experimento que o professor possa levar para a própria prática.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="blog-architecture" aria-labelledby="architecture-title">
          <div className="shell">
            <div data-reveal="up">
              <Search aria-hidden="true" />
              <p className="method-kicker">ARQUITETURA PREPARADA</p>
              <h2 id="architecture-title">Cada artigo terá contexto para ser encontrado e continuidade para ser útil.</h2>
            </div>
            <div className="blog-architecture__items">
              <span><ShieldCheck aria-hidden="true" /> Breadcrumb e dados estruturados</span>
              <span><ListChecks aria-hidden="true" /> Índice e hierarquia de leitura</span>
              <span><BookOpen aria-hidden="true" /> Autor, data e tempo estimado</span>
              <span><Sparkles aria-hidden="true" /> FAQ e CTA para o Radar</span>
              <span><Compass aria-hidden="true" /> Artigos e categorias relacionados</span>
            </div>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={blogFaq} title="Sobre os conteúdos" />
        </div>

        <section className="method-cta blog-cta" aria-labelledby="blog-cta-title">
          <div className="method-cta__arc" aria-hidden="true" />
          <div className="shell" data-reveal="up">
            <p className="method-kicker">ENQUANTO OS CONTEÚDOS SÃO PREPARADOS</p>
            <h2 id="blog-cta-title">Comece pela sua prática, não por uma lista de ferramentas.</h2>
            <p>O Radar Docente ajuda a reconhecer quais dimensões já aparecem com consistência e onde um próximo experimento pode fazer sentido.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
            <small>Resultado personalizado · Sem ranking · Relatório em PDF</small>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
