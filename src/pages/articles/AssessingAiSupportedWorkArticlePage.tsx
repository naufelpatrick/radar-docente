import { useState } from 'react'
import { ArrowRight, Check, CheckCircle2, Clipboard, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('como-avaliar-atividades-produzidas-com-apoio-de-ia')

const toc = [
  { id: 'competencia', label: 'Comece pela competência' },
  { id: 'evidencias', label: 'Produto e evidência' },
  { id: 'decisoes', label: 'Avalie decisões' },
  { id: 'declaracao', label: 'Declaração de uso' },
  { id: 'rubrica', label: 'Rubrica em seis critérios' },
  { id: 'explicacao', label: 'Explicação e versões' },
  { id: 'verificacao', label: 'Verificação e detectores' },
  { id: 'redesenho', label: 'Redesenhe a avaliação' },
  { id: 'exemplo', label: 'Exemplo aplicado' },
  { id: 'referencias', label: 'Referências' },
]

const declarationTemplate = 'Utilizei [ferramenta] para [finalidade]. Aproveitei [contribuições], modifiquei [elementos] e rejeitei [sugestões]. Verifiquei o conteúdo por meio de [fontes ou procedimento].'

const articleFaq = article.faq ?? []

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      ...createBlogPostingSchema(article),
      keywords: ['como avaliar atividades com IA', 'avaliação e inteligência artificial', 'avaliar trabalhos com IA', 'autoria estudantil', 'evidências de aprendizagem'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Avaliação', item: 'https://www.radarpraxia.com/blog/categoria/avaliacao' },
        { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: articleFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

function DeclarationCopyBox() {
  const [copied, setCopied] = useState(false)

  async function copyTemplate() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(declarationTemplate)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = declarationTemplate
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="article-copy-box">
      <p>{declarationTemplate}</p>
      <button type="button" onClick={copyTemplate} aria-label="Copiar modelo de declaração de uso de inteligência artificial">
        {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
        {copied ? 'Modelo copiado!' : 'Copiar modelo'}
      </button>
    </div>
  )
}

export function AssessingAiSupportedWorkArticlePage() {
  return (
    <>
      <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
      <ArticleLayout article={article} categoryPath="/blog/categoria/avaliacao" toc={toc}>
        <p className="article-lead">Quando a IA participa da produção, a entrega final pode não revelar o que o estudante realmente compreendeu.</p>
        <p>Avaliar bem exige observar decisões, justificativas, versões, verificações e capacidade de explicar — sem transformar a sala de aula em um ambiente de vigilância.</p>

        <figure className="article-cover">
          <img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" />
        </figure>

        <section id="competencia">
          <h2>Comece pela competência avaliada</h2>
          <p>A inteligência artificial tornou mais fácil produzir textos bem estruturados, imagens, códigos, apresentações e respostas aparentemente completas. Isso expõe uma limitação das avaliações baseadas apenas no produto final.</p>
          <p>Antes de definir regras de uso, identifique o conhecimento ou a competência que a atividade pretende avaliar:</p>
          <div className="article-decisions">
            <article><span>01</span><h3>Argumentação</h3><p>O estudante precisa formular posição, selecionar evidências e justificar relações.</p></article>
            <article><span>02</span><h3>Escrita</h3><p>Decisões de estrutura, linguagem, revisão e adequação precisam permanecer visíveis.</p></article>
            <article><span>03</span><h3>Resolução de problemas</h3><p>Importa observar decomposição, estratégia, teste, correção e transferência.</p></article>
            <article><span>04</span><h3>Pesquisa</h3><p>Avalie seleção de fontes, critérios de confiabilidade, comparação e construção da conclusão.</p></article>
          </div>
          <aside className="article-callout"><ShieldCheck aria-hidden="true" /><p>A IA pode apoiar diferentes etapas, mas não deve substituir o núcleo da competência que está sendo avaliada.</p></aside>
        </section>

        <section id="evidencias">
          <h2>Diferencie produto e evidência</h2>
          <p>O produto é aquilo que o estudante entrega. A evidência é o que permite ao professor inferir aprendizagem.</p>
          <div className="article-case">
            <p><strong>Relatório</strong>É produto. A justificativa das escolhas pode ser evidência.</p>
            <p><strong>Apresentação</strong>É produto. Responder perguntas e aplicar conceitos pode ser evidência.</p>
            <p><strong>Código funcionando</strong>É produto. Explicar a lógica e corrigir um erro podem ser evidências.</p>
            <p><strong>Texto bem acabado</strong>É produto. Comparar versões e justificar mudanças pode ser evidência.</p>
          </div>
          <p>Um produto sofisticado pode ter sido gerado com pouca compreensão. Um produto simples pode representar um processo intelectualmente rico.</p>
          <h3>Inclua evidências de processo</h3>
          <div className="article-tags">
            {['Hipótese inicial', 'Mapa de ideias', 'Fontes selecionadas', 'Comparação de versões', 'Resposta rejeitada', 'Correção explicada', 'Justificativa', 'Declaração de uso', 'Reflexão final', 'Defesa oral'].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p>Não é necessário solicitar tudo. Duas boas evidências alinhadas ao objetivo são mais úteis do que um histórico extenso de interações.</p>
        </section>

        <section id="decisoes">
          <h2>Avalie decisões, não a quantidade de prompts</h2>
          <p>A quantidade de comandos enviados não demonstra autoria ou aprendizagem. Um estudante pode realizar muitas interações superficiais; outro pode fazer poucas perguntas, avaliar criticamente as respostas e tomar decisões consistentes.</p>
          <ul className="article-checklist">
            {[
              'Qualidade da pergunta formulada.',
              'Capacidade de reconhecer limitações.',
              'Seleção de sugestões relevantes.',
              'Rejeição de respostas inadequadas.',
              'Verificação de informações.',
              'Transformação do material gerado.',
              'Coerência entre objetivo e versão final.',
            ].map((criterion) => <li key={criterion}><CheckCircle2 aria-hidden="true" /><span>{criterion}</span></li>)}
          </ul>
        </section>

        <section id="declaracao">
          <h2>Peça uma declaração de uso proporcional</h2>
          <p>Uma declaração ajuda a compreender como a ferramenta participou. Ela não substitui a avaliação, mas oferece contexto sem exigir o registro de cada interação.</p>
          <DeclarationCopyBox />
          <p>Em atividades mais complexas, acrescente etapa de uso, contribuição aproveitada, alteração realizada, informação verificada e decisão autoral central.</p>
        </section>

        <section id="rubrica">
          <h2>Use uma rubrica que inclua processo</h2>
          <p>A ponderação deve variar conforme a atividade. Em escrita, autoria e linguagem podem receber maior peso; em análise de dados, interpretação e verificação podem ser prioritárias.</p>
          <figure className="assessment-rubric-map" aria-labelledby="rubric-map-caption">
            {['Compreensão', 'Decisões', 'Uso crítico', 'Verificação', 'Autoria', 'Reflexão'].map((criterion, index) => <div key={criterion}><span>0{index + 1}</span><strong>{criterion}</strong></div>)}
            <figcaption id="rubric-map-caption">Seis critérios para avaliar atividades produzidas com apoio de inteligência artificial.</figcaption>
          </figure>

          <div className="article-table-scroll" role="region" aria-label="Rubrica resumida para atividades com apoio de IA" tabIndex={0}>
            <table className="article-rubric-table">
              <thead><tr><th>Critério</th><th>Excelente</th><th>Adequado</th><th>Inicial</th></tr></thead>
              <tbody>
                <tr><th>Compreensão</th><td>Aplica conceitos com precisão e profundidade.</td><td>Aplica conceitos corretamente, com pequenas limitações.</td><td>Apresenta compreensão parcial ou superficial.</td></tr>
                <tr><th>Decisões e justificativas</th><td>Escolhas claras, coerentes e sustentadas por evidências.</td><td>Escolhas pertinentes, com justificativas incompletas.</td><td>Escolhas pouco claras ou sem justificativa.</td></tr>
                <tr><th>Uso crítico da IA</th><td>Avalia, modifica e rejeita sugestões com critérios.</td><td>Realiza revisão, mas explicita pouco o processo.</td><td>Aceita respostas sem análise suficiente.</td></tr>
                <tr><th>Verificação</th><td>Confirma informações em fontes confiáveis e registra correções.</td><td>Verifica parcialmente as informações.</td><td>Utiliza informações sem conferência.</td></tr>
                <tr><th>Autoria e transparência</th><td>Descreve com clareza a contribuição da IA e as decisões humanas.</td><td>Apresenta declaração suficiente, porém genérica.</td><td>Omite contribuição relevante ou não explica o processo.</td></tr>
              </tbody>
            </table>
          </div>

          <section className="article-cta article-cta--intermediate">
            <h2>Como avaliação e autoria aparecem na sua prática?</h2>
            <p>O Radar Docente ajuda a reconhecer critérios já consolidados e oportunidades de desenvolvimento.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Fazer meu Radar Docente</ButtonLink>
          </section>
        </section>

        <section id="explicacao">
          <h2>Inclua momentos de explicação</h2>
          <p>A capacidade de explicar é uma evidência poderosa. Uma defesa oral de dois minutos, uma pergunta inesperada, a correção de um trecho ou a aplicação a um novo caso podem revelar compreensão sem exigir uma investigação técnica.</p>
          <p>Esses momentos podem ocorrer por amostragem, em apresentações, conversas individuais ou pequenos grupos. A intenção não é surpreender o estudante, mas verificar se ele compreende o que apresenta.</p>

          <h2>Compare versões</h2>
          <div className="article-progression">
            <p><strong>Produção inicial</strong><br />Hipótese, estratégia ou primeira versão do estudante.</p>
            <ArrowRight aria-hidden="true" />
            <p><strong>Interação orientada</strong><br />Consulta à IA com objetivo e critérios explícitos.</p>
            <ArrowRight aria-hidden="true" />
            <p><strong>Revisão explicada</strong><br />Mudanças, rejeições, correções e justificativas.</p>
          </div>
        </section>

        <section id="verificacao">
          <h2>Avalie a capacidade de verificar</h2>
          <p>Ferramentas podem inventar informações e referências. Quando a atividade envolve afirmações factuais, ensine o estudante a identificar o que precisa ser confirmado, localizar fontes independentes, comparar informações, registrar divergências e corrigir erros.</p>
          <p>Não basta orientar “confira tudo”. É necessário ensinar procedimentos de verificação.</p>

          <h2>Evite depender de detectores</h2>
          <p>Detectores podem apresentar resultados imprecisos e falsos positivos. Também não respondem à pergunta pedagógica central: o estudante aprendeu?</p>
          <aside className="article-callout article-callout--attention"><ShieldCheck aria-hidden="true" /><p>Uma classificação automática não revela se houve uso permitido, colaboração, revisão, compreensão ou fraude. Detectores não devem funcionar como prova isolada.</p></aside>
        </section>

        <section id="redesenho">
          <h2>Ajuste a avaliação antes de aumentar a vigilância</h2>
          <p>Quando uma atividade pode ser inteiramente resolvida por uma ferramenta, talvez o problema não esteja apenas no comportamento do estudante. Pode estar no desenho da avaliação.</p>
          <ul className="article-checklist">
            {['A tarefa exige aplicação a um contexto específico?', 'Solicita justificativas?', 'Valoriza o processo?', 'Inclui comparação ou reflexão?', 'Permite observar decisões?', 'Exige conexão com experiências da disciplina?'].map((question) => <li key={question}><CheckCircle2 aria-hidden="true" /><span>{question}</span></li>)}
          </ul>

          <h3>Crie critérios claros antes da entrega</h3>
          <p>Os estudantes precisam saber quais usos são permitidos, declarados ou proibidos; quais competências serão avaliadas; que evidências devem ser entregues e como a transparência será considerada.</p>
          <figure className="assessment-flow" aria-labelledby="assessment-flow-caption">
            {['Objetivo', 'Regras de uso', 'Evidências', 'Rubrica', 'Explicação', 'Feedback'].map((item, index, items) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < items.length - 1 && <ArrowRight aria-hidden="true" />}</div>)}
            <figcaption id="assessment-flow-caption">Etapas para planejar a avaliação de uma atividade com apoio de inteligência artificial.</figcaption>
          </figure>
        </section>

        <section id="exemplo">
          <h2>Exemplo de redesenho</h2>
          <div className="article-case">
            <p><strong>Versão inicial</strong>“Escreva um texto de duas páginas sobre impactos da urbanização.” Uma ferramenta pode produzir a resposta completa, deixando poucas evidências sobre pesquisa, interpretação e autoria.</p>
            <p><strong>Versão redesenhada</strong>Observe uma transformação urbana da sua cidade, registre uma hipótese, consulte duas fontes locais, use IA para gerar uma explicação alternativa, compare perspectivas e explique uma correção.</p>
          </div>
          <p>A entrega inclui hipótese inicial, quadro de comparação, análise final e declaração de uso. Os critérios observam compreensão, fontes, comparação, correção, justificativa e transparência.</p>
          <blockquote className="article-quote">Avaliar aprendizagem significa tornar visíveis compreensão, decisão, verificação, autoria e reflexão — não apenas premiar a aparência do produto.</blockquote>
        </section>

        <section id="referencias">
          <h2>Referências de base</h2>
          <ul className="article-references">
            <li><strong>Biggs, John; Tang, Catherine — Teaching for Quality Learning at University</strong><span>4ª edição. Open University Press, 2011.</span></li>
            <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for Generative AI in Education and Research <ExternalLink aria-hidden="true" /></a><span>Orientações para uso educacional responsável e centrado nas pessoas.</span></li>
            <li><a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">UNESCO — AI Competency Framework for Teachers <ExternalLink aria-hidden="true" /></a><span>Competências docentes para avaliar, orientar e integrar IA com responsabilidade.</span></li>
          </ul>
        </section>

        <ArticleShare article={article} />

        <section className="article-cta">
          <h2>Sua avaliação torna visíveis as decisões dos estudantes?</h2>
          <p>O Radar Docente da PráxIA ajuda a identificar forças e oportunidades em planejamento, avaliação, ética e uso crítico da tecnologia.</p>
          <ButtonLink href="/radar" variant="light" showArrow>Fazer meu Radar Docente</ButtonLink>
        </section>

        <FaqSection items={articleFaq} title="Perguntas frequentes" />

        <section className="article-related">
          <p className="method-kicker">CONTINUE A LEITURA</p>
          <h2>Conteúdos relacionados</h2>
          <div>
            <Link to="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia">Como conversar sobre autoria em atividades com IA <ArrowRight aria-hidden="true" /></Link>
            <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
            <Link to="/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia">O que são competências docentes para uso de IA <ArrowRight aria-hidden="true" /></Link>
            <Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight aria-hidden="true" /></Link>
            <Link to="/ferramentas">Como escolher uma ferramenta para uma atividade pedagógica <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </ArticleLayout>
    </>
  )
}
