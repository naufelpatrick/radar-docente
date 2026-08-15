import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Eye,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { ResultCommercialOffers } from '../components/ResultCommercialOffers'
import type { DimensionId } from '../types/instrument'
import type { ScoreResult } from '../types/result'
import { useScrollMotion } from '../hooks/useScrollMotion'

function DemoScoreGauge() {
  return (
    <div className="dynamic-gauge" style={{ '--result-score': 72, '--result-angle': '129.6deg' } as React.CSSProperties}>
      <svg viewBox="0 0 360 230" role="img" aria-label="Score PraxIA demonstrativo: 72 de 100, faixa Integração">
        <path className="dynamic-gauge__track" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
        <path className="dynamic-gauge__accent" d="M62 190 A118 118 0 0 1 298 190" pathLength="100" />
        <path className="dynamic-gauge__progress" d="M40 190 A140 140 0 0 1 320 190" pathLength="100" />
        <g className="dynamic-gauge__marker"><circle cx="40" cy="190" r="12" /><circle cx="40" cy="190" r="4" /></g>
      </svg>
      <div className="dynamic-gauge__value"><strong>72</strong><span>/100</span><small>Integração</small></div>
      <div className="dynamic-gauge__limits" aria-hidden="true"><span>0</span><span>100</span></div>
    </div>
  )
}

const demoDimensions: Array<{ id: DimensionId; name: string; shortName: string }> = [
  { id: 'planning_curation', name: 'Planejamento e curadoria', shortName: 'Planejamento' },
  { id: 'experience_creation', name: 'Criação de experiências', shortName: 'Criação' },
  { id: 'mediation_collaboration', name: 'Mediação e colaboração', shortName: 'Mediação' },
  { id: 'assessment_feedback', name: 'Avaliação e feedback', shortName: 'Avaliação' },
  { id: 'ai_pedagogical_integration', name: 'Integração pedagógica da IA', shortName: 'Integração da IA' },
  { id: 'ethics_safety_authorship', name: 'Ética, segurança e autoria', shortName: 'Ética e autoria' },
]

const scores = [80, 75, 75, 70, 65, 65]

const demoResult: ScoreResult = {
  anonymousId: 'demonstracao-publica',
  instrumentVersion: 'beta-0.1',
  teachingProfile: 'higher_postgraduate',
  dimensionScores: demoDimensions.map((dimension, index) => ({
    dimensionId: dimension.id,
    dimensionName: dimension.name,
    rawSum: 5 + scores[index] / 5,
    itemAverage: 1 + scores[index] / 25,
    score: scores[index],
  })),
  exactOverallScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
  displayedOverallScore: 72,
  band: {
    id: 'integration',
    name: 'Integração',
    message: 'Recursos digitais e IA já aparecem com intenção pedagógica. O próximo avanço está em tornar essas práticas mais consistentes na avaliação e no feedback.',
  },
  strengths: ['planning_curation'],
  developmentZones: ['ai_pedagogical_integration', 'ethics_safety_authorship'],
  similarPerformance: false,
  amplitude: 15,
  balanceProfile: null,
  attentionSignals: [],
  recommendationDimension: 'ethics_safety_authorship',
  recommendation: 'Revise quais dados, conteúdos identificáveis e regras de autoria estão envolvidos antes de utilizar uma ferramenta digital ou de IA com estudantes.',
  completedAt: '2026-07-28T00:00:00.000Z',
  completionTimeSeconds: 480,
}

const demoNarrative = {
  summary: 'Este perfil demonstra integração intencional de recursos digitais e IA ao planejamento e à criação de experiências. O próximo movimento é tornar critérios de avaliação, transparência e autoria igualmente consistentes.',
  implications: [
    {
      title: 'Planejamento com critérios',
      manifestation: 'A escolha de recursos tende a partir dos objetivos de aprendizagem e de uma curadoria consciente.',
      impact: 'Isso pode reduzir escolhas guiadas apenas pela novidade e tornar o percurso mais coerente.',
    },
    {
      title: 'Experiências com participação',
      manifestation: 'Os estudantes encontram oportunidades para produzir, investigar e justificar decisões com apoio digital.',
      impact: 'A tecnologia passa a ampliar autoria e participação, em vez de apenas substituir suportes.',
    },
    {
      title: 'Avaliação em consolidação',
      manifestation: 'Há intenção de acompanhar processos, mas evidências e devolutivas ainda podem ganhar regularidade.',
      impact: 'Critérios mais visíveis podem aproximar feedback, revisão e progressão da aprendizagem.',
    },
    {
      title: 'IA com cuidado explícito',
      manifestation: 'O uso de IA já tem propósito, enquanto regras de dados, transparência e autoria pedem maior sistematização.',
      impact: 'Explicitar esses critérios pode preservar confiança, responsabilidade e possibilidade de revisão.',
    },
  ],
  developmentPlan: {
    whyPrioritized: 'Entre dimensões próximas, ética, segurança e autoria foi escolhida pela prioridade metodológica: ampliar o uso de IA exige primeiro tornar proteção, transparência e responsabilidade visíveis.',
    objective: 'Fortalecer proteção, transparência e autoria antes de ampliar o uso.',
    nextActivityAction: 'Faça uma revisão prévia de dados, riscos e regras de autoria da próxima atividade digital.',
    criteria: [
      'nenhum dado desnecessário será enviado',
      'o uso de IA será comunicado',
      'há supervisão e possibilidade de revisão',
    ],
    observableEvidence: 'Um protocolo curto compartilhado com a turma antes da atividade.',
    preparationTime: '15–20 minutos',
    reflection: 'Que risco foi reduzido e qual decisão ficou mais transparente para os envolvidos?',
  },
}
const demoFaq = [
  {
    question: 'Este resultado pertence a uma pessoa real?',
    answer: 'Não. Todos os dados desta página são fictícios e servem apenas para demonstrar como a devolutiva do Radar Docente é organizada.',
  },
  {
    question: 'Meu resultado terá exatamente estas recomendações?',
    answer: 'Não. O Score PraxIA, o radar, as interpretações e o plano variam conforme suas respostas às seis dimensões.',
  },
  {
    question: 'Como recebo minha própria devolutiva?',
    answer: 'Faça o Radar Docente, responda aos 30 itens e conclua a revisão. O resultado aparece imediatamente e pode ser exportado como relatório completo em PDF.',
  },
]

const resultSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Exemplo de resultado do Radar Docente PraxIA',
      description: 'Veja como o Score PraxIA, o radar de seis dimensões e o plano de desenvolvimento aparecem em uma devolutiva demonstrativa.',
      url: 'https://www.radarpraxia.com/resultado',
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'WebSite', name: 'PraxIA', url: 'https://www.radarpraxia.com/' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Exemplo de resultado', item: 'https://www.radarpraxia.com/resultado' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: demoFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export function DemoResultPage() {
  useScrollMotion()
  const plan = demoNarrative.developmentPlan

  return (
    <>
      <Seo
        title="Exemplo de resultado: Score PraxIA e Radar Docente"
        description="Explore uma devolutiva demonstrativa com Score PraxIA, radar de seis dimensões, interpretação e plano de desenvolvimento."
        path="/resultado"
        jsonLd={resultSchema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader />
      <main id="conteudo-principal" className="result-page demo-result-page">
        <section className="demo-result-notice" aria-label="Aviso de demonstração">
          <div className="shell">
            <Sparkles aria-hidden="true" />
            <p><strong>Resultado demonstrativo.</strong> Este perfil é fictício e existe apenas para mostrar como a devolutiva funciona.</p>
            <ButtonLink href="/radar" variant="light">Gerar meu resultado</ButtonLink>
          </div>
        </section>

        <section className="result-hero demo-result-hero">
          <div className="result-hero__copy">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Exemplo de resultado</span>
            </nav>
            <p className="flow-eyebrow">SCORE PRÁXIA • EXEMPLO</p>
            <h1>Score PraxIA:<br /><em>72 de 100.</em></h1>
            <p>{demoResult.band.message}</p>
            <span>Faixa Integração · Dados fictícios · Leitura orientativa</span>
          </div>
          <DemoScoreGauge />
        </section>

        <section className="result-reveal result-section">
          <div className="result-editorial-heading" data-reveal="left">
            <p className="flow-eyebrow">INTERPRETAÇÃO</p>
            <h2>O que este perfil<br /><em>sugere.</em></h2>
          </div>
          <div className="result-reveal__text" data-reveal="right">
            <span aria-hidden="true">“</span>
            <p>{demoNarrative.summary}</p>
          </div>
        </section>

        <section className="teaching-impact">
          <div className="result-section">
            <div className="result-section__heading" data-reveal="up">
              <div><p className="flow-eyebrow">NA PRÁTICA</p><h2>Como isso poderia aparecer na docência.</h2></div>
              <p>Possibilidades de leitura para este exemplo — não afirmações sobre uma pessoa real.</p>
            </div>
            <div className="teaching-impact__grid">
              {demoNarrative.implications.map((implication, index) => (
                <article key={implication.title} data-reveal="up">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{implication.title}</h3>
                  <p>{implication.manifestation}</p>
                  <div><ArrowRight aria-hidden="true" /><p>{implication.impact}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="result-section result-dimensions">
          <div className="result-section__heading" data-reveal="up">
            <div><p className="flow-eyebrow">COMPOSIÇÃO DO SCORE</p><h2>Seis dimensões.<br />Uma leitura integrada.</h2></div>
            <p>O radar preserva as diferenças entre dimensões e explica o número geral sem competir visualmente com ele.</p>
          </div>
          <div className="result-radar-card" data-reveal="up">
            <div className="result-radar-chart" role="img" aria-label="Radar demonstrativo com os scores das seis dimensões">
              <svg className="demo-radar-svg" viewBox="0 0 520 440" aria-hidden="true">
                <g className="demo-radar-svg__grid">
                  <polygon points="260,40 416,130 416,310 260,400 104,310 104,130" />
                  <polygon points="260,85 377,153 377,287 260,355 143,287 143,153" />
                  <polygon points="260,130 338,175 338,265 260,310 182,265 182,175" />
                  <polygon points="260,175 299,197 299,243 260,265 221,243 221,197" />
                  <path d="M260 40v360M104 130l312 180M416 130L104 310" />
                </g>
                <polygon className="demo-radar-svg__result" points="260,76 377,153 377,287 260,346 159,278 159,162" />
                <g className="demo-radar-svg__points">
                  <circle cx="260" cy="76" r="7" /><circle cx="377" cy="153" r="7" /><circle cx="377" cy="287" r="7" />
                  <circle cx="260" cy="346" r="7" /><circle cx="159" cy="278" r="7" /><circle cx="159" cy="162" r="7" />
                </g>
                <g className="demo-radar-svg__labels">
                  <text x="260" y="22">Planejamento</text><text x="430" y="126">Criação</text>
                  <text x="430" y="322">Mediação</text><text x="260" y="426">Avaliação</text>
                  <text x="90" y="326">Integração da IA</text><text x="88" y="122">Ética e autoria</text>
                </g>
              </svg>
            </div>
            <div className="dimension-values">
              {demoResult.dimensionScores.map((dimension) => (
                <div key={dimension.dimensionId}>
                  <span>{dimension.dimensionName}</span><strong>{dimension.score}</strong>
                  <progress max="100" value={dimension.score}>{dimension.score}</progress>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="demo-competencies">
          <div className="result-section">
            <div className="result-section__heading" data-reveal="up">
              <div><p className="flow-eyebrow">LEITURA DAS COMPETÊNCIAS</p><h2>Forças e desenvolvimento sem rótulos.</h2></div>
              <p>O resultado indica relações internas ao perfil, nunca comparação com outros professores.</p>
            </div>
            <div className="demo-competencies__grid">
              <article data-reveal="left"><CheckCircle2 aria-hidden="true" /><span>COMPETÊNCIA FORTE</span><h3>Planejamento e curadoria</h3><p>Objetivos e critérios aparecem de forma mais consolidada na seleção de recursos e na organização dos percursos.</p></article>
              <article data-reveal="right"><Compass aria-hidden="true" /><span>COMPETÊNCIAS A DESENVOLVER</span><h3>Integração pedagógica da IA e ética, segurança e autoria</h3><p>O próximo movimento aproxima intenção pedagógica, transparência, proteção de dados e responsabilidade autoral.</p></article>
            </div>
          </div>
        </section>

        <section className="development-plan">
          <div className="development-plan__intro">
            <p className="flow-eyebrow">PLANO DE EVOLUÇÃO</p>
            <h2>Um experimento pequeno.<br /><em>Uma evidência real.</em></h2>
            <p>{plan.whyPrioritized}</p>
            <span>DIMENSÃO PRIORIZADA</span>
            <strong>Ética, segurança e autoria</strong>
          </div>
          <div className="development-plan__content">
            <article className="development-plan__objective"><Target aria-hidden="true" /><div><span>OBJETIVO DE DESENVOLVIMENTO</span><p>{plan.objective}</p></div></article>
            <article className="development-plan__action"><span>PARA A PRÓXIMA ATIVIDADE</span><h3>{plan.nextActivityAction}</h3></article>
            <div className="development-plan__details">
              <article><h3>Critérios para executar</h3><ul>{plan.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></article>
              <article><Eye aria-hidden="true" /><h3>Evidência observável</h3><p>{plan.observableEvidence}</p></article>
              <article><Clock3 aria-hidden="true" /><h3>Tempo de preparação</h3><p>{plan.preparationTime}</p></article>
            </div>
            <div className="development-plan__reflection"><span>DEPOIS DA EXPERIÊNCIA, PERGUNTE-SE</span><p>{plan.reflection}</p></div>
          </div>
        </section>

        <section className="demo-result-cta">
          <div className="shell" data-reveal="up">
            <p className="method-kicker">AGORA É COM A SUA PRÁTICA</p>
            <h2>Este é apenas um exemplo. Sua devolutiva será construída a partir das suas respostas.</h2>
            <p>Reserve aproximadamente oito minutos para responder ao Radar e receber score, dimensões e plano personalizados.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Gerar meu Score PraxIA</ButtonLink>
          </div>
        </section>

        <ResultCommercialOffers bandId={demoResult.band.id} sourcePage="demo_result" />

        <FaqSection items={demoFaq} title="Sobre esta demonstração" />
      </main>
      <Footer />
    </>
  )
}
