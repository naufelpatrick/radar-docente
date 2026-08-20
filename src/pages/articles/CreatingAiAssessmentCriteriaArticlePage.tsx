import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('como-criar-criterios-de-avaliacao-para-atividades-com-ia')
const articleFaq = article.faq ?? []
const toc = [
  { id: 'processo', label: 'Avaliar o processo' },
  { id: 'dimensoes', label: 'Quatro dimensões' },
  { id: 'rubrica', label: 'Como ampliar a rubrica' },
  { id: 'fiscalizacao', label: 'Evitar a fiscalização' },
  { id: 'quando-permitir', label: 'Quando permitir IA' },
  { id: 'desenho-pedagogico', label: 'Desenho pedagógico' },
  { id: 'referencias', label: 'Referências' },
]
const dimensions = [
  ['Compreensão', 'O estudante explica conceitos com suas próprias palavras, responde perguntas e justifica escolhas.'],
  ['Processo', 'O estudante explica recursos, perguntas, respostas inadequadas, modificações e fontes consultadas.'],
  ['Pensamento crítico', 'O estudante identifica limitações, inconsistências ou erros, compara informações e questiona premissas.'],
  ['Autoria e decisão', 'O trabalho torna visíveis decisões próprias, escolhas justificadas e responsabilidade intelectual.'],
]
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['critérios de avaliação com IA', 'rubrica para atividades com IA', 'inteligência artificial na educação', 'autoria estudantil', 'rubrica de avaliação'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 2, name: 'Avaliação', item: 'https://www.radarpraxia.com/blog/categoria/avaliacao' },
      { '@type': 'ListItem', position: 3, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function CreatingAiAssessmentCriteriaArticlePage() {
  return <>
    <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
    <ArticleLayout article={article} categoryPath="/blog/categoria/avaliacao" toc={toc}>
      <p className="article-lead"><Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Planejar uma atividade com inteligência artificial</Link> é apenas parte do desafio. O problema seguinte costuma ser mais difícil: como avaliar o que o estudante produziu quando uma ferramenta de IA participou do processo?</p>
      <p>Durante muito tempo, boa parte da avaliação acadêmica esteve concentrada no produto final. Um texto, uma apresentação, um relatório ou uma solução eram utilizados como evidências da aprendizagem.</p>
      <p>A IA generativa torna essa relação menos direta.</p>
      <p>Um texto formalmente excelente já não significa necessariamente que o estudante compreendeu profundamente o assunto. Da mesma forma, proibir qualquer utilização de IA não garante autoria, aprendizagem ou pensamento crítico.</p>
      <p>O desafio passa a ser outro: avaliar o raciocínio, as decisões e a capacidade do estudante de <Link to="/fluencia-digital-para-professores">utilizar recursos digitais de maneira consciente</Link>.</p>
      <figure className="article-cover"><img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" /></figure>

      <section id="processo">
        <h2>Avaliar o processo, não apenas o produto</h2>
        <p>Quando uma atividade permite o uso de inteligência artificial, parte da avaliação pode considerar como o estudante chegou ao resultado.</p>
        <p>Isso significa observar elementos como compreensão do problema, escolhas realizadas, fontes consultadas, capacidade de verificar informações, justificativas, revisões realizadas, decisões sobre aceitar ou rejeitar sugestões da IA e qualidade da solução final.</p>
        <p>A produção continua importante, mas deixa de ser a única evidência disponível.</p>
        <p>Um estudante que utiliza uma ferramenta generativa, identifica erros na resposta, consulta outras fontes e reconstrói a solução demonstra competências muito diferentes daquele que simplesmente copia a primeira resposta recebida.</p>
        <p>Por isso, avaliar apenas o resultado pode esconder justamente a aprendizagem que mais interessa.</p>
      </section>

      <section id="dimensoes">
        <h2>Quatro dimensões que podem orientar a avaliação</h2>
        <p>Uma maneira simples de estruturar critérios consiste em separar a avaliação em quatro dimensões.</p>
        <div className="article-decisions">{dimensions.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <p>A compreensão continua sendo central, independentemente das ferramentas utilizadas. O foco no processo não serve para vigiar, mas para tornar a aprendizagem mais visível.</p>
        <p>A capacidade de contestar a resposta da ferramenta é, muitas vezes, mais importante do que a capacidade de produzir um prompt elaborado.</p>
        <p>Nesse contexto, autoria não significa necessariamente produzir tudo sem auxílio. Significa assumir responsabilidade pelas decisões presentes no trabalho.</p>
        <section className="article-cta article-cta--intermediate"><h2>Como esses critérios aparecem na sua prática?</h2><p>O Radar Docente ajuda a reconhecer forças e próximos passos em avaliação, autoria e uso crítico da tecnologia.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      </section>

      <section id="rubrica">
        <h2>A rubrica pode mudar</h2>
        <p>Uma rubrica tradicional poderia avaliar domínio do conteúdo, organização, clareza, correção e apresentação. Em uma atividade que envolve IA, alguns critérios podem ser ampliados.</p>
        <div className="article-table-scroll" role="region" aria-label="Exemplos de critérios para uma rubrica de atividade com IA" tabIndex={0}>
          <table className="article-rubric-table"><thead><tr><th>Critério</th><th>O que observar</th></tr></thead><tbody>
            <tr><th>Domínio conceitual</th><td>O estudante demonstra compreensão consistente dos conceitos utilizados.</td></tr>
            <tr><th>Qualidade da argumentação</th><td>As conclusões são sustentadas por evidências, referências ou raciocínio adequado.</td></tr>
            <tr><th>Uso crítico da tecnologia</th><td>As contribuições da IA foram verificadas, questionadas e modificadas quando necessário.</td></tr>
            <tr><th>Transparência do processo</th><td>O estudante consegue explicar como utilizou recursos digitais durante a atividade.</td></tr>
            <tr><th>Autoria e tomada de decisão</th><td>O trabalho apresenta escolhas justificadas e contribuição própria.</td></tr>
          </tbody></table>
        </div>
        <aside className="article-callout"><CheckCircle2 aria-hidden="true" /><p>O objetivo não é criar um “critério de IA”. A tecnologia passa a fazer parte de critérios educacionais mais amplos.</p></aside>
      </section>

      <section id="fiscalizacao">
        <h2>Evite transformar a avaliação em fiscalização</h2>
        <p>Existe um risco importante nesse processo: construir sistemas de avaliação baseados na desconfiança.</p>
        <p>Perguntas como “foi você ou foi a IA?” tendem a produzir pouco valor pedagógico. Além da dificuldade de determinar com segurança a origem de um texto, essa abordagem desloca a conversa da aprendizagem para a investigação.</p>
        <p>Uma alternativa mais produtiva é solicitar evidências de compreensão, como apresentação oral breve, defesa das escolhas, comentário reflexivo, comparação entre versões, registro das decisões tomadas ou aplicação do conteúdo em novo contexto.</p>
        <p>Quando o estudante precisa explicar o raciocínio que sustenta sua produção, a compreensão torna-se mais observável.</p>
      </section>

      <section id="quando-permitir">
        <h2>Nem toda atividade precisa permitir IA</h2>
        <p>Integrar inteligência artificial à avaliação não significa permitir seu uso em todas as situações. Existem momentos em que o professor pode querer observar uma competência específica sem determinados tipos de apoio. Isso pode ser perfeitamente legítimo.</p>
        <p>O importante é que essa escolha esteja relacionada ao objetivo de aprendizagem.</p>
        <p>Se o objetivo é verificar escrita espontânea, determinada atividade pode restringir ferramentas generativas. Se o objetivo é analisar, sintetizar, revisar ou resolver um problema complexo, permitir IA e avaliar criticamente seu uso pode ser mais coerente.</p>
        <blockquote className="article-quote">A pergunta não deveria ser apenas “Posso permitir IA nesta atividade?”. Talvez seja mais útil perguntar: “Que evidência de aprendizagem eu preciso observar?”</blockquote>
        <p>A resposta ajuda a definir tanto as ferramentas permitidas quanto os critérios de avaliação.</p>
      </section>

      <section id="desenho-pedagogico">
        <h2>Avaliação em tempos de IA exige desenho pedagógico</h2>
        <p>A chegada das ferramentas generativas não elimina a avaliação. Ela evidencia fragilidades que já existiam.</p>
        <p>Quando uma atividade pode ser resolvida integralmente por uma ferramenta sem que o estudante precise compreender o conteúdo, talvez o problema não esteja apenas na tecnologia. Talvez esteja também no desenho da própria atividade.</p>
        <p>Avaliações mais autênticas, contextualizadas e orientadas à tomada de decisão tendem a exigir do estudante algo que não pode ser simplesmente delegado: compreender, interpretar, escolher e justificar.</p>
        <p>E são justamente essas capacidades que passam a ganhar ainda mais importância em um ambiente educacional atravessado pela inteligência artificial.</p>
      </section>

      <section id="referencias"><h2>Referências</h2><ul className="article-references">
        <li><a href="https://unesdoc.unesco.org/ark:/48223/pf0000386693" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for generative AI in education and research <ExternalLink aria-hidden="true" /></a><span>UNESCO, 2023.</span></li>
        <li><strong>Boud, D.; Falchikov, N. — Rethinking assessment in higher education</strong><span>Routledge, 2007.</span></li>
        <li><strong>Wiggins, G. — Educative assessment</strong><span>Jossey-Bass, 1998.</span></li>
        <li><a href="https://op.europa.eu/en/publication-detail/-/publication/d81a0d54-5348-11ed-92ed-01aa75ed71a1/language-en" target="_blank" rel="noopener noreferrer">European Commission — Ethical guidelines on the use of AI and data in teaching and learning <ExternalLink aria-hidden="true" /></a><span>Publications Office of the European Union, 2022.</span></li>
      </ul></section>

      <ArticleShare article={article} />
      <section className="article-cta"><h2>Que evidência de aprendizagem você precisa observar?</h2><p>Use o Radar Docente para reconhecer seus critérios e escolher um próximo passo possível.</p><ButtonLink href="/radar" variant="light" showArrow>Fazer meu Radar Docente</ButtonLink></section>
      <FaqSection items={articleFaq} title="Perguntas frequentes" />
      <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div>
        <Link to="/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia">Como avaliar atividades produzidas com apoio de IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia">Como conversar sobre autoria em atividades com IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial">Como planejar uma atividade pedagógica com inteligência artificial <ArrowRight aria-hidden="true" /></Link>
      </div></section>
    </ArticleLayout>
  </>
}
