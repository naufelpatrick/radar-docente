import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Compass,
  Gauge,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { useScrollMotion } from '../hooks/useScrollMotion'

const dimensions = [
  ['01', 'Planejamento e curadoria', 'Como você seleciona recursos, organiza percursos e relaciona escolhas digitais aos objetivos de aprendizagem.'],
  ['02', 'Criação de experiências', 'Como recursos digitais apoiam propostas de participação, autoria, investigação e produção dos estudantes.'],
  ['03', 'Mediação e colaboração', 'Como a presença docente, o diálogo e a cooperação são sustentados em experiências mediadas por tecnologia.'],
  ['04', 'Avaliação e feedback', 'Como evidências digitais apoiam acompanhamento, devolutivas e ajustes no processo de ensino.'],
  ['05', 'Integração pedagógica da IA', 'Como propósito, critérios e supervisão pedagógica orientam quando e como utilizar inteligência artificial.'],
  ['06', 'Ética, segurança e autoria', 'Como privacidade, vieses, transparência, autoria e supervisão humana orientam decisões.'],
]

const bands = [
  ['0–39', 'Iniciação', 'Práticas ainda pontuais. O foco é reconhecer possibilidades, critérios básicos e um primeiro uso intencional.'],
  ['40–59', 'Exploração', 'Há experimentação em curso. O próximo movimento é relacionar escolhas com mais clareza aos objetivos pedagógicos.'],
  ['60–79', 'Integração', 'Recursos digitais e IA já aparecem com intenção. O desenvolvimento busca consistência, evidências e reflexão.'],
  ['80–100', 'Transformação', 'As práticas mostram integração sistemática. O avanço está em ampliar repertório, autoria e aprendizagem compartilhada.'],
]

const faqItems = [
  {
    question: 'O Radar Docente é um teste de competência?',
    answer: 'Não. É um instrumento de autorreflexão. Ele organiza percepções sobre práticas relatadas pelo próprio professor e não mede competência absoluta, desempenho profissional ou qualidade do ensino.',
  },
  {
    question: 'O Score PraxIA compara professores?',
    answer: 'Não. O score sintetiza as respostas individuais em uma escala de 0 a 100. Não existe ranking, nota de aprovação ou comparação com uma amostra de docentes.',
  },
  {
    question: 'O perfil docente altera a pontuação?',
    answer: 'Não. As informações de perfil ajudam a contextualizar a experiência, mas não modificam o cálculo. A pontuação considera somente as respostas aos 30 itens do instrumento.',
  },
  {
    question: 'Por que o resultado não é um diagnóstico?',
    answer: 'Porque se baseia em autorrelato, não observa diretamente a prática e ainda está em processo de validação. A devolutiva é orientativa e serve como ponto de partida para reflexão e desenvolvimento.',
  },
  {
    question: 'As respostas são enviadas para algum servidor?',
    answer: 'Nesta versão, não. A sessão e o resultado permanecem no navegador do participante. O relatório pode ser exportado em PDF para consulta pessoal.',
  },
]

const breadcrumbSchema = {
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
    { '@type': 'ListItem', position: 2, name: 'Metodologia', item: 'https://www.radarpraxia.com/metodologia' },
  ],
}

const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export function MethodologyPage() {
  useScrollMotion()

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Metodologia do Radar Docente PraxIA',
        description: 'Conheça as seis dimensões, a escala de maturidade, o cálculo e os limites metodológicos do Radar Docente e do Score PraxIA.',
        url: 'https://www.radarpraxia.com/metodologia',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@type': 'WebSite',
          name: 'PraxIA',
          url: 'https://www.radarpraxia.com/',
        },
      },
      breadcrumbSchema,
      faqSchema,
    ],
  }

  return (
    <>
      <Seo
        title="Metodologia do Radar Docente e Score PraxIA"
        description="Entenda como o Radar Docente avalia seis dimensões da fluência digital e em IA, calcula o Score PraxIA e transforma autorrelato em próximos passos."
        path="/metodologia"
        jsonLd={schema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="methodology" />
      <main id="conteudo-principal" className="method-page">
        <section className="method-hero">
          <div className="method-hero__field" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Metodologia</span>
            </nav>
            <div className="method-hero__grid">
              <div>
                <p className="method-kicker">COMO A LEITURA É CONSTRUÍDA</p>
                <h1>Uma metodologia para transformar <em>autorreflexão em direção.</em></h1>
                <p className="method-hero__lead">
                  O Radar Docente organiza percepções sobre a prática em seis dimensões de fluência digital e em IA. O resultado não julga o professor: ajuda a reconhecer padrões, explicitar critérios e escolher um próximo passo possível.
                </p>
                <div className="method-hero__actions">
                  <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
                  <a href="#fundamentacao">Conhecer a fundamentação <ArrowRight aria-hidden="true" /></a>
                </div>
              </div>
              <div className="method-hero__visual" data-reveal="scale" aria-label="Fluxo resumido do Radar Docente">
                <div className="method-orbit" aria-hidden="true"><span /><span /><span /></div>
                <ol>
                  <li><span>01</span><strong>Prática relatada</strong></li>
                  <li><span>02</span><strong>Leitura dimensional</strong></li>
                  <li><span>03</span><strong>Próximo passo</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <nav className="method-index" aria-label="Nesta página">
          <div className="shell">
            <span>Nesta página</span>
            <a href="#fundamentacao">Fundamentação</a>
            <a href="#fluxo">Fluxo</a>
            <a href="#dimensoes">Dimensões</a>
            <a href="#escala">Escala</a>
            <a href="#score">Score</a>
            <a href="#limites">Limites</a>
            <a href="#perguntas">FAQ</a>
          </div>
        </nav>

        <section className="method-section method-foundation" id="fundamentacao">
          <div className="shell method-section__split">
            <div data-reveal="left">
              <p className="method-kicker">FUNDAMENTAÇÃO METODOLÓGICA</p>
              <h2>O ponto de partida é a prática, não o domínio de ferramentas.</h2>
            </div>
            <div className="method-prose" data-reveal="right">
              <p className="method-prose__lead">Fluência digital docente não se resume a saber operar plataformas. Ela aparece nas decisões que conectam recursos, objetivos de aprendizagem, mediação, avaliação, autoria e cuidado ético.</p>
              <p>Por isso, o instrumento apresenta situações e comportamentos próximos do cotidiano de ensino. A pessoa responde considerando a frequência com que determinadas práticas aparecem e como agiria diante de cenários pedagógicos.</p>
              <p>A leitura reúne três princípios:</p>
              <ul className="check-list">
                <li><Check aria-hidden="true" /><span><strong>Contexto antes de prescrição.</strong> A devolutiva orienta possibilidades, sem definir uma única forma correta de ensinar.</span></li>
                <li><Check aria-hidden="true" /><span><strong>Evidências antes de rótulos.</strong> O resultado descreve manifestações possíveis da prática, sem classificar valor profissional.</span></li>
                <li><Check aria-hidden="true" /><span><strong>Desenvolvimento antes de comparação.</strong> O foco está na trajetória individual e em ações que podem ser experimentadas.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="method-section method-flow" id="fluxo">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">FLUXO DO RADAR</p><h2>Da resposta à recomendação, sem caixa-preta.</h2></div>
              <p>Cada etapa tem uma função clara. O perfil contextualiza a experiência, mas não altera a pontuação.</p>
            </div>
            <ol className="method-stepper" aria-label="Etapas do Radar Docente">
              <li data-reveal="up"><span>01</span><ClipboardList aria-hidden="true" /><h3>Contexto docente</h3><p>Etapa de perfil para situar área e nível de atuação. Essas informações não entram no cálculo.</p></li>
              <li data-reveal="up"><span>02</span><MessageSquareText aria-hidden="true" /><h3>30 respostas</h3><p>São 24 itens comportamentais e seis situações, distribuídos igualmente entre as dimensões.</p></li>
              <li data-reveal="up"><span>03</span><Gauge aria-hidden="true" /><h3>Cálculo</h3><p>Cada dimensão recebe um score de 0 a 100. O score geral é a média das seis dimensões.</p></li>
              <li data-reveal="up"><span>04</span><Compass aria-hidden="true" /><h3>Leitura orientativa</h3><p>A combinação dos resultados seleciona interpretações e uma prioridade de desenvolvimento.</p></li>
            </ol>
          </div>
        </section>

        <section className="method-section method-dimensions" id="dimensoes">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">COMPETÊNCIAS OBSERVADAS</p><h2>Seis dimensões que se explicam em conjunto.</h2></div>
              <p>O radar hexagonal preserva as diferenças entre áreas da prática. Ele complementa o score geral e evita que a média esconda nuances importantes.</p>
            </div>
            <div className="method-dimensions__layout">
              <div className="method-hexagon" data-reveal="scale" aria-hidden="true">
                <svg viewBox="0 0 400 400" role="presentation">
                  <polygon points="200,38 340,119 340,281 200,362 60,281 60,119" />
                  <polygon points="200,89 296,144 296,256 200,311 104,256 104,144" />
                  <polygon points="200,142 250,171 250,229 200,258 150,229 150,171" />
                  <path d="M200 38v324M60 119l280 162M340 119L60 281" />
                  <circle cx="200" cy="38" r="8" /><circle cx="340" cy="119" r="8" /><circle cx="340" cy="281" r="8" />
                  <circle cx="200" cy="362" r="8" /><circle cx="60" cy="281" r="8" /><circle cx="60" cy="119" r="8" />
                </svg>
                <span>6 dimensões</span>
              </div>
              <div className="method-dimension-list">
                {dimensions.map(([number, title, text]) => (
                  <article key={number} data-reveal="up">
                    <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="method-section method-scale" id="escala">
          <div className="shell">
            <div className="method-heading method-heading--light" data-reveal="up">
              <div><p className="method-kicker">ESCALA DE DESENVOLVIMENTO</p><h2>Quatro faixas para orientar trajetórias.</h2></div>
              <p>As faixas não equivalem a conceitos de aprovação. Elas dão linguagem ao momento relatado e ajudam a formular o próximo movimento.</p>
            </div>
            <div className="maturity-path" data-reveal="up">
              <div className="maturity-path__line" aria-hidden="true" />
              {bands.map(([range, title, text], index) => (
                <article key={title}>
                  <span>{range}</span><i aria-hidden="true">{index + 1}</i><h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="method-section method-score" id="score">
          <div className="shell method-score__grid">
            <div data-reveal="left">
              <p className="method-kicker">COMO O SCORE PRÁXIA FUNCIONA</p>
              <h2>Uma síntese legível, acompanhada do contexto.</h2>
              <p className="method-score__lead">Cada dimensão reúne cinco respostas com valores internos de 1 a 5. A soma é convertida para uma escala de 0 a 100. O Score PraxIA é a média aritmética dos seis resultados dimensionais.</p>
              <div className="formula" aria-label="Fórmula do score dimensional">
                <span>score da dimensão</span>
                <strong>((soma das respostas − 5) ÷ 20) × 100</strong>
              </div>
              <p>Somente o score geral exibido é arredondado. A devolutiva também observa amplitude entre dimensões, pontos de atenção e uma ordem explícita de prioridade metodológica.</p>
            </div>
            <div className="method-score__visual" data-reveal="scale">
              <div className="score-arc" aria-hidden="true">
                <svg viewBox="0 0 360 220">
                  <path d="M40 190a140 140 0 0 1 280 0" />
                  <path className="score-arc__progress" d="M40 190a140 140 0 0 1 280 0" />
                  <circle cx="268" cy="83" r="9" />
                </svg>
                <div><strong>72</strong><span>/100</span><small>Integração</small></div>
              </div>
              <div className="method-score__reading">
                <span>LEITURA DO EXEMPLO</span>
                <p>Recursos digitais e IA já aparecem com intenção pedagógica. O próximo avanço está em tornar essas práticas mais consistentes na avaliação e no feedback.</p>
              </div>
              <p className="method-score__note"><Lightbulb aria-hidden="true" /> O número nunca aparece sozinho: faixa, interpretação e recomendação permanecem disponíveis em texto.</p>
            </div>
          </div>
        </section>

        <section className="method-section method-recommendation">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">RECOMENDAÇÃO PERSONALIZADA</p><h2>O resultado termina em uma ação possível.</h2></div>
              <p>A prioridade é escolhida pela relação entre as dimensões, não por uma mensagem gerada livremente por inteligência artificial.</p>
            </div>
            <div className="recommendation-flow" data-reveal="up" aria-label="Processo de recomendação personalizada">
              <article><Scale aria-hidden="true" /><span>1</span><h3>Compara as dimensões</h3><p>Identifica proximidades, contrastes e eventuais scores abaixo de 40.</p></article>
              <ArrowRight aria-hidden="true" />
              <article><Route aria-hidden="true" /><span>2</span><h3>Define a prioridade</h3><p>Seleciona uma zona de desenvolvimento com regra explícita de desempate.</p></article>
              <ArrowRight aria-hidden="true" />
              <article><Sparkles aria-hidden="true" /><span>3</span><h3>Propõe um experimento</h3><p>Apresenta ação, evidência observável, tempo de preparação e pergunta reflexiva.</p></article>
            </div>
          </div>
        </section>

        <section className="method-section method-limits" id="limites">
          <div className="shell">
            <div className="method-heading method-heading--light" data-reveal="up">
              <div><p className="method-kicker">VALIDADE E LIMITAÇÕES</p><h2>Clareza sobre o que o Radar pode — e não pode — dizer.</h2></div>
              <p>Uma leitura responsável explicita seus limites. Eles não diminuem a utilidade do instrumento; definem como usá-lo com cuidado.</p>
            </div>
            <div className="limits-grid">
              <article data-reveal="up"><BookOpenCheck aria-hidden="true" /><h3>Instrumento em validação</h3><p>Esta é uma versão beta. Ainda não há evidências publicadas de validade e confiabilidade que autorizem uso diagnóstico.</p></article>
              <article data-reveal="up"><MessageSquareText aria-hidden="true" /><h3>Baseado em autorrelato</h3><p>As respostas expressam percepção sobre a própria prática. Elas podem variar conforme contexto, experiência recente e interpretação dos itens.</p></article>
              <article data-reveal="up"><ShieldCheck aria-hidden="true" /><h3>Não certifica competência</h3><p>O resultado não substitui observação de aula, análise de produções, avaliação institucional ou processos formativos acompanhados.</p></article>
              <article data-reveal="up"><LockKeyhole aria-hidden="true" /><h3>Uso individual e orientativo</h3><p>Não deve ser usado para seleção, comparação, controle de desempenho ou tomada de decisão sobre carreira docente.</p></article>
            </div>
            <aside className="method-caution" aria-label="Uso responsável">
              <strong>Uso recomendado</strong>
              <p>Considere o resultado como uma fotografia de percepção em um momento específico. Retome-o após experimentar novas práticas e compare sua própria trajetória, não pessoas diferentes.</p>
            </aside>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={faqItems} />
        </div>

        <section className="method-cta" aria-labelledby="method-cta-title">
          <div className="method-cta__arc" aria-hidden="true" />
          <div className="shell" data-reveal="up">
            <p className="method-kicker">DA METODOLOGIA À SUA PRÁTICA</p>
            <h2 id="method-cta-title">Reserve oito minutos para olhar sua prática por seis ângulos.</h2>
            <p>Você recebe uma leitura orientativa, um Score PraxIA explicado e um próximo passo que cabe no cotidiano docente.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Começar o Radar Docente</ButtonLink>
            <small>Gratuito · Sem ranking · Respostas mantidas no navegador</small>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
