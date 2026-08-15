import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { DigitalFluencyDimensions } from '../../components/DigitalFluencyDimensions'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('o-que-e-fluencia-digital-para-professores')
const articleFaq = article.faq ?? []
const toc = [
  { id: 'ferramentas', label: 'Fluência não é quantidade de ferramentas' },
  { id: 'dimensoes', label: 'O que compõe a fluência digital docente' },
  { id: 'inteligencia-artificial', label: 'Onde entra a inteligência artificial?' },
  { id: 'sem-perfeicao', label: 'Fluência digital não exige perfeição' },
  { id: 'caminho', label: 'Um caminho para refletir' },
  { id: 'referencias', label: 'Referências' },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['fluência digital para professores', 'fluência digital docente', 'competência digital docente', 'tecnologia na educação', 'inteligência artificial para professores'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Fluência Digital', item: 'https://www.radarpraxia.com/blog/categoria/fluencia-digital' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function WhatIsDigitalFluencyArticlePage() {
  return <>
    <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
    <ArticleLayout article={article} categoryPath="/blog/categoria/fluencia-digital" toc={toc}>
      <p className="article-lead">Uma professora abre uma plataforma para preparar uma aula. Em poucos minutos, encontra modelos, vídeos, atividades prontas, ferramentas de colaboração e recursos de inteligência artificial.</p>
      <p>A abundância pode parecer liberdade — e, ao mesmo tempo, gerar uma pergunta difícil: <strong>qual escolha realmente ajuda os estudantes a aprender?</strong></p>
      <p>É nesse ponto que a fluência digital se torna relevante.</p>
      <p>Fluência digital para professores não significa conhecer todos os aplicativos, memorizar comandos ou adotar a ferramenta mais recente. Significa compreender possibilidades, reconhecer limites e tomar decisões pedagógicas mais conscientes ao usar tecnologias.</p>
      <blockquote className="article-quote">A tecnologia não é o ponto de partida. A aprendizagem é.</blockquote>
      <p>Quando o professor pergunta primeiro o que seus estudantes precisam aprender, quais barreiras enfrentam e que experiência pode apoiar esse processo, a escolha de uma ferramenta ganha sentido. Quando a pergunta começa e termina em “qual aplicativo está em alta?”, há o risco de a aula se organizar ao redor do recurso, e não do objetivo pedagógico.</p>
      <p>Fluência digital é, portanto, uma competência de decisão.</p>

      <figure className="article-cover"><img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" /></figure>

      <section id="ferramentas">
        <h2>Fluência não é quantidade de ferramentas</h2>
        <p>É comum associar competência digital a uma lista de plataformas: ambiente virtual, editor de apresentações, aplicativo de quiz, ferramenta de vídeo, IA generativa. Conhecer recursos pode ajudar, mas não é uma medida suficiente de fluência.</p>
        <p>Uma pessoa pode dominar muitas interfaces e ainda assim usar tecnologia sem propósito claro. Também pode conhecer poucos recursos, mas saber escolher bem quando utilizá-los, adaptá-los à turma e avaliar seus efeitos na aprendizagem.</p>
        <p>A diferença está no tipo de pergunta que orienta a ação:</p>
        <ul className="article-checklist article-checklist--boxed">
          {['Qual objetivo de aprendizagem esta proposta atende?', 'Esta tecnologia amplia uma possibilidade real ou só adiciona uma etapa?', 'Todos os estudantes conseguem participar?', 'Que dados esta plataforma coleta e quais cuidados são necessários?', 'Como saberei se a escolha contribuiu para a aprendizagem?'].map((question) => <li key={question}><span>{question}</span></li>)}
        </ul>
        <p>Essas perguntas deslocam a conversa do domínio técnico para a intencionalidade pedagógica — princípio que também orienta a <Link to="/metodologia">metodologia da PraxIA</Link>.</p>
      </section>

      <section id="dimensoes">
        <h2>O que compõe a fluência digital docente</h2>
        <p>A fluência digital docente reúne conhecimentos, habilidades, atitudes e critérios. Ela aparece em decisões cotidianas: adaptar um material, escolher entre uma atividade individual ou colaborativa, verificar uma informação, definir o uso de IA, organizar uma avaliação ou recusar uma ferramenta que não faz sentido para aquela turma.</p>
        <p>Embora os referenciais usem nomes diferentes, seis dimensões estão quase sempre presentes.</p>
        <DigitalFluencyDimensions />
      </section>

      <section id="inteligencia-artificial">
        <h2>Onde entra a inteligência artificial?</h2>
        <p>A inteligência artificial amplia a urgência desse debate porque reduz muitas barreiras operacionais. Hoje é possível produzir uma primeira versão de plano de aula, adaptar um texto, criar perguntas ou organizar ideias em segundos.</p>
        <p>Isso não substitui o julgamento docente. Pelo contrário: torna esse julgamento ainda mais importante.</p>
        <p>Uma IA pode sugerir uma atividade. O professor precisa avaliar se ela é adequada à idade dos estudantes, ao currículo, ao tempo disponível e ao contexto da turma. Pode produzir uma explicação aparentemente correta. O professor precisa verificar referências, precisão e linguagem. Pode gerar um material atraente. O professor precisa decidir se ele produz aprendizagem ou apenas aparência de inovação.</p>
        <blockquote className="article-quote">Ferramentas geram possibilidades; a intenção pedagógica define o valor delas.</blockquote>
        <section className="article-cta article-cta--intermediate"><h2>Como essas dimensões aparecem na sua prática?</h2><p>Receba uma leitura orientativa da sua fluência digital e do uso pedagógico de IA.</p><ButtonLink href="/radar" variant="light" showArrow>Faça o Radar PraxIA gratuitamente</ButtonLink></section>
      </section>

      <section id="sem-perfeicao">
        <h2>Fluência digital não exige perfeição</h2>
        <p>Muitos professores evitam experimentar recursos digitais porque imaginam que precisam dominar tudo antes de começar. Essa expectativa cria uma barreira desnecessária.</p>
        <p>Fluência não é segurança absoluta. É a disposição de aprender com critério. Começar por um desafio concreto costuma ser mais produtivo do que tentar conhecer todas as plataformas disponíveis.</p>
        <p>Uma boa pergunta inicial é: <strong>“Em qual momento da minha prática a tecnologia poderia reduzir um obstáculo ou ampliar uma experiência de aprendizagem?”</strong></p>
        <p>A resposta pode estar no planejamento, na participação dos estudantes, na acessibilidade de um material, na devolutiva de uma atividade ou na organização de evidências de aprendizagem. O importante é observar os resultados, ajustar a rota e transformar a experiência em repertório.</p>
      </section>

      <section id="caminho">
        <h2>Um caminho para refletir sobre a própria prática</h2>
        <p>Desenvolver fluência digital é um processo. Não é uma certificação definitiva nem uma corrida para acompanhar cada novidade. É uma construção contínua de autonomia para decidir, criar, avaliar e aprender.</p>
        <p>O <Link to="/radar">Radar PraxIA</Link> foi criado para apoiar essa reflexão. Ele oferece uma leitura orientativa sobre dimensões da fluência digital e do uso pedagógico de IA, ajudando cada professor a reconhecer forças e priorizar próximos passos possíveis.</p>
      </section>

      <section id="referencias">
        <h2>Referências</h2>
        <ul className="article-references">
          <li><a href="https://joint-research-centre.ec.europa.eu/digcompedu_en" target="_blank" rel="noopener noreferrer">Redecker — European Framework for the Digital Competence of Educators <ExternalLink aria-hidden="true" /></a><span>Publications Office of the European Union, 2017.</span></li>
          <li><a href="https://unesdoc.unesco.org/ark:/48223/pf0000265721" target="_blank" rel="noopener noreferrer">UNESCO — ICT Competency Framework for Teachers <ExternalLink aria-hidden="true" /></a><span>Versão 3, 2018.</span></li>
          <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for Generative AI in Education and Research <ExternalLink aria-hidden="true" /></a><span>Orientações para IA generativa na educação e pesquisa, 2023.</span></li>
          <li><a href="https://curriculo.cieb.net.br/" target="_blank" rel="noopener noreferrer">CIEB — Currículo de referência em tecnologia e computação <ExternalLink aria-hidden="true" /></a><span>Da educação infantil ao ensino fundamental, 2019.</span></li>
        </ul>
      </section>

      <ArticleShare article={article} />
      <section className="article-cta"><h2>Reconheça seu ponto de partida.</h2><p>Transforme a reflexão sobre tecnologia em próximos passos possíveis para sua prática docente.</p><ButtonLink href="/radar" variant="light" showArrow>Faça o Radar PraxIA gratuitamente</ButtonLink></section>
      <FaqSection items={articleFaq} title="Perguntas frequentes" />
      <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Artigos relacionados</h2><div>
        <Link to="/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia">O que são competências docentes para uso de IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem">Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog">Ver todos os conteúdos do blog <ArrowRight aria-hidden="true" /></Link>
      </div></section>
    </ArticleLayout>
  </>
}
