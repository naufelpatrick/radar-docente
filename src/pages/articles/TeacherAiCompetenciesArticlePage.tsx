import { ArrowRight, CheckCircle2, ExternalLink, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('o-que-sao-competencias-docentes-para-uso-de-ia')

const toc = [
  { id: 'conceito', label: 'Competência além da ferramenta' },
  { id: 'dez-competencias', label: 'Dez competências docentes' },
  { id: 'mapa', label: 'Mapa de competências' },
  { id: 'desenvolvimento', label: 'Como desenvolver' },
  { id: 'decisao', label: 'Competência é decidir' },
  { id: 'referencias', label: 'Referências' },
]

const competencies = [
  {
    title: 'Compreender o que a IA faz — e o que não faz',
    body: 'O professor não precisa dominar programação, mas precisa reconhecer que sistemas generativos produzem respostas com base em padrões, podem errar com aparência convincente, reproduzir vieses e tratar dados de maneiras que precisam ser conhecidas.',
  },
  {
    title: 'Definir intenção pedagógica',
    body: 'Antes da ferramenta vêm o objetivo de aprendizagem, a tarefa do estudante, a evidência esperada, o papel da IA, aquilo que não deve ser terceirizado e a forma de avaliação.',
  },
  {
    title: 'Interagir com ferramentas de forma estratégica',
    body: 'Formular instruções envolve contexto, público, objetivo, formato, restrições e critérios. Mais importante que buscar um prompt perfeito é revisar respostas, solicitar alternativas e refinar o processo.',
  },
  {
    title: 'Avaliar criticamente os resultados',
    body: 'Fluência textual não garante precisão. É necessário verificar fatos, fontes, coerência, profundidade, alinhamento curricular, acessibilidade, vieses e utilidade para a aprendizagem.',
  },
  {
    title: 'Proteger dados e privacidade',
    body: 'Competência também é distinguir dados públicos, pessoais, sensíveis e institucionais, utilizar somente o mínimo necessário, remover identificadores e não inserir documentos confidenciais.',
  },
  {
    title: 'Orientar autoria e transparência',
    body: 'O professor precisa explicar em quais etapas a IA pode ser usada, quais contribuições devem ser registradas, que partes serão avaliadas e quais evidências de processo serão solicitadas.',
  },
  {
    title: 'Redesenhar avaliação',
    body: 'Quando a IA participa da produção, o resultado final pode deixar de ser evidência suficiente. Hipóteses, versões, justificativas, verificações, defesas e reflexões aproximam a avaliação da aprendizagem.',
  },
  {
    title: 'Considerar inclusão e equidade',
    body: 'Acesso, conexão, planos pagos, cadastro, idade mínima, acessibilidade, idioma e repertório cultural afetam a experiência. Uma atividade não pode transformar tecnologia em barreira.',
  },
  {
    title: 'Refletir sobre a própria prática',
    body: 'Depois de uma atividade, importa observar se a IA ampliou a aprendizagem, preservou decisões centrais, economizou tempo de fato e manteve condições de inclusão e revisão.',
  },
  {
    title: 'Participar de decisões institucionais',
    body: 'Critérios de adoção, ferramentas autorizadas, proteção de dados, formação, orientação aos estudantes e avaliação de impactos precisam ser construídos coletivamente.',
  },
]

const articleFaq = article.faq ?? []

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      ...createBlogPostingSchema(article),
      keywords: ['competências docentes para uso de IA', 'formação de professores em inteligência artificial', 'letramento em IA', 'maturidade docente em IA', 'competências digitais docentes'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Competências Docentes', item: 'https://www.radarpraxia.com/blog/categoria/competencias-docentes' },
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

export function TeacherAiCompetenciesArticlePage() {
  return (
    <>
      <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
      <ArticleLayout article={article} categoryPath="/blog/categoria/competencias-docentes" toc={toc}>
        <p className="article-lead">Saber utilizar uma ferramenta não é o mesmo que possuir competência para integrar inteligência artificial à prática docente.</p>
        <p>Competência envolve compreender possibilidades e limites, tomar decisões pedagógicas, verificar resultados, proteger dados, orientar estudantes e refletir sobre os efeitos do uso.</p>

        <figure className="article-cover">
          <img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" />
        </figure>

        <section id="conceito">
          <h2>Competência vai além de saber usar uma ferramenta</h2>
          <p>Quando uma nova tecnologia chega à educação, é comum que a formação se concentre em onde clicar, como escrever comandos e como gerar textos, imagens ou apresentações. Esse aprendizado pode ser útil, mas não é suficiente.</p>
          <p>Ferramentas mudam rapidamente. Já as competências ajudam o professor a compreender novas soluções, avaliar seus riscos e decidir quando seu uso faz sentido.</p>
          <blockquote className="article-quote">Competência docente para uso de IA é a capacidade de mobilizar conhecimentos, critérios, atitudes e responsabilidades para integrar a tecnologia a uma situação pedagógica concreta.</blockquote>
          <p>Ela não se resume a produzir um bom prompt. Um professor pode escrever comandos sofisticados e ainda utilizar respostas incorretas, expor dados ou substituir a aprendizagem. Outro pode utilizar poucas ferramentas e demonstrar maturidade ao definir limites, revisar resultados, preservar autoria e justificar escolhas.</p>
          <aside className="article-callout"><Lightbulb aria-hidden="true" /><p><strong>A qualidade do uso depende menos da quantidade de recursos conhecidos e mais da qualidade das decisões tomadas.</strong></p></aside>
        </section>

        <section id="dez-competencias">
          <h2>Dez competências para integrar IA à docência</h2>
          <div className="article-decisions article-competencies">
            {competencies.map((competency, index) => (
              <article key={competency.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{competency.title}</h3>
                <p>{competency.body}</p>
              </article>
            ))}
          </div>
          <aside className="article-callout article-callout--attention"><ShieldCheck aria-hidden="true" /><p>Competência em IA também é saber quando não fornecer uma informação, quando não adotar uma ferramenta e quando preservar uma experiência de aprendizagem sem automação.</p></aside>
        </section>

        <section id="mapa">
          <h2>Um mapa de competências com a decisão docente no centro</h2>
          <p>As capacidades não funcionam de forma isolada. Em uma situação concreta, compreender, planejar, avaliar, proteger, orientar autoria, incluir, refletir e colaborar se conectam ao julgamento profissional.</p>
          <figure className="competency-map" aria-labelledby="competency-map-caption">
            <div className="competency-map__core">Decisão<br />docente</div>
            {['Compreender', 'Planejar', 'Interagir', 'Avaliar', 'Proteger', 'Orientar autoria', 'Incluir', 'Refletir', 'Colaborar'].map((item) => <span key={item}>{item}</span>)}
            <figcaption id="competency-map-caption">Mapa das competências necessárias para o uso responsável da inteligência artificial por professores.</figcaption>
          </figure>

          <h2>Competência não é um nível único</h2>
          <p>Um professor pode estar avançado em planejamento e iniciando seus estudos sobre privacidade. Pode revisar respostas com rigor e ainda ter dúvidas sobre avaliação. Pode possuir experiência técnica e pouca segurança pedagógica.</p>
          <p>Por isso, diagnósticos precisam considerar múltiplas dimensões. O objetivo não é separar professores entre “preparados” e “despreparados”, mas reconhecer forças, lacunas e próximos passos.</p>
        </section>

        <section id="desenvolvimento">
          <h2>Como começar a desenvolver essas competências</h2>
          <p>O desenvolvimento não exige dominar tudo antes de começar. Exige limites claros, experimentação de baixo risco e disposição para revisar a prática.</p>
          <ol className="article-checklist">
            {[
              'Escolher uma dimensão prioritária.',
              'Estudar conceitos essenciais.',
              'Realizar um experimento de baixo risco.',
              'Registrar decisões e resultados.',
              'Compartilhar o caso com colegas.',
              'Revisar critérios.',
              'Avançar gradualmente para situações mais complexas.',
            ].map((step) => <li key={step}><CheckCircle2 aria-hidden="true" /><span>{step}</span></li>)}
          </ol>
          <figure className="competency-cycle" aria-labelledby="competency-cycle-caption">
            {['Diagnosticar', 'Escolher prioridade', 'Estudar', 'Experimentar', 'Avaliar', 'Compartilhar', 'Ajustar'].map((item, index, items) => (
              <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < items.length - 1 && <ArrowRight aria-hidden="true" />}</div>
            ))}
            <figcaption id="competency-cycle-caption">Ciclo de desenvolvimento contínuo das competências docentes para uso de inteligência artificial.</figcaption>
          </figure>
        </section>

        <section id="decisao">
          <h2>Competência é capacidade de decidir</h2>
          <p>O professor competente não é aquele que utiliza mais ferramentas. É aquele que compreende uma situação, define um propósito, avalia riscos, escolhe um recurso, revisa resultados e assume responsabilidade pelo que acontece.</p>
          <blockquote className="article-quote">Ferramentas mudam. Critérios permanecem.</blockquote>
          <p>Por isso, a formação docente em IA precisa ir além de tutoriais e listas de prompts. Ela deve fortalecer autonomia, pensamento crítico, ética, avaliação e reflexão.</p>
        </section>

        <section id="referencias">
          <h2>Referências de base</h2>
          <ul className="article-references">
            <li><a href="https://joint-research-centre.ec.europa.eu/digcompedu_en" target="_blank" rel="noopener noreferrer">Comissão Europeia — European Framework for the Digital Competence of Educators: DigCompEdu <ExternalLink aria-hidden="true" /></a><span>Referencial europeu para competências digitais de educadores.</span></li>
            <li><a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">UNESCO — AI Competency Framework for Teachers <ExternalLink aria-hidden="true" /></a><span>Framework de 2024 sobre agência humana, ética, fundamentos, pedagogia e desenvolvimento profissional.</span></li>
            <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for Generative AI in Education and Research <ExternalLink aria-hidden="true" /></a><span>Orientação de 2023 para um uso educacional centrado nas pessoas.</span></li>
          </ul>
        </section>

        <ArticleShare article={article} />

        <section className="article-cta">
          <h2>Quais competências já estão consolidadas na sua prática?</h2>
          <p>O Radar Docente da PráxIA analisa sua prática em seis dimensões e apresenta um caminho de evolução coerente com seu momento atual.</p>
          <ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PráxIA</ButtonLink>
        </section>

        <FaqSection items={articleFaq} title="Perguntas frequentes" />

        <section className="article-related">
          <p className="method-kicker">CONTINUE A LEITURA</p>
          <h2>Conteúdos relacionados</h2>
          <div>
            <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
            <Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight aria-hidden="true" /></Link>
            <Link to="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia">Como conversar sobre autoria em atividades com IA <ArrowRight aria-hidden="true" /></Link>
            <Link to="/metodologia#dimensoes">Conheça as seis dimensões do Radar Docente <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </ArticleLayout>
    </>
  )
}
