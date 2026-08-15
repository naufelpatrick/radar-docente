import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas')
const articleFaq = article.faq ?? []
const toc = [
  { id: 'dados-pessoais', label: 'O que conta como dado pessoal' },
  { id: 'sem-dados', label: 'Nem todo uso exige dados' },
  { id: 'protocolo', label: 'Protocolo de cinco decisões' },
  { id: 'nunca-enviar', label: 'O que não deve ser enviado' },
  { id: 'anonimizacao', label: 'Limites da anonimização' },
  { id: 'estudantes', label: 'Uso direto por estudantes' },
  { id: 'checklist', label: 'Checklist antes do envio' },
  { id: 'responsabilidade', label: 'Responsabilidade docente' },
  { id: 'referencias', label: 'Referências' },
]

const protocol = [
  ['Defina a finalidade', 'Explique com precisão o que pretende obter. Uma finalidade clara permite avaliar quais dados seriam realmente necessários.'],
  ['Reduza os dados', 'Envie somente o indispensável. Se a tarefa analisa estrutura, provavelmente não precisa de nome, escola, turma ou informações familiares.'],
  ['Anonimize de verdade', 'Retire identificadores diretos e indiretos, como nomes, cidades, datas, contatos e descrições que permitam reconhecer uma pessoa.'],
  ['Verifique a ferramenta', 'Confira conta, idade mínima, treinamento, armazenamento, exclusão, processamento, arquivos e autorização institucional.'],
  ['Planeje revisão e descarte', 'Defina quem revisará a saída, onde o resultado será armazenado e quando será descartado.'],
]

const checklist = [
  'A finalidade está clara.', 'O uso da IA é realmente necessário.', 'Somente os dados mínimos serão utilizados.',
  'Nomes e identificadores foram removidos.', 'Não há dados sensíveis.', 'A pessoa não pode ser reconhecida pelo contexto.',
  'Os termos e a política da ferramenta foram verificados.', 'A idade mínima foi respeitada.', 'A instituição permite o uso.',
  'Existe alternativa sem cadastro.', 'A saída será revisada por uma pessoa.', 'Armazenamento e descarte estão definidos.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['privacidade e dados no uso de IA na educação', 'LGPD e inteligência artificial na educação', 'dados de estudantes em ferramentas de IA', 'privacidade digital docente'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Ética', item: 'https://www.radarpraxia.com/blog/categoria/etica' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function PrivacyAndEducationalDataArticlePage() {
  return <>
    <Seo title={article.seoTitle} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
    <ArticleLayout article={article} categoryPath="/blog/categoria/etica" toc={toc}>
      <p className="article-lead">Usar inteligência artificial em uma atividade educacional também é tomar uma decisão sobre dados.</p>
      <p>Quando um professor copia o texto de um estudante, envia uma planilha de notas, anexa um relatório pedagógico ou descreve uma situação individual, pode estar compartilhando informações que identificam uma pessoa direta ou indiretamente.</p>
      <p>O risco nem sempre é evidente. Um texto sem nome pode revelar turma, idade, escola, condição de saúde, dificuldade de aprendizagem ou um acontecimento específico. Por isso, privacidade precisa fazer parte do planejamento pedagógico.</p>

      <figure className="article-cover"><img src={article.coverImage?.src} alt={article.coverImage?.alt} width="1200" height="630" loading="eager" /></figure>

      <aside className="article-callout article-callout--attention"><ShieldCheck aria-hidden="true" /><p>Este conteúdo apresenta orientação educacional geral e não substitui avaliação jurídica, parecer especializado ou as políticas, normas e procedimentos da instituição.</p></aside>

      <section id="dados-pessoais">
        <h2>O que conta como dado pessoal no contexto educacional</h2>
        <p>Dado pessoal é uma informação relacionada a uma pessoa identificada ou identificável. Na rotina escolar, isso pode incluir:</p>
        <ul className="article-checklist">{['Nome, e-mail, matrícula e telefone.', 'Fotografia, voz e vídeo.', 'Trabalhos e respostas de estudantes.', 'Notas, frequência e histórico escolar.', 'Endereço e localização.', 'Informações sobre comportamento.', 'Registros de acesso a plataformas.', 'Dados de responsáveis.', 'Combinações de turma, idade, escola e situação particular.'].map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <p>Dados sobre saúde, deficiência, origem racial ou étnica, convicção religiosa, opinião política e outros aspectos protegidos exigem cuidado ainda maior. No caso de crianças e adolescentes, o interesse e a proteção do estudante não podem ser tratados como detalhe operacional.</p>
      </section>

      <section id="sem-dados">
        <h2>Nem todo uso da IA exige dados de estudantes</h2>
        <p>Muitas tarefas podem ser realizadas sem inserir qualquer dado pessoal. A IA pode propor variações de uma atividade, gerar exemplos fictícios, sugerir perguntas, adaptar um texto criado pelo professor ou ajudar a construir uma rubrica genérica.</p>
        <blockquote className="article-quote">A ferramenta precisa realmente receber esses dados para cumprir a tarefa?</blockquote>
        <p>Se a resposta for não, retire-os.</p>
      </section>

      <section id="protocolo">
        <h2>Um protocolo de cinco decisões antes de enviar dados</h2>
        <div className="privacy-protocol">{protocol.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        <section className="article-cta article-cta--intermediate"><h2>Como privacidade aparece nas suas decisões?</h2><p>O Radar Docente ajuda a reconhecer critérios éticos, pedagógicos e críticos já presentes na sua prática.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      </section>

      <section id="nunca-enviar">
        <h2>O que nunca deve ser enviado sem autorização e base adequada</h2>
        <p>Evite inserir em ferramentas abertas listas de estudantes, notas, frequência, laudos, diagnósticos, relatórios individualizados, ocorrências disciplinares, documentos com contatos ou matrícula, fotos e vozes identificáveis, credenciais, documentos sigilosos, trabalhos associados ao autor e conversas privadas.</p>
        <p>Mesmo quando o objetivo parece positivo, como personalizar uma atividade, o envio pode ser desproporcional ao resultado esperado.</p>
      </section>

      <section id="anonimizacao">
        <h2>Anonimização não resolve tudo</h2>
        <p>Anonimizar reduz riscos, mas não transforma automaticamente qualquer uso em seguro. Ainda é necessário considerar finalidade pedagógica, regras institucionais, termos da ferramenta, idade, possibilidade de reidentificação, qualidade da resposta e supervisão humana.</p>
        <p>Trocar o nome por “Estudante A” é pseudonimização quando alguém ainda consegue relacionar facilmente o rótulo à pessoa. O dado continua exigindo proteção.</p>
      </section>

      <section id="estudantes">
        <h2>Quando estudantes usam a ferramenta diretamente</h2>
        <p>O cuidado aumenta quando o estudante acessa a plataforma. Verifique idade, necessidade de conta, alternativa equivalente, orientação sobre dados, acompanhamento docente e autorização institucional.</p>
        <blockquote className="article-quote">Não transforme a concordância com termos privados de uma empresa em requisito invisível para aprender ou ser avaliado.</blockquote>
        <h3>Uma prática simples: trabalhe com dados fictícios</h3>
        <p>Substitua casos reais por conjuntos fictícios. Use textos sintéticos, bases pequenas com dados inventados e cenários hipotéticos. Isso permite explorar a ferramenta sem transformar pessoas reais em matéria-prima do experimento.</p>
      </section>

      <section id="checklist">
        <h2>Checklist antes de usar IA com dados educacionais</h2>
        <ul className="article-checklist">{checklist.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <p>Se uma dessas respostas for incerta, pare antes do envio.</p>
      </section>

      <section id="responsabilidade">
        <h2>Responsabilidade não pode ser terceirizada para a ferramenta</h2>
        <p>O professor não precisa se tornar especialista jurídico para agir com responsabilidade. Precisa perguntar antes de enviar, reduzir dados, proteger identidades, testar com conteúdo fictício, seguir orientações institucionais, manter supervisão humana e recusar usos desnecessários.</p>
        <p>Em algumas situações, a decisão mais competente será usar IA apenas com materiais produzidos pelo professor. Em outras, será escolher uma solução institucional. E haverá casos em que a melhor decisão será não utilizar IA.</p>
        <blockquote className="article-quote">Fluência digital também é saber reconhecer limites.</blockquote>
      </section>

      <section id="referencias">
        <h2>Referências de base</h2>
        <ul className="article-references">
          <li><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm" target="_blank" rel="noopener noreferrer">Brasil — Lei Geral de Proteção de Dados Pessoais <ExternalLink aria-hidden="true" /></a><span>Lei nº 13.709, de 14 de agosto de 2018.</span></li>
          <li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">UNESCO — Guidance for Generative AI in Education and Research <ExternalLink aria-hidden="true" /></a><span>Orientações para uma abordagem segura e centrada nas pessoas, 2023.</span></li>
          <li><a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">UNESCO — AI Competency Framework for Teachers <ExternalLink aria-hidden="true" /></a><span>Competências docentes para uso responsável da inteligência artificial, 2024.</span></li>
          <li><a href="https://education.ec.europa.eu/focus-topics/digital-education/actions/plan/ethical-guidelines-for-educators-on-using-artificial-intelligence" target="_blank" rel="noopener noreferrer">Comissão Europeia — Ethical guidelines on AI and data in teaching and learning <ExternalLink aria-hidden="true" /></a><span>Orientações práticas para educadores sobre o uso ético de IA e dados.</span></li>
        </ul>
      </section>

      <ArticleShare article={article} />
      <section className="article-cta"><h2>Você considera apenas o recurso ou também privacidade e limites?</h2><p>O Radar Docente da PraxIA ajuda a identificar como você toma decisões pedagógicas, éticas e críticas diante da inteligência artificial.</p><ButtonLink href="/radar" variant="light" showArrow>Descobrir meu Score PraxIA</ButtonLink></section>
      <FaqSection items={articleFaq} title="Perguntas frequentes" />
      <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div>
        <Link to="/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica">Como escolher uma ferramenta de IA para uma atividade pedagógica <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia">O que são competências docentes para uso de IA <ArrowRight aria-hidden="true" /></Link>
        <Link to="/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia">Como avaliar atividades produzidas com apoio de IA <ArrowRight aria-hidden="true" /></Link>
      </div></section>
    </ArticleLayout>
  </>
}
