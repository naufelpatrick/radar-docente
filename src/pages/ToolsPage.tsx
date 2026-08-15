import { ArrowRight, ChevronRight, CircleCheck, Compass, Search, ShieldCheck, SlidersHorizontal, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Stepper } from '../components/ContentPatterns'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'

const criteria = [
  ['Adequação pedagógica', 'A função do recurso ajuda a realizar o objetivo ou apenas acrescenta uma etapa?'],
  ['Dados e privacidade', 'Que dados são solicitados, onde ficam e quais alternativas existem para estudantes?'],
  ['Acessibilidade', 'A experiência admite diferentes formas de acesso, participação e expressão?'],
  ['Autoria e transparência', 'É possível explicitar como o recurso participou do processo e revisar seus resultados?'],
  ['Viabilidade', 'Tempo, infraestrutura, suporte e familiaridade tornam o uso sustentável neste contexto?'],
  ['Evidências', 'O recurso ajuda a tornar o processo de aprendizagem observável para professor e estudante?'],
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', name: 'Ferramentas para a prática docente', url: 'https://www.radarpraxia.com/ferramentas', description: 'Critérios pedagógicos para escolher e revisar ferramentas digitais e de inteligência artificial.', inLanguage: 'pt-BR' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: 'https://www.radarpraxia.com/ferramentas' },
    ] },
  ],
}

export function ToolsPage() {
  return (
    <>
      <Seo title="Ferramentas digitais e IA: critérios para professores | PraxIA" description="Avalie ferramentas digitais e de IA por adequação pedagógica, privacidade, acessibilidade, autoria, viabilidade e evidências de aprendizagem." path="/ferramentas" jsonLd={schema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader />
      <main id="conteudo-principal" className="tools-page">
        <header className="tools-hero"><div className="shell"><nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Ferramentas</span></nav><div className="tools-hero__grid"><div><p className="method-kicker">FERRAMENTAS NA PRÁTICA</p><h1>Escolher tecnologia é uma <em>decisão pedagógica.</em></h1><p>Este espaço organiza critérios para analisar recursos digitais e de IA sem listas definitivas, promessas fáceis ou dependência da novidade.</p></div><div className="tools-lens" aria-hidden="true"><Search /><div><span>objetivo</span><span>contexto</span><span>evidência</span></div></div></div></div></header>

        <section className="tools-position"><div className="shell method-heading"><div><p className="method-kicker">ANTES DO CATÁLOGO</p><h2>Uma boa escolha começa por perguntas, não por rankings.</h2></div><p>Ferramentas mudam, planos comerciais mudam e condições institucionais variam. Critérios claros permanecem úteis porque ajudam o professor a decidir e a justificar sua decisão.</p></div></section>

        <section className="tools-criteria"><div className="shell"><div className="method-heading"><div><p className="method-kicker">SEIS CRITÉRIOS</p><h2>O que observar antes de levar um recurso para a turma.</h2></div><p>Os critérios funcionam como uma lente conjunta. Um recurso atraente pode não ser adequado quando dados, acessibilidade ou autoria ficam pouco claros.</p></div><div className="tools-criteria__grid">{criteria.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><CircleCheck aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section className="tools-process"><div className="shell"><div className="method-heading"><div><p className="method-kicker">PERCURSO DE ESCOLHA</p><h2>Da necessidade ao ajuste em quatro movimentos.</h2></div><p>O teste com uma turma não encerra a escolha: produz evidências para mantê-la, adaptá-la ou abandoná-la.</p></div><Stepper items={[
          { label: 'Definir', title: 'Nomeie a necessidade', text: 'Descreva objetivo, estudantes, evidência esperada e restrições antes de pesquisar.' },
          { label: 'Comparar', title: 'Aplique os critérios', text: 'Observe mais de uma alternativa, inclusive a possibilidade de não usar tecnologia.' },
          { label: 'Experimentar', title: 'Comece com escopo pequeno', text: 'Planeje orientação, alternativa de participação e forma de acompanhar o processo.' },
          { label: 'Revisar', title: 'Decida com evidências', text: 'Registre o que favoreceu aprendizagem, o que gerou barreiras e o que precisa mudar.' },
        ]} /></div></section>

        <section className="tools-boundaries"><div className="shell"><div><ShieldCheck aria-hidden="true" /><p className="method-kicker">LIMITES DESTE ESPAÇO</p><h2>A PraxIA não certifica nem endossa ferramentas.</h2><p>Os conteúdos oferecem critérios educacionais para análise. Políticas de privacidade, termos, preços e funcionalidades devem ser verificados diretamente nas fontes oficiais antes de cada adoção.</p></div><ul><li><Compass aria-hidden="true" /><span><strong>Contexto antes da recomendação</strong>Uma ferramenta adequada para uma turma pode não ser adequada para outra.</span></li><li><SlidersHorizontal aria-hidden="true" /><span><strong>Configuração também é decisão</strong>O modo de uso pode alterar riscos, barreiras e possibilidades pedagógicas.</span></li><li><Wrench aria-hidden="true" /><span><strong>Revisão contínua</strong>Mudanças técnicas ou institucionais pedem uma nova análise.</span></li></ul></div></section>

        <section className="tools-next"><div className="shell"><article><h3>Comece pelos critérios</h3><p>Leia o guia sobre decisões que antecedem o uso de IA com estudantes.</p><Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Abrir artigo <ArrowRight aria-hidden="true" /></Link></article><article><h3>Reconheça seu ponto de partida</h3><p>O Radar ajuda a identificar qual dimensão pede atenção no próximo experimento.</p><Link to="/radar">Fazer o Radar <ArrowRight aria-hidden="true" /></Link></article></div></section>
        <section className="tools-cta"><div className="shell"><div><p className="method-kicker">A FERRAMENTA É PARTE DO CAMPO, NÃO O CENTRO.</p><h2>Faça escolhas coerentes com sua trajetória docente.</h2></div><ButtonLink href="/guias" variant="light" showArrow>Explorar os guias</ButtonLink></div></section>
      </main>
      <Footer />
    </>
  )
}
