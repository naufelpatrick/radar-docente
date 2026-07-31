import { ArrowRight, BookOpen, ChevronRight, Compass, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { getPublishedArticlesByCategory } from '../data/blogArticles'

const categories = {
  'ia-para-professores': {
    name: 'IA para Professores',
    eyebrow: 'COMPREENDER ANTES DE APLICAR',
    description: 'Conceitos, critérios e situações práticas para utilizar inteligência artificial com intenção pedagógica, transparência e supervisão humana.',
    questions: ['Quando a IA amplia a aprendizagem?', 'Que decisões permanecem com professor e estudantes?', 'Como preservar dados, autoria e possibilidade de revisão?'],
  },
  'competencias-docentes': {
    name: 'Competências Docentes', eyebrow: 'DESENVOLVIMENTO PROFISSIONAL', description: 'Leituras sobre fluência digital, repertório pedagógico e desenvolvimento das competências observadas pelo Radar Docente.', questions: ['Como reconhecer competências na prática?', 'O que diferencia uso pontual e integração?', 'Como acompanhar a própria trajetória?'],
  },
  ferramentas: {
    name: 'Ferramentas', eyebrow: 'PROPÓSITO ANTES DA NOVIDADE', description: 'Análises de recursos digitais e de IA orientadas por objetivo pedagógico, contexto, dados e condições de uso.', questions: ['Que problema a ferramenta ajuda a resolver?', 'Que complexidade ela acrescenta?', 'Quais dados e termos precisam ser verificados?'],
  },
  planejamento: {
    name: 'Planejamento', eyebrow: 'INTENÇÃO E CURADORIA', description: 'Critérios para selecionar recursos, organizar percursos e conectar escolhas digitais aos objetivos de aprendizagem.', questions: ['Qual é o objetivo de aprendizagem?', 'Que evidência será observada?', 'A tecnologia amplia ou apenas substitui o suporte?'],
  },
  avaliacao: {
    name: 'Avaliação', eyebrow: 'EVIDÊNCIAS E FEEDBACK', description: 'Caminhos para acompanhar processos, oferecer devolutivas e preservar autoria em experiências digitais e com IA.', questions: ['Que evidências mostram aprendizagem?', 'Como tornar critérios visíveis?', 'Onde a revisão humana é indispensável?'],
  },
  etica: {
    name: 'Ética', eyebrow: 'CUIDADO E RESPONSABILIDADE', description: 'Privacidade, vieses, transparência, segurança, autoria e responsabilidade nas decisões educacionais com tecnologia.', questions: ['Quais dados estão envolvidos?', 'Como comunicar o uso de IA?', 'Quem pode revisar ou contestar o resultado?'],
  },
  pesquisa: {
    name: 'Pesquisa', eyebrow: 'EVIDÊNCIA COM CONTEXTO', description: 'Sínteses acessíveis de documentos, estudos e debates que ajudam professores a interpretar mudanças sem generalizações.', questions: ['O que a fonte realmente permite afirmar?', 'Em que contexto o estudo foi realizado?', 'Como traduzir evidência em pergunta para a prática?'],
  },
  'estudos-de-caso': {
    name: 'Estudos de Caso', eyebrow: 'DECISÕES EM CONTEXTO', description: 'Experiências analisadas a partir de objetivos, escolhas, evidências, limites e ajustes — sem transformar caso em receita.', questions: ['Que decisão foi tomada e por quê?', 'Que evidência orientou o ajuste?', 'O que depende daquele contexto específico?'],
  },
} as const

type CategorySlug = keyof typeof categories

export function BlogCategoryPage() {
  const { slug } = useParams()
  if (!slug || !(slug in categories)) return <Navigate to="/blog" replace />
  const category = categories[slug as CategorySlug]
  const articles = getPublishedArticlesByCategory(slug)
  const canonicalPath = `/blog/categoria/${slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: `${category.name} | Blog PráxIA`, description: category.description, url: `https://radar-docente-pi.vercel.app${canonicalPath}`, inLanguage: 'pt-BR' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://radar-docente-pi.vercel.app/blog' },
        { '@type': 'ListItem', position: 3, name: category.name, item: `https://radar-docente-pi.vercel.app${canonicalPath}` },
      ] },
    ],
  }

  return (
    <>
      <Seo title={`Blog: ${category.name}`} description={category.description} path={canonicalPath} jsonLd={schema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="blog" />
      <main id="conteudo-principal" className="category-page">
        <header className="category-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><Link to="/blog">Blog</Link><ChevronRight aria-hidden="true" /><span aria-current="page">{category.name}</span></nav>
            <p className="method-kicker">{category.eyebrow}</p>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
          </div>
        </header>

        <section className="category-context">
          <div className="shell category-context__grid">
            <div><Compass aria-hidden="true" /><p className="method-kicker">PERGUNTAS QUE ORIENTAM A CATEGORIA</p><h2>Conteúdo para apoiar decisões, não oferecer atalhos.</h2></div>
            <ul>{category.questions.map((question, index) => <li key={question}><span>0{index + 1}</span>{question}</li>)}</ul>
          </div>
        </section>

        <section className="category-content" aria-labelledby="category-content-title">
          <div className="shell">
            <div className="method-heading"><div><p className="method-kicker">CONTEÚDOS</p><h2 id="category-content-title">Leituras em {category.name}.</h2></div><p>Artigos integrais, com autoria, referências, tempo de leitura e continuidade para a prática.</p></div>
            {articles.length > 0 ? (
              <div className="category-articles">
                {articles.map((article) => (
                  <article key={article.path}>
                    <div><span>{category.name}</span><small>{article.publishedDate} · {article.readingTime}</small></div>
                    <h3><Link to={article.path}>{article.title}</Link></h3>
                    <p>{article.summary}</p>
                    <Link to={article.path}>Ler artigo <ArrowRight aria-hidden="true" /></Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="category-empty">
                <BookOpen aria-hidden="true" />
                <div><span>CONTEÚDOS EM PREPARAÇÃO</span><h3>Esta categoria ainda não possui artigos publicados.</h3><p>Preferimos publicar uma leitura completa e referenciada a preencher a página com conteúdo superficial.</p></div>
                <ButtonLink href="/blog">Voltar ao Blog</ButtonLink>
              </div>
            )}
          </div>
        </section>

        <section className="category-cta">
          <div className="shell"><Sparkles aria-hidden="true" /><div><p className="method-kicker">ENQUANTO VOCÊ EXPLORA</p><h2>Descubra qual dimensão pede seu próximo experimento.</h2></div><ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar</ButtonLink></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
