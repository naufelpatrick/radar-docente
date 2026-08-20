import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { OpaeraFramework } from '../../components/OpaeraFramework'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial')
const articleFaq = article.faq ?? []
const toc = [
  { id: 'evidencia', label: 'Comece pela evidência' },
  { id: 'responsabilidade', label: 'O que permanece humano' },
  { id: 'funcoes', label: 'Funções pedagógicas da IA' },
  { id: 'opaera', label: 'Roteiro OPAERA' },
  { id: 'exemplo', label: 'Exemplo completo' },
  { id: 'aplicacao', label: 'Aplicação e plano B' },
  { id: 'checklist', label: 'Checklist final' },
  { id: 'referencias', label: 'Referências' },
]

const evidenceExamples = ['uma justificativa', 'uma comparação entre alternativas', 'a revisão de uma resposta inadequada', 'uma decisão sustentada por critérios', 'a explicação de um conceito', 'um registro de processo', 'uma produção autoral', 'uma defesa oral', 'uma aplicação em novo contexto']
const humanQuestions = ['Que decisão o estudante precisa tomar?', 'Que conhecimento ele precisa mobilizar?', 'O que deverá explicar com suas próprias palavras?', 'Que parte precisa ser verificada?', 'Qual contribuição autoral será observada?', 'O que não pode ser terceirizado?']
const aiRoles = [
  ['Geradora de alternativas', 'Produz possibilidades que serão comparadas, combinadas ou rejeitadas.', 'Gerar três formas de explicar um conceito para públicos diferentes e avaliar qual preserva melhor a precisão.'],
  ['Objeto de análise crítica', 'A resposta da IA se torna material de estudo.', 'Localizar erros, omissões, estereótipos, falta de fontes ou simplificações em uma explicação.'],
  ['Simuladora de perspectivas', 'Representa posições ou cenários para apoiar discussão.', 'Simular objeções a uma proposta para que os estudantes preparem uma defesa fundamentada.'],
  ['Apoio ao rascunho', 'Ajuda a iniciar uma produção que será transformada pelo estudante.', 'Criar uma estrutura inicial revisada com base em dados, fontes e critérios da disciplina.'],
  ['Tutora limitada', 'Oferece perguntas, pistas ou feedback preliminar, com limites explícitos.', 'Fazer perguntas de recuperação sem revelar imediatamente a resposta.'],
  ['Ferramenta de adaptação', 'Ajuda o professor a produzir variações, sempre com revisão.', 'Criar versões de uma situação-problema com diferentes graus de complexidade.'],
]
const planningChecklist = ['o objetivo de aprendizagem está explícito', 'a evidência foi definida', 'o papel da IA está nomeado', 'a ação intelectual do estudante foi preservada', 'o uso da ferramenta é necessário', 'os riscos foram avaliados', 'as regras estão claras', 'existe alternativa de acesso', 'há um plano B', 'os critérios incluem processo e decisão', 'a declaração de uso está prevista', 'o professor testou a atividade', 'haverá revisão após a aplicação']

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['como planejar atividade com inteligência artificial', 'atividade pedagógica com IA', 'plano de aula com inteligência artificial', 'IA no planejamento docente', 'uso pedagógico de IA'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Planejamento', item: 'https://www.radarpraxia.com/blog/categoria/planejamento' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function PlanningAiActivityArticlePage() {
  return <>
    <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
    <ArticleLayout article={article} categoryPath="/blog/categoria/planejamento" toc={toc}>
      <p className="article-lead">Uma atividade com inteligência artificial não deve começar com a pergunta: “Qual ferramenta posso usar?”</p>
      <p>Ela deve começar com outra: <strong>“O que os estudantes precisam compreender, praticar ou decidir?”</strong></p>
      <p>Quando a ferramenta vem primeiro, a aula tende a se tornar uma demonstração de recursos. Quando o objetivo vem primeiro, a IA pode assumir uma função específica: gerar alternativas, apoiar investigação, simular perspectivas, oferecer um primeiro rascunho ou criar material para análise crítica.</p>
      <blockquote className="article-quote">O valor pedagógico não está na presença da IA. Está no que o estudante faz intelectualmente com ela.</blockquote>

      <figure className="article-cover"><img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" /></figure>

      <section id="evidencia">
        <h2>Comece pela evidência de aprendizagem</h2>
        <p>Antes de desenhar a atividade, imagine o que permitirá reconhecer que houve aprendizagem.</p>
        <ul className="article-checklist">{evidenceExamples.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <aside className="article-callout"><ShieldCheck aria-hidden="true" /><p>Se a única evidência for um texto final bem escrito, será difícil distinguir aprendizagem de acabamento automatizado.</p></aside>
      </section>

      <section id="responsabilidade">
        <h2>Defina o que precisa permanecer humano</h2>
        <p>Toda atividade com IA deve preservar uma zona clara de responsabilidade do estudante. Pergunte:</p>
        <div className="article-case">{humanQuestions.map((question) => <p key={question}><strong>Decisão pedagógica</strong>{question}</p>)}</div>
        <p>A IA pode apoiar o percurso, mas não deve eliminar justamente a ação cognitiva que a atividade pretende desenvolver.</p>
        <p>Se o objetivo é aprender a argumentar, pedir que a ferramenta produza a argumentação inteira reduz a oportunidade de aprendizagem. Uma alternativa melhor é solicitar três argumentos, compará-los, identificar fragilidades e reconstruir uma posição própria.</p>
      </section>

      <section id="funcoes">
        <h2>Escolha uma função pedagógica para a IA</h2>
        <p>Nomear a função evita o uso genérico. Uma atividade pode combinar funções, mas o professor deve conseguir explicar por que cada uma existe.</p>
        <div className="ai-role-grid">{aiRoles.map(([title, description, example], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p><small>Exemplo</small><p>{example}</p></article>)}</div>
      </section>

      <section id="opaera">
        <h2>Use o roteiro OPAERA</h2>
        <p>Um roteiro simples ajuda a transformar intenção em desenho pedagógico. Escreva o objetivo com verbo observável, explicite o papel da tecnologia e conecte ação, evidência, riscos e avaliação.</p>
        <OpaeraFramework />
        <section className="article-cta article-cta--intermediate"><h2>Como essas decisões aparecem na sua prática?</h2><p>O Radar Docente ajuda a reconhecer como planejamento, ética, crítica e avaliação se articulam no seu uso da IA.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      </section>

      <section id="exemplo">
        <h2>Exemplo completo: comparar explicações</h2>
        <div className="opaera-example">
          <article><span>O</span><div><h3>Objetivo</h3><p>Avaliar a qualidade de explicações sobre um conceito da disciplina utilizando critérios explícitos.</p></div></article>
          <article><span>P</span><div><h3>Papel da IA</h3><p>Gerar duas explicações: uma para público iniciante e outra para público especializado.</p></div></article>
          <article><span>A</span><div><h3>Ação do estudante</h3><p>Comparar clareza e precisão, verificar afirmações, localizar simplificações, reescrever e justificar alterações.</p></div></article>
          <article><span>E</span><div><h3>Evidência</h3><p>Tabela comparativa, versão revisada e justificativa de 200 palavras.</p></div></article>
          <article><span>R</span><div><h3>Riscos e regras</h3><p>Não inserir dados pessoais, não tratar referências inventadas como fontes e registrar o apoio utilizado.</p></div></article>
          <article><span>A</span><div><h3>Avaliação</h3><p>Precisão conceitual, qualidade da verificação, justificativa das decisões e adequação ao público.</p></div></article>
        </div>
        <blockquote className="article-quote">O valor da atividade não está na geração das respostas. Está na comparação, na verificação e na reconstrução.</blockquote>
      </section>

      <section id="aplicacao">
        <h2>Planeje também o plano B</h2>
        <p>Indisponibilidade, internet instável, limite de uso, bloqueio de conta, dificuldade de acesso e mudanças na interface podem interromper a ferramenta. O plano B deve preservar o objetivo pedagógico.</p>
        <p>Se a IA geraria explicações, o professor pode levar exemplos previamente produzidos. Se apoiaria uma simulação, a turma pode trabalhar com cartões de perspectivas. Uma atividade robusta não depende de uma única plataforma para existir.</p>

        <h2>Evite quatro erros comuns</h2>
        <div className="tool-selection-criteria">{[
          ['Produção sem decisão', 'Inclua comparação, critérios, transformação e justificativa.'],
          ['Avaliar apenas o resultado', 'Colete registros do processo e peça explicações.'],
          ['Exigir uma plataforma', 'Considere uso mediado, pequenos grupos e alternativa equivalente.'],
          ['Confundir novidade com adequação', 'Use IA somente quando houver ganho pedagógico claro.'],
        ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>

        <h2>Defina regras em linguagem compreensível</h2>
        <p>Regras vagas, como “use com responsabilidade”, não orientam decisões. Prefira instruções observáveis:</p>
        <div className="article-copy-box"><p>“Não envie nomes, fotos ou informações pessoais.”<br />“Registre duas mudanças feitas após conferir a resposta.”<br />“Inclua as fontes consultadas fora da ferramenta.”<br />“Este item será avaliado pela qualidade da justificativa, não pela extensão do texto.”</p></div>

        <h2>Inclua uma declaração de uso</h2>
        <div className="usage-declaration" aria-label="Modelo de declaração de uso de inteligência artificial">
          {['Ferramenta utilizada', 'Finalidade', 'Tipo de material enviado', 'Como a resposta foi verificada', 'O que foi mantido, alterado ou descartado', 'Qual foi minha principal decisão'].map((label) => <p key={label}><strong>{label}:</strong><span aria-hidden="true" /></p>)}
        </div>
        <p>O objetivo não é vigiar cada comando. É ajudar o estudante a reconhecer sua própria responsabilidade.</p>

        <h2>Teste antes e revise depois da aula</h2>
        <p>Simule a atividade como estudante. Observe tempo, respostas inadequadas, instruções ambíguas, dados solicitados, conhecimentos prévios, critérios e plano B. Depois da aplicação, registre dificuldades de acesso, erros recorrentes, qualidade das evidências e regras que precisam ser mais claras.</p>
      </section>

      <section id="checklist">
        <h2>Checklist final de planejamento</h2>
        <p>Antes de aplicar, confirme:</p>
        <ul className="article-checklist article-checklist--boxed">{planningChecklist.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <blockquote className="article-quote">Se você não consegue explicar o papel da IA em uma frase, o planejamento ainda precisa ser refinado.</blockquote>
      </section>

      <section id="referencias">
        <h2>Referências de base</h2>
        <ul className="article-references">
          <li><a href="https://joint-research-centre.ec.europa.eu/digcompedu_en" target="_blank" rel="noopener noreferrer">Comissão Europeia — DigCompEdu <ExternalLink aria-hidden="true" /></a><span>European Framework for the Digital Competence of Educators, 2017.</span></li>
          <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for Generative AI in Education and Research <ExternalLink aria-hidden="true" /></a><span>Orientações para adoção educacional segura e centrada nas pessoas, 2023.</span></li>
          <li><a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">UNESCO — AI Competency Framework for Teachers <ExternalLink aria-hidden="true" /></a><span>Competências para o uso responsável de IA por professores, 2024.</span></li>
        </ul>
      </section>

      <ArticleShare article={article} />
      <section className="article-cta"><h2>Ao planejar, você começa pela ferramenta ou pelo que o estudante precisa aprender?</h2><p>O Radar Docente da PraxIA ajuda a identificar como suas decisões de planejamento, ética, crítica e avaliação se articulam no uso da inteligência artificial.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      <FaqSection items={articleFaq} title="Perguntas frequentes" />
      <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div>
        <Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica">Como escolher uma ferramenta de IA para uma atividade pedagógica <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/avaliacao/como-criar-criterios-de-avaliacao-para-atividades-com-ia">Como criar uma rubrica de avaliação para atividades com IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia">Como avaliar atividades produzidas com apoio de IA <ArrowRight aria-hidden="true" /></Link>
      </div></section>
    </ArticleLayout>
  </>
}
