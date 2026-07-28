import { ArrowRight, CheckCircle2, ExternalLink, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'

const path = '/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta'
const title = 'Usar IA com estudantes começa antes da ferramenta'
const description = 'Um roteiro pedagógico para definir objetivo, dados, transparência, autoria e revisão antes de escolher uma ferramenta de inteligência artificial.'
const toc = [
  { id: 'antes-da-ferramenta', label: 'O que vem antes da ferramenta' },
  { id: 'cinco-decisoes', label: 'Cinco decisões pedagógicas' },
  { id: 'roteiro', label: 'Roteiro para planejar' },
  { id: 'exemplo', label: 'Exemplo aplicado' },
  { id: 'limites', label: 'Limites e cuidados' },
  { id: 'referencias', label: 'Referências' },
]
const articleFaq = [
  { question: 'Preciso proibir IA quando não conheço bem a ferramenta?', answer: 'Não existe uma resposta única. Primeiro identifique objetivo, riscos, regras institucionais e condições de supervisão. Quando esses critérios não puderem ser atendidos, adiar o uso pode ser a decisão mais responsável.' },
  { question: 'Estudantes devem informar quando utilizaram IA?', answer: 'A transparência deve fazer parte do desenho da atividade. O professor pode combinar como registrar participação da IA, quais decisões permanecem autorais e que evidências do processo precisam ser apresentadas.' },
  { question: 'Posso inserir trabalhos de estudantes em uma IA?', answer: 'Não faça isso automaticamente. Verifique dados pessoais, termos da ferramenta, regras institucionais e necessidade real. Prefira minimizar ou remover informações identificáveis e nunca compartilhe dados além do necessário.' },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: title,
      description,
      datePublished: '2026-07-28',
      dateModified: '2026-07-28',
      inLanguage: 'pt-BR',
      mainEntityOfPage: `https://radar-docente-pi.vercel.app${path}`,
      author: { '@type': 'Person', name: 'Patrick Naufel', url: 'http://lattes.cnpq.br/0026328778886854' },
      publisher: { '@type': 'Organization', name: 'PráxIA', url: 'https://radar-docente-pi.vercel.app/' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://radar-docente-pi.vercel.app/blog' },
        { '@type': 'ListItem', position: 3, name: 'IA para Professores', item: 'https://radar-docente-pi.vercel.app/blog/ia-para-professores' },
        { '@type': 'ListItem', position: 4, name: title, item: `https://radar-docente-pi.vercel.app${path}` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    },
  ],
}

export function AiBeforeToolArticlePage() {
  return (
    <>
      <Seo title={`${title} | Blog PráxIA`} description={description} path={path} type="article" jsonLd={schema} />
      <ArticleLayout category="IA PARA PROFESSORES" categoryPath="/blog/categoria/ia-para-professores" title={title} description={description} date="28 de julho de 2026" readingTime="7 min de leitura" author="Patrick Naufel" toc={toc}>
        <p className="article-lead">Quando uma ferramenta de IA entra primeiro na conversa, o planejamento tende a começar pela pergunta “o que ela faz?”. Para a docência, uma pergunta mais útil é: <strong>que aprendizagem quero apoiar e por que a IA seria adequada neste contexto?</strong></p>
        <p>Essa mudança de ordem não é detalhe. Ela preserva a autoria do professor, torna os critérios visíveis e permite decidir inclusive quando não usar IA.</p>

        <section id="antes-da-ferramenta">
          <h2>O que vem antes da ferramenta</h2>
          <p>A orientação da UNESCO para IA generativa em educação propõe uma abordagem centrada nas pessoas, atenta à privacidade, à adequação etária e à validação ética e pedagógica. O framework de competências para professores da mesma organização também situa agência humana, ética e pedagogia como dimensões inseparáveis do uso técnico.</p>
          <p>Na prática, isso significa que conhecer comandos não basta. Antes de abrir uma plataforma, o professor precisa definir o papel da IA na atividade, o que os estudantes continuarão decidindo e como o processo poderá ser revisado.</p>
          <aside className="article-callout"><Lightbulb aria-hidden="true" /><p><strong>Uma boa decisão pode ser não usar IA.</strong> Se o recurso não amplia a aprendizagem, não há obrigação pedagógica de incluí-lo.</p></aside>
        </section>

        <section id="cinco-decisoes">
          <h2>Cinco decisões pedagógicas antes do uso</h2>
          <div className="article-decisions">
            <article><span>01</span><h3>Objetivo</h3><p>Que compreensão, habilidade ou produção deve avançar? A IA ajuda a investigar, comparar, revisar ou criar — ou apenas acelera uma tarefa?</p></article>
            <article><span>02</span><h3>Participação</h3><p>Quais decisões permanecem com o estudante? Onde haverá explicação, justificativa e autoria visível?</p></article>
            <article><span>03</span><h3>Dados</h3><p>Que informações seriam inseridas? Há nomes, imagens, produções identificáveis ou dados que não deveriam sair do ambiente institucional?</p></article>
            <article><span>04</span><h3>Transparência</h3><p>Como o uso será comunicado? O que precisa ser registrado sobre prompts, respostas, alterações e fontes?</p></article>
            <article><span>05</span><h3>Revisão</h3><p>Quem verificará erros, vieses, inadequações e referências? Qual evidência mostrará que houve análise humana?</p></article>
          </div>
        </section>

        <section id="roteiro">
          <h2>Um roteiro de planejamento em seis perguntas</h2>
          <ol className="article-checklist">
            <li><CheckCircle2 aria-hidden="true" /><span><strong>O que os estudantes devem aprender?</strong> Escreva o objetivo sem mencionar a ferramenta.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Qual é a contribuição específica da IA?</strong> Descreva o ganho esperado e uma alternativa sem IA.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Quais dados serão usados?</strong> Remova o que for desnecessário e verifique regras institucionais.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Como a participação será explicada?</strong> Combine limites, forma de registro e responsabilidade.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Que evidência do processo será observada?</strong> Peça versões, justificativas, comparação ou reflexão.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Como haverá revisão?</strong> Preveja checagem de fatos, fontes, linguagem, vieses e adequação.</span></li>
          </ol>
        </section>

        <section id="exemplo">
          <h2>Exemplo: revisar argumentos, não terceirizar a escrita</h2>
          <p>Imagine uma atividade em que estudantes precisam revisar a argumentação de um texto. A IA pode gerar objeções ou apontar trechos pouco claros. O objetivo, porém, não é “usar um chatbot”: é desenvolver capacidade de avaliar argumentos e tomar decisões de revisão.</p>
          <div className="article-example">
            <div><span>ANTES</span><p>Definir critérios de argumentação, selecionar um texto sem dados pessoais e combinar como o uso será registrado.</p></div>
            <ArrowRight aria-hidden="true" />
            <div><span>DURANTE</span><p>Comparar sugestões da IA com os critérios, rejeitar inadequações e justificar cada alteração realizada.</p></div>
            <ArrowRight aria-hidden="true" />
            <div><span>DEPOIS</span><p>Entregar versões e uma nota reflexiva: o que foi aceito, rejeitado e aprendido no processo?</p></div>
          </div>
        </section>

        <section id="limites">
          <h2>Limites e cuidados que não podem ficar implícitos</h2>
          <p>A IA generativa pode produzir informações incorretas, referências inexistentes, simplificações e padrões enviesados. Supervisão humana não é uma etapa opcional adicionada no final; ela precisa participar do desenho da atividade.</p>
          <p>Privacidade também exige minimização: não inserir dados apenas porque a ferramenta aceita. A ANPD destaca transparência, boa-fé e proteção das expectativas dos titulares no tratamento de dados para fins acadêmicos. Regras institucionais e a legislação aplicável devem orientar cada contexto.</p>
          <aside className="article-callout article-callout--attention"><ShieldCheck aria-hidden="true" /><p>Não envie nomes, contatos, imagens identificáveis, avaliações ou produções de estudantes a plataformas externas sem base, necessidade e proteção adequadas.</p></aside>
        </section>

        <section id="referencias">
          <h2>Referências consultadas</h2>
          <ul className="article-references">
            <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noreferrer">UNESCO — Guidance for generative AI in education and research <ExternalLink aria-hidden="true" /></a><span>Abordagem centrada nas pessoas, privacidade e validação pedagógica.</span></li>
            <li><a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noreferrer">UNESCO — AI competency framework for teachers <ExternalLink aria-hidden="true" /></a><span>Agência humana, ética, fundamentos, pedagogia e desenvolvimento profissional.</span></li>
            <li><a href="https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-tratamento-de-dados-pessoais-para-fins-academicos-e-para-a-realizacao-de-estudos-e-pesquisas" target="_blank" rel="noreferrer">ANPD — Tratamento de dados pessoais para fins acadêmicos <ExternalLink aria-hidden="true" /></a><span>Orientações brasileiras sobre tratamento de dados em contextos acadêmicos e de pesquisa.</span></li>
          </ul>
        </section>

        <section className="article-cta">
          <h2>Antes de escolher uma ferramenta, reconheça seus critérios.</h2>
          <p>O Radar Docente ajuda a observar como planejamento, IA, avaliação e ética já aparecem na sua prática.</p>
          <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
        </section>

        <FaqSection items={articleFaq} title="Perguntas frequentes" />

        <section className="article-related">
          <p className="method-kicker">CONTINUE A LEITURA</p>
          <h2>Conteúdos relacionados</h2>
          <div><Link to="/metodologia">Como funciona a metodologia do Radar <ArrowRight aria-hidden="true" /></Link><Link to="/radar-docente">Conheça as seis dimensões avaliadas <ArrowRight aria-hidden="true" /></Link></div>
        </section>
      </ArticleLayout>
    </>
  )
}
