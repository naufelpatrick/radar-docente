import { ArrowRight, CheckCircle2, ExternalLink, MessageSquareText, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from '../../components/ArticleLayout'
import { ArticleShare } from '../../components/ArticleShare'
import { AuthorshipTrafficLight, DeclarationCopyCards } from '../../components/AuthorshipTools'
import { ButtonLink } from '../../components/ButtonLink'
import { FaqSection } from '../../components/FaqSection'
import { Seo } from '../../components/Seo'
import { getBlogArticleBySlug } from '../../data/blogArticles'
import { createBlogPostingSchema } from '../../services/articleSeo'

const article = getBlogArticleBySlug('como-conversar-sobre-autoria-em-atividades-com-ia')
const article2Path = '/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem'
const toc = [
  { id: 'autoria', label: 'Autoria além da produção manual' },
  { id: 'transparencia', label: 'Transparência sem confissão' },
  { id: 'regras', label: 'Regras ligadas ao objetivo' },
  { id: 'semaforo', label: 'Semáforo de autorização' },
  { id: 'gradacoes', label: 'Assistência, colaboração e substituição' },
  { id: 'explicar', label: 'Capacidade de explicar' },
  { id: 'rejeitar', label: 'Rejeitar sugestões' },
  { id: 'declaracoes', label: 'Modelos de declaração' },
  { id: 'cultura', label: 'Cultura sem vigilância' },
  { id: 'orientacao', label: 'Exemplo de orientação' },
  { id: 'referencias', label: 'Referências' },
]
const articleFaq = [
  { question: 'Usar IA é sempre plágio?', answer: 'Não. O uso pode ser permitido e transparente, dependendo da atividade. O problema surge quando uma contribuição relevante é ocultada ou quando a ferramenta substitui a competência que deveria ser demonstrada.' },
  { question: 'É obrigatório entregar todos os prompts?', answer: 'Não necessariamente. O registro deve ser proporcional ao objetivo e ao risco. Em muitos casos, uma declaração sobre finalidade, contribuições, alterações e verificação é suficiente.' },
  { question: 'Como saber se o trabalho ainda é autoral?', answer: 'Observe se o estudante definiu intenções, tomou decisões, transformou contribuições, verificou informações e consegue explicar e defender o resultado.' },
  { question: 'Posso proibir completamente o uso de IA?', answer: 'Pode haver atividades em que a proibição é coerente porque a ferramenta substituiria a competência avaliada. A regra deve ser explícita, justificada e acompanhada de critérios claros.' },
  { question: 'Detectores de texto de IA resolvem o problema?', answer: 'Não. Resultados podem ser imprecisos e não explicam o processo de aprendizagem. Detectores nunca devem substituir diálogo, evidências de processo e avaliação pedagógica.' },
  { question: 'Como lidar com um uso não declarado?', answer: 'Converse com o estudante, retome as orientações fornecidas, solicite uma explicação do processo e examine evidências antes de concluir que houve fraude. Considere intenção, impacto e clareza das regras.' },
]
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...createBlogPostingSchema(article), keywords: ['autoria e inteligência artificial na educação', 'uso ético de IA por estudantes', 'transparência no uso de IA', 'declaração de uso de IA'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.radarpraxia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.radarpraxia.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'Ética', item: 'https://www.radarpraxia.com/blog/categoria/etica' },
      { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
    ] },
    { '@type': 'FAQPage', mainEntity: articleFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
}

export function AuthorshipWithAiArticlePage() {
  return (
    <>
      <Seo title={article.title} socialTitle={article.title} description={article.metaDescription} path={article.path} type="article" image={article.socialImage} imageAlt={article.socialImageAlt} jsonLd={schema} />
      <ArticleLayout article={article} categoryPath="/blog/categoria/etica" toc={toc}>
        <p className="article-lead">A discussão sobre autoria em atividades com IA não pode ser reduzida a “usou ou não usou”. O ponto central é reconhecer quais decisões pertencem ao estudante, como a ferramenta contribuiu e de que modo o processo pode ser apresentado com transparência.</p>
        <p>Dois estudantes podem utilizar IA e realizar processos profundamente diferentes. Autoria envolve intenção, julgamento, seleção, transformação, verificação e capacidade de responder pelo trabalho entregue.</p>
        <div className="authorship-layers" role="img" aria-label="Camadas de autoria humana e contribuição da inteligência artificial em uma atividade educacional">{['Ideia própria','Consulta à IA','Seleção','Verificação','Transformação','Versão final'].map((label, index) => <span key={label} style={{ '--layer': index } as React.CSSProperties}>{label}</span>)}</div>

        <section id="autoria"><h2>Autoria não é apenas produção manual</h2><p>Estudantes sempre produziram com apoio de livros, aulas, colegas, orientações, corretores e referências. O problema não está em receber apoio, mas em ocultar contribuições, substituir decisões essenciais ou apresentar aquilo que não foi compreendido.</p><div className="article-decisions"><article><span>01</span><h3>Intenção</h3><p>Compreender o propósito e definir o que se pretende comunicar ou resolver.</p></article><article><span>02</span><h3>Decisão</h3><p>Selecionar caminhos, argumentos, fontes, alternativas e critérios.</p></article><article><span>03</span><h3>Transformação</h3><p>Modificar, combinar, reorganizar ou rejeitar contribuições recebidas.</p></article><article><span>04</span><h3>Responsabilidade</h3><p>Verificar o conteúdo e assumir as consequências do que é apresentado.</p></article><article><span>05</span><h3>Explicação</h3><p>Justificar o processo e defender o resultado.</p></article></div></section>

        <section id="transparencia"><h2>Transparência é diferente de confissão</h2><p>Quando o uso de IA só aparece associado a proibição e punição, declarar a ferramenta parece admitir culpa. Uma política de transparência comunica outra ideia: registrar contribuições faz parte da qualidade do trabalho.</p><aside className="article-callout"><MessageSquareText aria-hidden="true" /><p>Uma declaração útil informa <strong>qual ferramenta foi utilizada, em que etapa, com qual finalidade, o que foi aproveitado, modificado ou rejeitado e como houve verificação.</strong></p></aside><blockquote className="article-quote">“Utilizei IA para gerar três possibilidades de estrutura. Escolhi a segunda, reorganizei as seções e escrevi o texto com base nas referências da atividade. As afirmações factuais foram conferidas nas fontes citadas.”</blockquote></section>

        <section id="regras"><h2>Evite regras genéricas demais</h2><p>“Pode usar com responsabilidade” ou “não use para fazer o trabalho” deixam dúvidas sobre ideias, exemplos, revisão, tradução, imagens e código. A regra precisa estar ligada ao objetivo da atividade.</p><ul className="article-checklist">{['O que é permitido','O que não é permitido','O que precisa ser declarado','Quais etapas serão avaliadas','Quais evidências do processo serão solicitadas'].map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul></section>

        <section id="semaforo"><h2>Use um semáforo de autorização</h2><p>Três níveis diminuem ambiguidades e transformam ética em orientação concreta. A classificação nunca é universal: um uso aceitável em História pode ser inadequado quando a própria escrita é a competência avaliada.</p><AuthorshipTrafficLight /></section>

        <section id="gradacoes"><h2>Diferencie assistência, colaboração e substituição</h2><div className="article-decisions"><article><span>01</span><h3>Assistência</h3><p>A ferramenta apoia uma etapa periférica: ortografia, formato, organização de notas ou perguntas.</p></article><article><span>02</span><h3>Colaboração</h3><p>A IA gera alternativas; o estudante seleciona, transforma, verifica e responde pelo resultado.</p></article><article><span>03</span><h3>Substituição</h3><p>A ferramenta executa o núcleo cognitivo e o estudante apenas transfere a resposta.</p></article></div><p>Uma atividade pode permitir assistência, aceitar colaboração transparente e impedir substituição.</p></section>

        <section id="explicar"><h2>Avalie a capacidade de explicar</h2><p>Uma conversa breve, defesa oral ou reflexão escrita pode oferecer mais evidências de autoria do que tentar detectar automaticamente a origem de um texto.</p><ul className="article-checklist">{['Resumir o argumento central','Justificar escolhas e conceitos','Identificar limitações','Responder a uma pergunta inesperada','Aplicar a ideia em nova situação','Explicar mudanças entre versões'].map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul><aside className="article-callout article-callout--attention"><ShieldCheck aria-hidden="true" /><p>Detectores podem produzir classificações imprecisas e não revelam a qualidade do processo. <strong>Não substituem critérios pedagógicos, diálogo e evidências.</strong></p></aside></section>

        <section id="rejeitar"><h2>Ensine os estudantes a rejeitar sugestões</h2><p>A autoria aparece também no que é recusado. Pedir o registro de uma sugestão descartada e sua justificativa desloca o estudante da posição de consumidor para editor responsável.</p><div className="article-tags">{['Informação não confirmada','Argumento incompatível','Linguagem inadequada','Resposta genérica','Exemplo fora do contexto','Risco ético','Perda de precisão'].map((item) => <span key={item}>{item}</span>)}</div></section>

        <section id="declaracoes"><h2>Crie modelos de declaração proporcionais</h2><p>Um exercício curto pode exigir uma frase; um trabalho final pode precisar de registro por etapas. Os modelos abaixo podem ser copiados e adaptados.</p><DeclarationCopyCards /><div className="article-contribution-flow" aria-label="Camadas de contribuição e decisão humana">{['Ideia própria','Consulta à IA','Seleção','Verificação','Transformação','Versão final'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 5 && <ArrowRight aria-hidden="true" />}</div>)}</div><section className="article-cta article-cta--intermediate"><h2>Como autoria e transparência aparecem na sua prática?</h2><p>O Radar Docente ajuda a reconhecer decisões éticas que já estão presentes e aquelas que pedem um próximo experimento.</p><ButtonLink href="/radar" variant="light" showArrow>Fazer meu Radar Docente</ButtonLink></section></section>

        <section id="cultura"><h2>Construa uma cultura de autoria sem transformar autoria em vigilância</h2><p>Regras são necessárias, mas ganham sentido quando estudantes analisam casos ambíguos, justificam processos, aprendem a verificar respostas e encontram critérios consistentes ao longo do curso.</p><p>Transparência não exige monitorar cada passo. Históricos extensos e gravações completas podem gerar burocracia, ansiedade e problemas de privacidade. Solicite apenas evidências relevantes e proporcionais ao objetivo e ao risco.</p></section>

        <section id="orientacao"><h2>Exemplo de orientação para uma atividade</h2><div className="article-case"><p><strong>Uso permitido</strong>Gerar alternativas de estrutura, revisar clareza e sugerir perguntas para aprofundamento.</p><p><strong>Uso que precisa ser declarado</strong>Trecho, imagem, código ou estrutura gerada e incorporada à entrega.</p><p><strong>Uso não permitido</strong>A análise das fontes e a conclusão, pois constituem as competências avaliadas.</p><p><strong>Evidências solicitadas</strong>Hipótese inicial, sugestão descartada, versão final e declaração de quatro a seis linhas.</p></div><p>Converse com a turma a partir de seis perguntas: o que significa ser autor, que apoio é permitido, quais decisões precisam ser próprias, o que declarar, como verificar e como demonstrar compreensão.</p></section>

        <section><h2>Autoria é responsabilidade visível</h2><p>Um trabalho não se torna automaticamente inválido porque recebeu apoio tecnológico. Também não se torna autoral apenas porque houve pequenas alterações em uma resposta pronta.</p><p>A autoria se fortalece quando o estudante define intenções, decide, transforma contribuições, verifica informações, explica o processo e assume responsabilidade. A transparência não diminui o trabalho: torna visível sua qualidade.</p></section>

        <section id="referencias"><h2>Referências de base</h2><ul className="article-references"><li><a href="https://arxiv.org/abs/2305.07605" target="_blank" rel="noreferrer">Tzirides et al. — Generative AI: Implications and Applications for Education <ExternalLink aria-hidden="true" /></a><span>Discussão de 2023 sobre limites e aplicações educacionais da IA generativa, incluindo revisão e avaliação.</span></li><li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noreferrer">UNESCO — Guidance for generative AI in education and research <ExternalLink aria-hidden="true" /></a><span>Agência humana, validação pedagógica e uso responsável da IA generativa.</span></li><li><a href="https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence" target="_blank" rel="noreferrer">UNESCO — Recommendation on the Ethics of Artificial Intelligence <ExternalLink aria-hidden="true" /></a><span>Transparência, responsabilidade, supervisão humana e proteção de direitos.</span></li></ul></section>

        <ArticleShare article={article} />
        <section className="article-cta"><h2>Suas orientações sobre autoria já estão claras?</h2><p>Descubra como transparência, responsabilidade e ética aparecem hoje em sua prática docente.</p><ButtonLink href="/radar" variant="light" showArrow>Fazer meu Radar Docente</ButtonLink></section>
        <FaqSection items={articleFaq} title="Perguntas frequentes" />
        <section className="article-related"><p className="method-kicker">CONTINUE A LEITURA</p><h2>Conteúdos relacionados</h2><div><Link to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta">Usar IA com estudantes começa antes da ferramenta <ArrowRight /></Link><Link to={article2Path}>Da possibilidade tecnológica ao objetivo de aprendizagem <ArrowRight /></Link><Link to="/ferramentas">Critérios para escolher ferramentas digitais e de IA <ArrowRight /></Link><Link to="/competencias">Competências docentes para uso de IA <ArrowRight /></Link></div></section>
      </ArticleLayout>
    </>
  )
}
