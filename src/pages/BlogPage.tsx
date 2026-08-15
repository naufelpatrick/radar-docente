import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  ClipboardCheck,
  Compass,
  FileSearch,
  ListChecks,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { getPublishedBlogArticles } from '../data/blogArticles'
import { useScrollMotion } from '../hooks/useScrollMotion'
import { loadPublicArticles } from '../services/cmsApi'
import type { CmsArticle } from '../types/cms'

const categories = [
  {
    slug: 'fluencia-digital',
    icon: Sparkles,
    name: 'Fluência Digital',
    description: 'Conceitos e práticas para escolher, avaliar e adaptar tecnologias com intencionalidade pedagógica.',
  },
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

const publishedArticles = getPublishedBlogArticles()

function getCategoryStatus(categorySlug: string, cmsArticles: CmsArticle[]) {
  const count = publishedArticles.filter((article) => article.categorySlug === categorySlug).length + cmsArticles.filter((article) => article.cms_categories?.slug === categorySlug).length
  if (count === 0) return 'Explorar categoria'
  return `${count} ${count === 1 ? 'artigo publicado' : 'artigos publicados'}`
}

const blogFaq = [
  {
    question: 'Os conteúdos recomendarão ferramentas específicas?',
    answer: 'Quando uma ferramenta for analisada, o texto partirá do objetivo pedagógico, do contexto, dos dados envolvidos e das condições de uso. A proposta não é acompanhar lançamentos nem criar rankings de plataformas.',
  },
  {
    question: 'Como as referências serão apresentadas?',
    answer: 'Artigos baseados em estudos ou documentos indicarão as fontes consultadas e diferenciarão evidência, interpretação e recomendação prática. A PraxIA não apresentará afirmações científicas sem referência verificável.',
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
      name: 'Blog PraxIA',
      description: 'Conteúdos para professores sobre inteligência artificial, competências digitais, planejamento, avaliação, ferramentas, ética e pesquisa.',
      url: 'https://www.radarpraxia.com/blog',
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'WebSite', name: 'PraxIA', url: 'https://www.radarpraxia.com/' },
      about: categories.map((category) => category.name),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
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
  const [cmsArticles, setCmsArticles] = useState<CmsArticle[]>([])
  useEffect(() => { void loadPublicArticles().then((result) => setCmsArticles(result.articles)).catch(() => undefined) }, [])
  const publishedCategories = categories.filter(({ slug }) =>
    publishedArticles.some((article) => article.categorySlug === slug)
    || cmsArticles.some((article) => article.cms_categories?.slug === slug),
  )

  return (
    <>
      <Seo
        title="Blog: IA, competências digitais e prática docente"
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
            <a href="#artigos-recentes">Artigos recentes</a>
            <a href="#categorias">Categorias</a>
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
              <p>Os conteúdos da PraxIA aproximam conceitos, referenciais e situações concretas. O foco não está em prescrever uma ferramenta, mas em apoiar escolhas coerentes com objetivos de aprendizagem, contexto, participação, autoria e segurança.</p>
            </div>
          </div>
        </section>

        <section className="blog-section blog-roadmap" id="artigos-recentes">
          <div className="shell">
            <div className="method-heading method-heading--light" data-reveal="up">
              <div><p className="method-kicker">CONTEÚDOS PRÁXIA</p><h2>Artigos recentes.</h2></div>
              <p>Reflexões, referências e práticas para professores que desejam integrar tecnologia e inteligência artificial à docência com mais consciência pedagógica.</p>
            </div>
            <div className="blog-roadmap__grid">
              {cmsArticles.map((article, index) => (
                <Link className="blog-roadmap__card" to={new URL(article.canonical_url).pathname} key={article.id} data-reveal="up" aria-label={`Ler artigo: ${article.title}`}>
                  <div><span>CONTEÚDO PRÁXIA</span><small>{String(index + 1).padStart(2, '0')}</small></div><h3>{article.title}</h3><p>{article.excerpt}</p><span className="blog-roadmap__link">Ler artigo <ArrowRight aria-hidden="true" /></span><footer><span>{article.cms_categories?.name}</span><span>{article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : ''} · {article.reading_time_minutes} min de leitura</span></footer>
                </Link>
              ))}
              {publishedArticles.map((article, index) => (
                <Link
                  className="blog-roadmap__card"
                  to={article.path}
                  key={article.path}
                  data-reveal="up"
                  aria-label={`Ler artigo: ${article.title}`}
                >
                  <div><span>{article.editorialLabel}</span><small>0{index + 1}</small></div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span className="blog-roadmap__link">Ler artigo <ArrowRight aria-hidden="true" /></span>
                  <footer>
                    <span>{article.category}</span>
                    <span>{article.publishedDate} · {article.readingTime}</span>
                  </footer>
                </Link>
              ))}
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
              {publishedCategories.map(({ slug, icon: Icon, name, description }, index) => (
                <article key={slug} data-reveal="up">
                  <div><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
                  <h3><Link to={`/blog/categoria/${slug}`}>{name}</Link></h3>
                  <p>{description}</p>
                  <Link className="blog-category-status" to={`/blog/categoria/${slug}`}>{getCategoryStatus(slug, cmsArticles)} <ArrowRight aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
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

        <section className="method-cta blog-cta" aria-labelledby="blog-cta-title">
          <div className="method-cta__arc" aria-hidden="true" />
          <div className="shell" data-reveal="up">
            <p className="method-kicker">LEVE A REFLEXÃO PARA A PRÁTICA</p>
            <h2 id="blog-cta-title">Comece pela sua prática, não por uma lista de ferramentas.</h2>
            <p>O Radar Docente ajuda a reconhecer quais dimensões já aparecem com consistência e onde um próximo experimento pode fazer sentido.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
            <small>Resultado personalizado · Sem ranking · Relatório em PDF</small>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={blogFaq} title="Sobre os conteúdos" />
        </div>
      </main>
      <Footer />
    </>
  )
}
