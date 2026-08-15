import { ArrowRight, ChevronRight, Eye, Hexagon, ShieldCheck, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { ComparisonTable, Timeline } from '../components/ContentPatterns'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'

const dimensions = [
  ['Planejamento', 'Escolher recursos digitais e IA a partir dos objetivos de aprendizagem, do contexto e das evidências esperadas.'],
  ['Criação', 'Produzir e adaptar materiais com intencionalidade, autoria e atenção à acessibilidade.'],
  ['Mediação', 'Organizar interações nas quais estudantes participam, investigam, colaboram e tornam o raciocínio visível.'],
  ['Avaliação', 'Acompanhar processos, interpretar evidências e oferecer feedback que ajude o estudante a avançar.'],
  ['Inteligência artificial', 'Compreender possibilidades e limites da IA para decidir quando, por que e como utilizá-la.'],
  ['Ética e cidadania digital', 'Proteger dados, explicitar responsabilidades e promover uso crítico, seguro e inclusivo.'],
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', name: 'Competências docentes digitais e em IA', url: 'https://www.radarpraxia.com/competencias', description: 'As seis dimensões de competências observadas pelo Radar Docente PraxIA.', inLanguage: 'pt-BR' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Competências', item: 'https://www.radarpraxia.com/competencias' },
    ] },
  ],
}

export function CompetenciesPage() {
  return (
    <>
      <Seo title="Competências docentes digitais e em IA | PraxIA" description="Conheça as seis dimensões que ajudam professores a observar sua fluência digital e em IA como prática situada, integrada e em desenvolvimento." path="/competencias" jsonLd={schema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader />
      <main id="conteudo-principal" className="knowledge-page">
        <header className="knowledge-hero"><div className="shell"><nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Competências</span></nav><div className="knowledge-hero__grid"><div><p className="method-kicker">COMPETÊNCIAS DOCENTES</p><h1>Fluência não é acumular ferramentas. É <em>articular decisões.</em></h1><p>As seis dimensões da PraxIA ajudam a observar como intenção pedagógica, mediação, avaliação, criação, IA e ética aparecem juntas na prática.</p></div><div className="knowledge-orbit" aria-hidden="true"><Hexagon /><strong>6</strong><span>dimensões conectadas</span><i /><i /><i /></div></div></div></header>

        <section className="knowledge-intro"><div className="shell method-heading"><div><p className="method-kicker">UMA LEITURA INTEGRADA</p><h2>Competência aparece quando conhecimento se transforma em ação situada.</h2></div><p>Por isso, o Radar não pergunta apenas se o professor conhece um recurso. Ele procura indícios de intenção, escolha, acompanhamento, revisão e responsabilidade em contextos reais.</p></div></section>

        <section className="knowledge-dimensions"><div className="shell"><div className="method-heading"><div><p className="method-kicker">AS SEIS DIMENSÕES</p><h2>Campos distintos, trajetórias que se encontram.</h2></div><p>Cada dimensão explica uma parte do Score PraxIA. Nenhuma, isoladamente, resume a prática docente.</p></div><div className="knowledge-dimensions__grid">{dimensions.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><Link to="/metodologia">Ver na metodologia <ArrowRight aria-hidden="true" /></Link></article>)}</div></div></section>

        <section className="knowledge-observation"><div className="shell"><div><p className="method-kicker">COMO OBSERVAR</p><h2>Da intenção à evidência, sem transformar desenvolvimento em julgamento.</h2></div><Timeline ariaLabel="Trajetória de observação de uma competência" items={[
          { label: 'Intenção', title: 'O que se pretende favorecer?', text: 'A decisão começa no objetivo de aprendizagem e nas condições da turma.' },
          { label: 'Ação', title: 'Que escolha pedagógica foi feita?', text: 'A prática torna visível como recursos, pessoas e tempos foram articulados.' },
          { label: 'Evidência', title: 'O que permite acompanhar?', text: 'Produções, interações e registros ajudam a interpretar o que aconteceu.' },
          { label: 'Revisão', title: 'Qual é o próximo ajuste?', text: 'A competência se desenvolve quando a experiência informa uma nova decisão.' },
        ]} /></div></section>

        <section className="knowledge-comparison"><div className="shell"><div className="method-heading"><div><p className="method-kicker">UM CUIDADO DE LEITURA</p><h2>Uso frequente e uso competente não são sinônimos.</h2></div><p>A frequência pode gerar familiaridade. A competência exige que a escolha faça sentido para a aprendizagem, para as pessoas e para o contexto.</p></div><ComparisonTable caption="Diferenças entre uso instrumental e prática orientada por competência" firstLabel="Uso instrumental" secondLabel="Prática orientada por competência" rows={[
          { criterion: 'Ponto de partida', first: 'A ferramenta disponível', second: 'O objetivo e o contexto' },
          { criterion: 'Critério de escolha', first: 'Rapidez ou novidade', second: 'Adequação pedagógica e responsabilidade' },
          { criterion: 'Evidência', first: 'A atividade foi concluída', second: 'O processo tornou a aprendizagem observável' },
          { criterion: 'Próximo movimento', first: 'Trocar de ferramenta', second: 'Revisar a decisão com base nas evidências' },
        ]} /></div></section>

        <section className="knowledge-links"><div className="shell"><article><Target aria-hidden="true" /><h3>Quer entender como as dimensões são avaliadas?</h3><p>Conheça a fundamentação, as faixas de desenvolvimento e os limites interpretativos.</p><Link to="/metodologia">Ler a metodologia <ArrowRight aria-hidden="true" /></Link></article><article><Eye aria-hidden="true" /><h3>Quer ver a leitura em contexto?</h3><p>Explore uma página demonstrativa com score, radar, competências e plano de evolução.</p><Link to="/resultado">Ver resultado demonstrativo <ArrowRight aria-hidden="true" /></Link></article><article><ShieldCheck aria-hidden="true" /><h3>Quer reconhecer sua trajetória?</h3><p>Responda ao Radar e receba uma leitura orientativa das seis dimensões.</p><Link to="/radar">Fazer o Radar <ArrowRight aria-hidden="true" /></Link></article></div></section>
        <section className="knowledge-cta"><div className="shell"><div><p className="method-kicker">PONTOS SÃO EVIDÊNCIAS. TRAJETÓRIAS SÃO EVOLUÇÃO.</p><h2>Veja como suas decisões se conectam hoje.</h2></div><ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar</ButtonLink></div></section>
      </main>
      <Footer />
    </>
  )
}
