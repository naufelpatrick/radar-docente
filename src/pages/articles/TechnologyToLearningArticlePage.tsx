import { ArrowRight, CheckCircle2, ExternalLink, Filter, Lightbulb, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { DecisionMatrix } from '../../components/DecisionMatrix'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem')
const firstArticlePath = '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta'
const toc = [
  { id: 'objetivo', label: 'Possibilidade não é objetivo' },
  { id: 'observavel', label: 'Ações observáveis' },
  { id: 'alinhamento', label: 'Produto, tarefa e aprendizagem' },
  { id: 'valor', label: 'O que a IA acrescenta' },
  { id: 'nucleo', label: 'Núcleo cognitivo' },
  { id: 'momento', label: 'Momento da intervenção' },
  { id: 'evidencia', label: 'Evidências' },
  { id: 'matriz', label: 'Matriz de decisão' },
  { id: 'exemplo', label: 'Exemplo aplicado' },
  { id: 'roteiro', label: 'Sete perguntas' },
  { id: 'referencias', label: 'Referências' },
]
const articleFaq = [
  { question: 'Todo planejamento com IA precisa começar por um objetivo formal?', answer: 'Sim, ainda que o objetivo seja expresso de forma simples. O essencial é saber qual aprendizagem se espera observar e quais decisões demonstrarão essa aprendizagem.' },
  { question: 'Como saber se a IA acrescenta valor à atividade?', answer: 'Compare a experiência com e sem a ferramenta. Observe se a IA amplia perspectivas, simulações, acessibilidade, feedback ou experimentação. Se apenas adiciona novidade ou velocidade sem benefício pedagógico claro, reconsidere seu uso.' },
  { question: 'É errado começar explorando uma ferramenta?', answer: 'Não. A exploração pode gerar repertório e ideias. O problema é transformar diretamente uma função descoberta em atividade sem analisar objetivo, tarefa, evidência e risco.' },
  { question: 'A IA pode fazer parte do objetivo de aprendizagem?', answer: 'Pode, quando a própria tecnologia é objeto de estudo. O objetivo pode envolver compreender limites, avaliar respostas, reconhecer vieses ou analisar impactos. Ainda assim, usar a ferramenta não basta como evidência.' },
  { question: 'Como evitar que o produto final esconda o processo?', answer: 'Inclua evidências intermediárias proporcionais ao objetivo: hipótese inicial, justificativas, comparação entre versões, verificação de fontes ou reflexão sobre as decisões tomadas.' },
]
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['planejamento de aula com IA', 'objetivo de aprendizagem', 'atividade com IA', 'uso pedagógico da IA'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Planejamento', item: 'https://www.radarpraxia.com/blog/categoria/planejamento' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function TechnologyToLearningArticlePage() {
  return (
    <>
      <Seo title={article.title} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
      <ArticleLayout article={article} categoryPath="/blog/categoria/planejamento" toc={toc}>
        <p className="article-lead">Uma ferramenta pode gerar textos, imagens, perguntas, roteiros e simulações em poucos segundos. Isso não significa que cada possibilidade deva se transformar em atividade pedagógica.</p>
        <p>Quando a função tecnológica comanda o planejamento, a avaliação costuma ser decidida tarde demais. Um percurso mais consistente inverte a ordem: define a aprendizagem, torna-a observável, escolhe a experiência e só então pergunta se a IA a amplia.</p>
        <div className="article-funnel" role="img" aria-label="Possibilidades tecnológicas sendo filtradas até chegar a um objetivo de aprendizagem"><div><span>texto</span><span>imagem</span><span>simulação</span><span>chat</span></div><Filter aria-hidden="true" /><strong>Objetivo de aprendizagem</strong></div>

        <section id="objetivo"><h2>Possibilidade tecnológica não é objetivo pedagógico</h2><p>“Criar um podcast com IA”, “usar um chatbot” ou “produzir imagens com IA” descrevem meios. Não esclarecem o que o estudante deverá compreender, analisar, decidir ou demonstrar.</p><div className="article-progression"><p>Usar IA para criar uma apresentação sobre biodiversidade.</p><ArrowRight aria-hidden="true" /><p>Produzir uma apresentação sobre biodiversidade com apoio de IA.</p><ArrowRight aria-hidden="true" /><p><strong>Comparar ameaças em dois biomas, selecionar evidências confiáveis e justificar prioridades de intervenção.</strong></p></div><aside className="article-callout"><Target aria-hidden="true" /><p>A tecnologia entra como recurso. <strong>O objetivo permanece como eixo.</strong></p></aside></section>

        <section id="observavel"><h2>Transforme temas amplos em ações observáveis</h2><p>“Compreender desinformação” pode significar identificar sinais de baixa confiabilidade, comparar fontes, verificar afirmações, reconhecer estratégias de persuasão ou justificar uma correção. Quando o objetivo se torna observável, o papel da IA pode ser delimitado com precisão.</p><aside className="article-callout"><Lightbulb aria-hidden="true" /><p>Complete: <strong>“Ao final da atividade, o estudante deverá ser capaz de…”</strong> Se a continuação descreve apenas o uso da ferramenta, o objetivo ainda não está claro.</p></aside></section>

        <section id="alinhamento"><h2>Distinga produto, tarefa e aprendizagem</h2><div className="article-decisions"><article><span>01</span><h3>Produto</h3><p>O que será entregue: texto, vídeo, apresentação, mapa, relatório ou protótipo.</p></article><article><span>02</span><h3>Tarefa</h3><p>As ações realizadas: pesquisar, comparar, gerar alternativas, selecionar, revisar e apresentar.</p></article><article><span>03</span><h3>Aprendizagem</h3><p>A transformação esperada: domínio conceitual, análise, argumentação, decisão ou resolução de problema.</p></article></div><div className="article-alignment" aria-label="Alinhamento do planejamento"><span>Objetivo</span><ArrowRight /><span>Tarefa</span><ArrowRight /><span>Papel da IA</span><ArrowRight /><span>Evidência</span><ArrowRight /><span>Avaliação</span></div><p>Um produto sofisticado não garante aprendizagem profunda. A avaliação precisa se concentrar nas decisões relacionadas ao objetivo, especialmente quando a ferramenta melhora rapidamente a forma da entrega.</p></section>

        <section id="valor"><h2>Pergunte o que a IA acrescenta</h2><p>Compare a experiência com e sem a ferramenta. A IA pode ampliar perspectivas, simular situações, gerar exemplos variados, adaptar formatos, oferecer estrutura inicial ou produzir respostas imperfeitas para análise crítica.</p><p>Se o único ganho for velocidade, verifique se ela libera tempo para decisões mais complexas ou elimina justamente o esforço que deveria ser aprendido. O valor não está na função isolada, mas na relação entre função, contexto e objetivo.</p></section>

        <section id="nucleo"><h2>Defina o núcleo cognitivo da tarefa</h2><p>O núcleo cognitivo reúne as decisões que concentram a exigência intelectual. Em uma redação, pode envolver formular tese, selecionar evidências e organizar argumentos; em uma pesquisa, avaliar fontes e sustentar conclusões.</p><ul className="article-checklist"><li><CheckCircle2 /><span><strong>Quais decisões são essenciais?</strong> Nomeie o que não pode desaparecer do processo.</span></li><li><CheckCircle2 /><span><strong>Quais erros são produtivos?</strong> Preserve tentativas que ajudam o estudante a revisar o raciocínio.</span></li><li><CheckCircle2 /><span><strong>O que precisa ser explicado sem a ferramenta?</strong> Torne interpretação e julgamento visíveis.</span></li></ul></section>

        <section id="momento"><h2>Escolha o momento da intervenção tecnológica</h2><p>Antes da produção, a IA pode gerar hipóteses. Durante, pode apoiar organização ou simulação. Depois, pode contribuir para comparação e refinamento. O momento escolhido muda o que será possível observar.</p><div className="article-example"><div><span>01 · SEM IA</span><p>Produção inicial para registrar conhecimentos, hipóteses e escolhas do estudante.</p></div><ArrowRight /><div><span>02 · COM IA</span><p>Interação orientada, com propósito, limites e registros definidos.</p></div><ArrowRight /><div><span>03 · AUTORIA</span><p>Revisão crítica para aceitar, rejeitar ou transformar sugestões com justificativa.</p></div></div></section>

        <section id="evidencia"><h2>Planeje a evidência antes da instrução</h2><p>Antecipe: “Que evidência me permitirá afirmar que o objetivo foi alcançado?”. Justificativas, comparação entre alternativas, registros de revisão, análise de erro e aplicação em nova situação tornam a aprendizagem mais visível.</p><p>Quando a IA participa significativamente, o produto final não deve ser a única evidência. Peça, de forma proporcional, uma hipótese inicial, uma sugestão rejeitada, a razão da rejeição ou uma alteração feita após verificação.</p></section>

        <section id="matriz"><h2>Use uma matriz de decisão simples</h2><p>Relacione o valor pedagógico esperado aos riscos para aprendizagem, autoria, privacidade e acesso. A matriz não produz resposta automática; organiza o raciocínio que continuará sendo contextual.</p><DecisionMatrix /><section className="article-cta article-cta--intermediate"><h2>Quer observar como você planeja escolhas com IA?</h2><p>O Radar Docente conecta planejamento, integração pedagógica, avaliação e ética em uma leitura orientativa.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PráxIA</ButtonLink></section></section>

        <section id="exemplo"><h2>Exemplo: da ideia de ferramenta a uma atividade</h2><div className="article-case"><p><strong>Ideia inicial</strong>“Usar um chatbot para ensinar Revolução Industrial.”</p><p><strong>Objetivo reformulado</strong>Comparar como diferentes grupos sociais foram afetados pela industrialização e justificar por que os impactos não foram iguais.</p><p><strong>Tarefa e papel da IA</strong>Analisar duas fontes, registrar uma interpretação inicial e depois usar o chatbot para simular perspectivas. As afirmações geradas são verificadas com as fontes.</p><p><strong>Evidências e avaliação</strong>Interpretação inicial, quadro de verificação, síntese comparativa, uso de evidências e identificação de inconsistências.</p></div><p>A ferramenta deixou de ser o objetivo e passou a cumprir uma função específica em uma experiência coerente.</p></section>

        <section id="roteiro"><h2>Um roteiro de sete perguntas</h2><ol className="article-checklist">{['Qual aprendizagem precisa acontecer?','Como essa aprendizagem ficará visível?','Qual é o núcleo cognitivo da tarefa?','O que a IA realmente acrescenta?','Em que momento ela deve aparecer?','Que riscos precisam ser limitados?','Que evidências serão avaliadas?'].map((question) => <li key={question}><CheckCircle2 aria-hidden="true" /><span>{question}</span></li>)}</ol><p>Se essas respostas forem claras, a escolha da ferramenta se torna mais simples. Se não forem, ainda não é hora de escolher a ferramenta.</p></section>

        <section><h2>Planejar com IA continua sendo planejar</h2><p>Decisões de tecnologia permanecem subordinadas às decisões de aprendizagem. Quando a possibilidade vem primeiro, procura-se um motivo pedagógico para utilizar um recurso. Quando o objetivo vem primeiro, o professor avalia se o recurso contribui, em que medida, com quais limites e sob quais condições.</p><p>A inovação não está em usar uma ferramenta recente. Está em construir uma experiência mais clara, significativa e responsável.</p></section>

        <section id="referencias"><h2>Referências de base</h2><ul className="article-references"><li><a href="https://books.google.com/books/about/Teaching_for_Quality_Learning_at_Univers.html?id=XhjRBrDAESkC" target="_blank" rel="noreferrer">Biggs e Tang — Teaching for Quality Learning at University <ExternalLink /></a><span>4ª edição, McGraw-Hill Education/Open University Press, 2011. Referência para alinhamento construtivo.</span></li><li><a href="https://publications.jrc.ec.europa.eu/repository/handle/JRC107466" target="_blank" rel="noreferrer">Comissão Europeia — DigCompEdu <ExternalLink /></a><span>Framework europeu para a competência digital de educadores, 2017.</span></li><li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noreferrer">UNESCO — Guidance for generative AI in education and research <ExternalLink /></a><span>Orientação para uso humano, ético, seguro e pedagogicamente adequado da IA generativa, 2023.</span></li></ul></section>

        <ArticleShare article={article} />
        <section className="article-cta"><h2>Seu planejamento parte da ferramenta ou da aprendizagem?</h2><p>Reconheça como você decide, planeja, avalia e conduz o uso de IA em sua prática.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PráxIA</ButtonLink></section>
        <FaqSection items={articleFaq} title="Perguntas frequentes" />
        <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div><Link to={firstArticlePath}>Usar IA com estudantes começa antes da ferramenta <ArrowRight /></Link><Link to="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia">Como conversar sobre autoria em atividades com IA <ArrowRight /></Link><Link to="/ferramentas">Critérios para escolher ferramentas digitais e de IA <ArrowRight /></Link><Link to="/competencias">As seis dimensões das competências docentes <ArrowRight /></Link></div></section>
      </ArticleLayout>
    </>
  )
}
