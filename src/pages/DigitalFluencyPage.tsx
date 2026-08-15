import { ArrowRight, BookOpen, Bot, Check, Compass, Lightbulb, ListChecks, PenTool, Scale, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { getPublishedBlogArticles } from '../data/blogArticles'
import { trackDigitalFluencyRadarCta } from '../services/digitalFluencyAnalytics'
import './DigitalFluencyPage.css'

const dimensions = [
  ['01', 'Planejamento e curadoria', 'Selecionar recursos, organizar percursos e relacionar escolhas digitais aos objetivos de aprendizagem.'],
  ['02', 'Criação de experiências', 'Usar recursos digitais para apoiar participação, autoria, investigação e produção dos estudantes.'],
  ['03', 'Mediação e colaboração', 'Sustentar presença docente, diálogo e cooperação em experiências mediadas por tecnologia.'],
  ['04', 'Avaliação e feedback', 'Usar evidências digitais para acompanhar, oferecer devolutivas e ajustar o processo de ensino.'],
  ['05', 'Integração pedagógica da IA', 'Orientar quando e como utilizar inteligência artificial com propósito, critérios e supervisão pedagógica.'],
  ['06', 'Ética, segurança e autoria', 'Considerar privacidade, vieses, transparência, autoria e supervisão humana nas decisões.'],
]

const faqItems = [
  { question: 'O que é fluência digital para professores?', answer: 'É a capacidade de utilizar tecnologias de forma crítica, criativa e pedagogicamente intencional, conectando ferramentas, objetivos de aprendizagem, contexto e avaliação.' },
  { question: 'Fluência digital significa dominar muitas ferramentas?', answer: 'Não. Mais importante do que conhecer muitas plataformas é saber escolher e utilizar os recursos adequados para cada objetivo e realidade de ensino.' },
  { question: 'A inteligência artificial faz parte da fluência digital?', answer: 'Sim. A IA é uma dimensão importante da prática contemporânea, mas deve ser usada com curadoria, responsabilidade, atenção a vieses e preservação da autoria docente e estudantil.' },
  { question: 'O Radar PraxIA é gratuito?', answer: 'Sim. O Radar PraxIA é um diagnóstico gratuito e orientativo para apoiar a reflexão sobre fluência digital e uso pedagógico de inteligência artificial.' },
  { question: 'O resultado do Radar PraxIA é uma avaliação definitiva?', answer: 'Não. O resultado funciona como uma leitura orientativa e um ponto de partida para reconhecer avanços, desafios e próximos passos de desenvolvimento.' },
]

const steps = [
  ['01', 'Observe sua prática atual', 'Identifique onde a tecnologia já ajuda e onde ainda causa insegurança ou retrabalho.'],
  ['02', 'Escolha um desafio real', 'Comece por uma necessidade concreta: planejar uma aula, criar um material, diversificar uma avaliação ou melhorar a participação.'],
  ['03', 'Experimente com critério', 'Teste recursos em pequena escala, defina objetivos e observe o que muda na aprendizagem.'],
  ['04', 'Reflita e avance', 'Avalie os resultados, ajuste a rota e transforme experiências em repertório para as próximas escolhas.'],
]

export function DigitalFluencyPage() {
  const articles = getPublishedBlogArticles().filter((article) => ['competencias-docentes', 'planejamento', 'avaliacao', 'etica'].includes(article.categorySlug)).slice(0, 3)
  const url = 'https://www.radarpraxia.com/fluencia-digital-para-professores'
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: 'Fluência digital para professores: descubra seu nível e avance com intencionalidade', description: 'Entenda o que é fluência digital para professores, conheça suas dimensões e faça gratuitamente o Radar PraxIA para orientar seu desenvolvimento.', mainEntityOfPage: url, url, inLanguage: 'pt-BR', author: { '@type': 'Organization', name: 'PraxIA' }, publisher: { '@type': 'Organization', name: 'PraxIA', url: 'https://www.radarpraxia.com' } },
    { '@type': 'FAQPage', mainEntity: faqItems.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ] }

  return <>
    <Seo title="Fluência digital para professores: descubra seu nível | PraxIA" description="Entenda o que é fluência digital para professores, conheça suas dimensões e faça gratuitamente o Radar PraxIA para orientar seu desenvolvimento." path="/fluencia-digital-para-professores" type="article" jsonLd={schema} />
    <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a><InstitutionalHeader />
    <main id="conteudo-principal" className="fluency-page">
      <section className="fluency-hero"><div className="shell fluency-hero__grid"><div><p className="method-kicker">FLUÊNCIA DIGITAL DOCENTE</p><h1>Fluência digital para professores: <em>descubra seu nível e avance com intencionalidade</em></h1><p className="fluency-lead">Fluência digital não é apenas saber usar ferramentas. É conseguir escolher, adaptar e criar recursos digitais com intenção pedagógica, senso crítico e foco real na aprendizagem.</p><p>O Radar PraxIA ajuda você a refletir sobre sua prática, identificar pontos de avanço e transformar tecnologia — incluindo a inteligência artificial — em escolhas mais conscientes para o seu contexto de ensino.</p><div className="fluency-actions"><ButtonLink href="/radar" variant="light" showArrow onClick={() => trackDigitalFluencyRadarCta('hero')}>Fazer o Radar PraxIA gratuitamente</ButtonLink><ButtonLink href="/metodologia" variant="secondary">Conheça a metodologia</ButtonLink></div></div><div className="fluency-hero__visual" aria-hidden="true"><div className="fluency-orbit"><span>contexto</span><span>intenção</span><span>aprendizagem</span><i /><i /><i /></div></div></div></section>

      <section className="fluency-section fluency-definition"><div className="shell"><div className="fluency-heading"><p className="method-kicker">CONCEITO</p><h2>O que é fluência digital docente?</h2><p>Fluência digital docente é a capacidade de mobilizar conhecimentos, critérios e atitudes para usar tecnologias de forma significativa no ensino. Não se trata de dominar todas as plataformas nem de acompanhar cada novidade. Trata-se de tomar boas decisões pedagógicas.</p></div><div className="fluency-three"><article><Target /><p>Escolher recursos a partir de objetivos de aprendizagem, e não pela novidade.</p></article><article><PenTool /><p>Planejar experiências mais acessíveis, participativas e coerentes com cada turma.</p></article><article><Scale /><p>Avaliar criticamente ferramentas, informações e resultados produzidos com tecnologia.</p></article></div><p className="fluency-closing">Uma professora ou um professor digitalmente fluente não usa tecnologia por obrigação. Usa quando ela faz sentido para ensinar, aprender, criar, avaliar ou ampliar possibilidades.</p></div></section>

      <section className="fluency-section"><div className="shell"><div className="fluency-heading"><p className="method-kicker">POR QUE DESENVOLVER</p><h2>Por que desenvolver fluência digital é importante para professores?</h2></div><div className="fluency-benefits"><article><Compass /><h3>Mais segurança para decidir</h3><p>Use recursos digitais com critério, sem depender de receitas prontas.</p></article><article><ListChecks /><h3>Planejamentos mais coerentes</h3><p>Conecte objetivos, metodologias, materiais e formas de avaliação.</p></article><article><Lightbulb /><h3>Mais autoria na prática docente</h3><p>Adapte ferramentas e conteúdos à realidade da sua turma, em vez de apenas reproduzir modelos.</p></article><article><ShieldCheck /><h3>Uso mais responsável da inteligência artificial</h3><p>Aproveite possibilidades de IA com curadoria, contexto, ética e preservação da autoria.</p></article></div></div></section>

      <section className="fluency-section fluency-dimensions"><div className="shell"><div className="fluency-heading"><p className="method-kicker">RADAR PraxIA</p><h2>As seis dimensões avaliadas pelo Radar PraxIA</h2><p>A fluência digital se constrói em diferentes frentes. O Radar PraxIA organiza essa reflexão em seis dimensões complementares para oferecer uma leitura mais ampla da sua prática.</p></div><div className="fluency-dimensions__grid">{dimensions.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="fluency-inline-cta"><p>O resultado não é um rótulo. É um ponto de partida para reconhecer o que já funciona e priorizar próximos passos possíveis.</p><ButtonLink href="/radar" variant="light" showArrow onClick={() => trackDigitalFluencyRadarCta('dimensions')}>Descobrir meu nível de fluência digital</ButtonLink></div></div></section>

      <section className="fluency-section fluency-ai"><div className="shell"><div className="fluency-heading"><p className="method-kicker">DECISÃO HUMANA</p><h2>Fluência digital e inteligência artificial: como elas se conectam?</h2><p>A inteligência artificial amplia possibilidades de planejamento, criação de materiais, personalização e avaliação. Mas seu uso só se torna pedagogicamente valioso quando parte de uma decisão humana bem fundamentada.</p></div><div className="fluency-ai__grid"><article><Bot /><h3>O que a IA pode apoiar</h3><ul><li>Organizar ideias e rascunhos.</li><li>Criar variações de atividades e materiais.</li><li>Adaptar linguagem, formatos e níveis de complexidade.</li><li>Apoiar a elaboração de perguntas, exemplos e feedbacks.</li></ul></article><article><BookOpen /><h3>O que continua sendo responsabilidade docente</h3><ul><li>Definir objetivos de aprendizagem.</li><li>Considerar o contexto, a diversidade e as necessidades da turma.</li><li>Verificar qualidade, vieses, erros e informações inventadas.</li><li>Preservar autoria, pensamento crítico e aprendizagem real.</li></ul></article></div><blockquote>“A ferramenta gera possibilidades. A intenção pedagógica define o valor delas.”</blockquote></div></section>

      <section className="fluency-section fluency-steps"><div className="shell"><div className="fluency-heading"><p className="method-kicker">PRIMEIROS PASSOS</p><h2>Como começar a desenvolver sua fluência digital</h2></div><ol>{steps.map(([number,title,text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>

      <section className="fluency-assessment"><div className="shell fluency-assessment__grid"><div><p className="method-kicker">AUTOAVALIAÇÃO ORIENTATIVA</p><h2>Faça uma autoavaliação da sua fluência digital</h2><p>Você não precisa descobrir tudo sozinho nem ter todas as respostas antes de começar. O Radar PraxIA é um diagnóstico gratuito e orientativo para professores que desejam compreender melhor sua relação com a tecnologia e a IA na prática pedagógica.</p><ul>{['Diagnóstico gratuito','Leitura por dimensões','Resultado orientativo','Próximos passos para avançar'].map(item => <li key={item}><Check />{item}</li>)}</ul></div><ButtonLink href="/radar" variant="light" showArrow onClick={() => trackDigitalFluencyRadarCta('final')}>Fazer o Radar PraxIA gratuitamente</ButtonLink></div></section>

      <section className="fluency-section fluency-learning"><div className="shell"><div className="fluency-heading"><p className="method-kicker">CONTINUE APRENDENDO</p><h2>Conteúdos para continuar aprendendo</h2></div><div className="fluency-articles">{articles.map(article => <article key={article.slug}><span>{article.category}</span><h3>{article.title}</h3><p>{article.summary}</p><Link to={article.path}>Ler conteúdo <ArrowRight /></Link></article>)}</div><Link className="fluency-all" to="/blog">Ver todos os conteúdos da PraxIA <ArrowRight /></Link></div></section>
      <FaqSection items={faqItems} title="Perguntas frequentes sobre fluência digital para professores" />
      <aside className="fluency-references"><div className="shell"><Sparkles /><p>Esta leitura dialoga com marcos de competência digital docente, como DigCompEdu, UNESCO e CIEB, considerados na fundamentação da metodologia PraxIA.</p></div></aside>
    </main><Footer />
  </>
}
