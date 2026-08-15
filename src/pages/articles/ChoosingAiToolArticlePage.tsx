import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica')
const articleFaq = article.faq ?? []
const toc = [
  { id: 'criterios', label: 'Dez critérios de escolha' },
  { id: 'matriz', label: 'Matriz de comparação' },
  { id: 'eliminatorios', label: 'Critérios eliminatórios' },
  { id: 'exemplo', label: 'Exemplo de escolha' },
  { id: 'roteiro', label: 'Roteiro em sete perguntas' },
  { id: 'referencias', label: 'Referências' },
]

const criteria = [
  ['Objetivo', 'Defina o que os estudantes precisam aprender, a tarefa, o apoio necessário, a responsabilidade humana e a evidência avaliada.'],
  ['Função necessária', 'Procure a função mínima — resumir, adaptar, transcrever, revisar, analisar — em vez de procurar “uma IA para educação”.'],
  ['Qualidade da resposta', 'Teste precisão, consistência, idioma, restrições, vieses, fontes e estabilidade em situações próximas da atividade real.'],
  ['Privacidade e dados', 'Verifique coleta, treinamento, armazenamento, exclusão, processamento, autorização institucional, idade mínima e cadastro.'],
  ['Idade e consentimento', 'Confirme termos de uso, autorizações e se os estudantes compreendem dados fornecidos, riscos e alternativas.'],
  ['Acesso e equidade', 'Teste nos dispositivos e na conexão da turma; confira limites, acessibilidade, português, cadastro e condições do plano gratuito.'],
  ['Custo real', 'Inclua dinheiro, aprendizagem, cadastro, revisão, suporte, dependência, alternativas e mudanças no plano gratuito.'],
  ['Controle e transparência', 'Prefira edição, exportação, histórico, fontes, configurações de privacidade, exclusão e controle de compartilhamento.'],
  ['Revisão humana', 'Avalie se professor e estudante podem revisar, identificar erros, contestar e reverter decisões, com supervisão proporcional ao impacto.'],
  ['Alternativa sem IA', 'Compare com fontes selecionadas, pares, modelos, cartões, planilhas e recursos institucionais para confirmar o valor acrescentado.'],
]

const matrixRows = [
  ['Alinhamento ao objetivo', 'A ferramenta apoia diretamente a aprendizagem pretendida?'],
  ['Qualidade da resposta', 'Os resultados são precisos, consistentes e revisáveis?'],
  ['Facilidade de uso', 'Professor e turma conseguem usar nas condições reais?'],
  ['Privacidade', 'Dados, contas, idade e termos são adequados?'],
  ['Acessibilidade', 'Todos conseguem participar sem barreiras?'],
  ['Custo', 'O custo financeiro e operacional é aceitável?'],
  ['Possibilidade de revisão', 'Há controle humano e possibilidade de contestação?'],
  ['Suporte institucional', 'O uso é autorizado e possui apoio quando necessário?'],
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['como escolher ferramenta de IA para professores', 'ferramentas de IA para educação', 'escolher IA para aula', 'segurança de ferramentas educacionais'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Ferramentas', item: 'https://www.radarpraxia.com/blog/categoria/ferramentas' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function ChoosingAiToolArticlePage() {
  return <>
    <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
    <ArticleLayout article={article} categoryPath="/blog/categoria/ferramentas" toc={toc}>
      <p className="article-lead">Listas de “melhores ferramentas de IA para professores” envelhecem rapidamente.</p>
      <p>Novas plataformas aparecem, recursos e planos mudam, e serviços deixam de existir. Por isso, é mais útil desenvolver critérios de escolha do que memorizar uma lista de aplicativos.</p>
      <p>A melhor ferramenta depende da tarefa, da turma, do contexto institucional e dos riscos envolvidos. Uma solução excelente para rascunhos pode ser inadequada para menores de idade; uma opção gratuita pode limitar funcionalidades essenciais.</p>

      <figure className="article-cover"><img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" /></figure>

      <section id="criterios">
        <h2>Escolher bem exige comparar mais do que recursos</h2>
        <p>A ferramenta deve entrar depois do objetivo de aprendizagem. Com o objetivo claro, muitas opções deixam de ser relevantes.</p>
        <div className="tool-selection-criteria">
          {criteria.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
        <aside className="article-callout"><ShieldCheck aria-hidden="true" /><p>Uma ferramenta confiável não é aquela que nunca erra. É aquela cujos erros podem ser identificados e administrados dentro do contexto de uso.</p></aside>
      </section>

      <section id="matriz">
        <h2>Uma matriz simples de comparação</h2>
        <p>Crie uma tabela com as ferramentas candidatas e atribua uma avaliação de 1 a 5. Não some os valores automaticamente: alguns critérios são eliminatórios.</p>
        <figure className="tool-comparison-matrix">
          <div className="tool-comparison-matrix__head"><strong>Critério</strong><strong>O que observar</strong><strong>A</strong><strong>B</strong><strong>C</strong></div>
          {matrixRows.map(([criterion, description], index) => <div className="tool-comparison-matrix__row" key={criterion}><strong>{criterion}{[3, 4, 6].includes(index) && <small> eliminatório</small>}</strong><span>{description}</span><i>1–5</i><i>1–5</i><i>1–5</i></div>)}
          <figcaption>Matriz para comparar ferramentas de inteligência artificial antes do uso em uma atividade pedagógica.</figcaption>
        </figure>
        <section className="article-cta article-cta--intermediate"><h2>Como você toma decisões sobre ferramentas?</h2><p>O Radar Docente ajuda a reconhecer seus critérios e as competências que podem fortalecer sua prática.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      </section>

      <section id="eliminatorios">
        <h2>Critérios eliminatórios</h2>
        <p>Considere não utilizar a ferramenta quando ela:</p>
        <ul className="article-checklist">{[
          'Exige dados pessoais desnecessários ou não possui política clara de privacidade.',
          'Não atende à idade dos estudantes ou não é autorizada pela instituição.',
          'Substitui a competência avaliada ou não permite revisão.',
          'Cria desigualdade sem alternativa equivalente.',
          'Apresenta erros frequentes em conteúdo crítico.',
          'Depende de pagamento individual obrigatório.',
        ].map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <blockquote className="article-quote">Nem toda limitação pode ser compensada por um bom recurso.</blockquote>
      </section>

      <section id="exemplo">
        <h2>Exemplo de escolha</h2>
        <div className="article-case">
          <p><strong>Objetivo</strong>Comparar explicações sobre um fenômeno científico e identificar erros.</p>
          <p><strong>Função necessária</strong>Gerar duas explicações diferentes, incluindo uma com falhas plausíveis.</p>
          <p><strong>Ferramenta A</strong>Boa qualidade, exige conta individual e possui política pouco clara para menores.</p>
          <p><strong>Ferramenta B</strong>Qualidade adequada, pode ser usada previamente pelo professor e não exige cadastro dos estudantes.</p>
          <p><strong>Ferramenta C</strong>Gratuita e acessível, mas produz respostas muito inconsistentes em português.</p>
          <p><strong>Decisão</strong>Usar a ferramenta B somente pelo professor, preparar os exemplos antes da aula e entregar o material à turma.</p>
        </div>
        <p>A melhor decisão não foi colocar todos os estudantes na plataforma. Foi utilizar a função necessária com menor exposição e maior controle.</p>
      </section>

      <section id="roteiro">
        <h2>Um roteiro de decisão em sete perguntas</h2>
        <ol className="tool-decision-questions">{['Qual objetivo será apoiado?', 'Qual função é realmente necessária?', 'A qualidade pode ser verificada?', 'Os dados estão protegidos?', 'Todos conseguem participar?', 'O custo total é aceitável?', 'Existe alternativa em caso de falha?'].map((question, index) => <li key={question}><span>0{index + 1}</span>{question}</li>)}</ol>
        <h2>A melhor ferramenta é contextual</h2>
        <p>Não existe uma plataforma universalmente melhor para professores. A escolha depende do objetivo, da turma, da instituição, do risco e da forma de uso.</p>
        <p>Em muitos casos, a melhor opção será utilizar a ferramenta apenas pelo professor. Em outros, estudantes podem interagir diretamente com orientações claras. Em algumas situações, a melhor decisão será não utilizar IA.</p>
        <blockquote className="article-quote">Competência não é saber qual ferramenta está em alta. É saber comparar, testar, limitar e justificar.</blockquote>
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
      <section className="article-cta"><h2>Você escolhe ferramentas pelo recurso mais chamativo ou por critérios?</h2><p>O Radar Docente da PraxIA ajuda a identificar como você toma decisões e quais competências podem fortalecer sua prática.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      <FaqSection items={articleFaq} title="Perguntas frequentes" />
      <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div>
        <Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia">O que são competências docentes para uso de IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia">Como avaliar atividades produzidas com apoio de IA <ArrowRight aria-hidden="true" /></Link>
      </div></section>
    </ArticleLayout>
  </>
}
