import {
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Gauge,
  Layers3,
  Lightbulb,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { useScrollMotion } from '../hooks/useScrollMotion'

const benefits = [
  {
    icon: UserRoundSearch,
    title: 'Reconhecer sua prática',
    text: 'Você observa como decisões digitais e de IA aparecem em situações reais de planejamento, mediação e avaliação.',
  },
  {
    icon: Layers3,
    title: 'Enxergar relações',
    text: 'O radar preserva diferenças entre seis dimensões para mostrar onde as práticas estão próximas ou em momentos distintos.',
  },
  {
    icon: Compass,
    title: 'Escolher uma prioridade',
    text: 'A devolutiva transforma o resultado em um experimento pequeno, com evidência observável e pergunta de reflexão.',
  },
  {
    icon: ShieldCheck,
    title: 'Refletir sem julgamento',
    text: 'Não há ranking, aprovação ou comparação com outros professores. A leitura acompanha sua própria trajetória.',
  },
]

const faqItems = [
  {
    question: 'Quanto tempo leva para responder ao Radar Docente?',
    answer: 'A experiência leva aproximadamente oito minutos. Você pode interromper e retomar no mesmo navegador, porque o progresso fica salvo localmente.',
  },
  {
    question: 'Preciso já utilizar inteligência artificial nas aulas?',
    answer: 'Não. O Radar acolhe diferentes momentos de aproximação com tecnologia e IA. As perguntas ajudam tanto quem está começando quanto quem já integra esses recursos com frequência.',
  },
  {
    question: 'Quem pode fazer o Radar?',
    answer: 'Professores do Ensino Fundamental, Ensino Médio e Ensino Superior. O perfil contextualiza a experiência, mas não altera a pontuação.',
  },
  {
    question: 'O resultado fica disponível depois?',
    answer: 'Ao concluir, você pode consultar a devolutiva no navegador e exportar o relatório completo em PDF para uso pessoal.',
  },
  {
    question: 'O Radar avalia se sou um bom professor?',
    answer: 'Não. O instrumento não mede valor profissional nem qualidade docente. Ele organiza um autorrelato sobre práticas digitais e de IA para apoiar reflexão e desenvolvimento.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Radar Docente PráxIA',
      description: 'Entenda o Radar Docente PráxIA, para quem ele serve e como interpretar o score e o radar de fluência digital e em IA.',
      url: 'https://radar-docente-pi.vercel.app/radar-docente',
      inLanguage: 'pt-BR',
      isPartOf: {
        '@type': 'WebSite',
        name: 'PráxIA',
        url: 'https://radar-docente-pi.vercel.app/',
      },
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Radar Docente PráxIA',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Radar Docente', item: 'https://radar-docente-pi.vercel.app/radar-docente' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export function RadarDocentePage() {
  useScrollMotion()

  return (
    <>
      <Seo
        title="Radar Docente: fluência digital e IA na prática"
        description="Conheça o Radar Docente PráxIA: uma leitura gratuita de seis dimensões da fluência digital e em IA, com score explicado e próximo passo."
        path="/radar-docente"
        jsonLd={schema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="radar" />
      <main id="conteudo-principal" className="radar-info-page">
        <section className="radar-info-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Radar Docente</span>
            </nav>
            <div className="radar-info-hero__grid">
              <div>
                <p className="method-kicker">RADAR DE FLUÊNCIA DIGITAL E IA</p>
                <h1>Um olhar organizado sobre como a tecnologia aparece na <em>sua prática docente.</em></h1>
                <p className="radar-info-hero__lead">
                  O Radar Docente ajuda você a reconhecer escolhas, critérios e hábitos que atravessam o ensino com recursos digitais e inteligência artificial — sem transformar reflexão em prova.
                </p>
                <div className="radar-info-hero__actions">
                  <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
                  <a href="#como-funciona">Entender a experiência <ArrowRight aria-hidden="true" /></a>
                </div>
                <small>Aproximadamente 8 minutos · Resultado individual · Sem ranking</small>
              </div>
              <div className="radar-info-hero__map" aria-label="Representação das seis dimensões do Radar Docente" data-reveal="scale">
                <div className="radar-map__core"><span>6</span><small>dimensões</small></div>
                {['Planejar', 'Criar', 'Mediar', 'Avaliar', 'Integrar IA', 'Cuidar'].map((label, index) => (
                  <span className={`radar-map__point radar-map__point--${index + 1}`} key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <nav className="method-index" aria-label="Nesta página">
          <div className="shell">
            <span>Nesta página</span>
            <a href="#o-que-e">O que é</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#para-quem">Para quem</a>
            <a href="#interpretacao">Interpretação</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#perguntas">FAQ</a>
          </div>
        </nav>

        <section className="radar-info-section radar-info-intro" id="o-que-e">
          <div className="shell method-section__split">
            <div data-reveal="left">
              <p className="method-kicker">O QUE É</p>
              <h2>Uma pausa guiada para ler o que você já faz.</h2>
            </div>
            <div className="method-prose" data-reveal="right">
              <p className="method-prose__lead">O Radar Docente é um instrumento de autorreflexão sobre fluência digital e em IA. Ele parte do cotidiano pedagógico, não de uma lista de ferramentas que o professor deveria dominar.</p>
              <p>Ao responder, você considera situações de planejamento, criação, mediação, avaliação, uso pedagógico de IA e cuidado ético. As respostas formam uma leitura integrada da prática relatada naquele momento.</p>
              <aside className="radar-info-note">
                <MessageSquareText aria-hidden="true" />
                <p><strong>Importante:</strong> o Radar não observa aulas nem certifica competências. O resultado é orientativo, baseado em autorrelato e está em processo de validação.</p>
              </aside>
              <Link className="text-link" to="/metodologia">Conheça a metodologia e as regras de cálculo <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="radar-info-section radar-experience" id="como-funciona">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">COMO FUNCIONA</p><h2>Uma experiência curta, com devolutiva aprofundada.</h2></div>
              <p>O percurso foi desenhado para reduzir esforço de navegação e manter o foco em uma pergunta por vez.</p>
            </div>
            <ol className="radar-experience__steps">
              <li data-reveal="up"><span>01</span><UserRoundSearch aria-hidden="true" /><div><h3>Contextualize</h3><p>Informe seu nível e área de atuação. O perfil não altera a pontuação.</p></div></li>
              <li data-reveal="up"><span>02</span><ClipboardCheck aria-hidden="true" /><div><h3>Responda</h3><p>Reflita sobre 30 itens: 24 comportamentos e seis situações pedagógicas.</p></div></li>
              <li data-reveal="up"><span>03</span><Gauge aria-hidden="true" /><div><h3>Compreenda</h3><p>Leia o Score PráxIA e o radar complementar das seis dimensões.</p></div></li>
              <li data-reveal="up"><span>04</span><Route aria-hidden="true" /><div><h3>Experimente</h3><p>Leve uma recomendação concreta para a próxima atividade docente.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="radar-info-section radar-audience" id="para-quem">
          <div className="shell radar-audience__grid">
            <div data-reveal="left">
              <p className="method-kicker">PARA QUEM SERVE</p>
              <h2>Para professores em diferentes momentos de aproximação com tecnologia e IA.</h2>
              <p>Você não precisa dominar ferramentas nem já utilizar IA com estudantes. O instrumento acolhe desde práticas iniciais até integrações mais sistemáticas.</p>
            </div>
            <div className="radar-audience__cards">
              <article data-reveal="up"><span>01</span><h3>Ensino Fundamental</h3><p>Para refletir sobre escolhas digitais adequadas às etapas de desenvolvimento, à mediação e à participação.</p></article>
              <article data-reveal="up"><span>02</span><h3>Ensino Médio</h3><p>Para observar autoria, investigação, avaliação e uso responsável de IA em experiências mais autônomas.</p></article>
              <article data-reveal="up"><span>03</span><h3>Ensino Superior</h3><p>Para revisar desenho de experiências, feedback, produção acadêmica e critérios de transparência e autoria.</p></article>
            </div>
          </div>
        </section>

        <section className="radar-info-section radar-reading" id="interpretacao">
          <div className="shell">
            <div className="method-heading method-heading--light" data-reveal="up">
              <div><p className="method-kicker">COMO INTERPRETAR</p><h2>O score resume. O radar explica. A recomendação movimenta.</h2></div>
              <p>As três camadas devem ser lidas em conjunto. Nenhuma delas representa uma nota de desempenho profissional.</p>
            </div>
            <div className="radar-reading__grid">
              <article data-reveal="up">
                <div className="mini-score" aria-label="Exemplo de Score PráxIA: 72 de 100, faixa Integração">
                  <svg viewBox="0 0 220 140" aria-hidden="true"><path d="M25 120a85 85 0 0 1 170 0" /><path className="mini-score__progress" d="M25 120a85 85 0 0 1 170 0" /></svg>
                  <strong>72</strong><small>Integração</small>
                </div>
                <span>CAMADA 01</span>
                <h3>Score PráxIA</h3>
                <p>Apresenta a média das seis dimensões em uma escala de 0 a 100, acompanhada de faixa textual e interpretação em linguagem humana.</p>
                <Link to="/metodologia#score">Entenda o cálculo do score</Link>
              </article>
              <article data-reveal="up">
                <div className="mini-radar" aria-hidden="true">
                  <svg viewBox="0 0 220 160"><polygon points="110,15 190,53 190,115 110,150 30,115 30,53" /><polygon className="mini-radar__result" points="110,32 174,61 163,104 110,137 45,108 48,62" /><circle cx="110" cy="32" r="5" /><circle cx="174" cy="61" r="5" /><circle cx="163" cy="104" r="5" /><circle cx="110" cy="137" r="5" /><circle cx="45" cy="108" r="5" /><circle cx="48" cy="62" r="5" /></svg>
                </div>
                <span>CAMADA 02</span>
                <h3>Radar dimensional</h3>
                <p>Mostra como planejamento, criação, mediação, avaliação, integração da IA e ética participam da composição do resultado.</p>
                <Link to="/metodologia#dimensoes">Conheça as seis dimensões</Link>
              </article>
              <article data-reveal="up">
                <div className="mini-action" aria-hidden="true"><Lightbulb /><ArrowRight /></div>
                <span>CAMADA 03</span>
                <h3>Próximo experimento</h3>
                <p>Traduz a prioridade em uma ação pequena, com objetivo, evidência observável, critérios e pergunta para refletir depois.</p>
                <Link to="/metodologia">Veja como a recomendação é escolhida</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="radar-info-section radar-benefits" id="beneficios">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">O QUE VOCÊ LEVA</p><h2>Uma devolutiva feita para continuar útil depois da tela.</h2></div>
              <p>O resultado completo pode ser exportado em PDF e retomado como apoio para planejamento ou desenvolvimento profissional.</p>
            </div>
            <div className="radar-benefits__grid">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} data-reveal="up"><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
            <div className="radar-benefits__summary" data-reveal="up">
              <Sparkles aria-hidden="true" />
              <div><strong>Ao concluir, você recebe</strong><p>Score PráxIA, radar de seis dimensões, interpretação, competências fortes, zonas de desenvolvimento e plano de evolução.</p></div>
              <ButtonLink href="/radar" showArrow>Começar agora</ButtonLink>
            </div>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={faqItems} title="Antes de começar" />
        </div>

        <section className="method-cta radar-info-cta" aria-labelledby="radar-cta-title">
          <div className="method-cta__arc" aria-hidden="true" />
          <div className="shell" data-reveal="up">
            <p className="method-kicker">SEU PONTO DE PARTIDA</p>
            <h2 id="radar-cta-title">O próximo passo começa por reconhecer o que já está em movimento.</h2>
            <p>Responda considerando sua prática real — não a prática ideal. É essa honestidade que torna a leitura mais útil para você.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar Docente</ButtonLink>
            <small>Gratuito · Aproximadamente 8 minutos · Relatório em PDF</small>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
