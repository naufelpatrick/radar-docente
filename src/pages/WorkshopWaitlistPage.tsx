import { BookOpen, Instagram, Layers3, LineChart, Linkedin, Quote } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { Seo } from '../components/Seo'
import { WorkshopWaitlistForm } from '../components/WorkshopWaitlistForm'
import '../workshopWaitlist.css'

const topics = [
  { number: '01', icon: Layers3, title: 'Fluência real × uso superficial de IA', text: 'Como reconhecer a diferença entre apenas operar uma ferramenta e tomar decisões pedagógicas mais conscientes com ela.' },
  { number: '02', icon: LineChart, title: 'O que a pesquisa mostra', text: 'Uma leitura clara sobre maturidade digital, inovatividade e o que essa relação revela sobre a prática em sala de aula.' },
  { number: '03', icon: BookOpen, title: 'Da teoria ao plano de aula', text: 'Um caminho aplicado para transformar possibilidades da IA em intenção pedagógica, atividade e critérios de avaliação.' },
]

export function WorkshopWaitlistPage() {
  return (
    <div className="workshop-page">
      <Seo title="Workshop gratuito: IA na prática docente | PráxIA" description="Entre na lista de espera do workshop gratuito sobre fluência em IA, maturidade digital e aplicação prática no planejamento docente." path="/lp/workshop-ia-2026" image="https://www.radarpraxia.com/social/workshop-ia-pratica-docente-1200x630.jpg" imageAlt="Educadores reunidos em torno de um computador durante atividade de formação" />
      <a className="skip-link" href="#conteudo-workshop">Pular para o conteúdo</a>
      <header className="workshop-header"><div className="workshop-shell"><a href="/" aria-label="PráxIA — página inicial"><BrandMark inverse /></a><a href="#lista-de-espera">Entrar na lista <span aria-hidden="true">↘</span></a></div></header>
      <main id="conteudo-workshop">
        <section className="workshop-hero">
          <div className="workshop-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="workshop-shell workshop-hero__grid">
            <div className="workshop-hero__copy">
              <p className="workshop-tag"><span /> EM BREVE</p>
              <h1>Workshop gratuito: <em>IA na prática docente</em></h1>
              <p>Direto da pesquisa que deu origem ao PráxIA. Antes de marcar a data, queremos saber: isso faz sentido para você?</p>
              <div className="workshop-hero__signal"><span>Pesquisa</span><i /><span>Contexto</span><i /><span>Prática</span></div>
            </div>
            <WorkshopWaitlistForm compact submitLabel="Quero entrar na lista de espera" />
          </div>
        </section>

        <section className="workshop-topics" aria-labelledby="sobre-workshop">
          <div className="workshop-shell"><p className="workshop-kicker">SOBRE O WORKSHOP</p><div className="workshop-section-heading"><h2 id="sobre-workshop">Um encontro para pensar antes de <em>automatizar.</em></h2><p>Sem receitas prontas. Vamos olhar para evidências, contexto e decisões que cabem na realidade de quem ensina.</p></div>
          <div className="workshop-topic-grid">{topics.map(({ number, icon: Icon, title, text }) => <article key={number}><div><span>{number}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="workshop-origin" aria-labelledby="origem-workshop">
          <div className="workshop-shell workshop-origin__grid">
            <div className="workshop-origin__photo"><img src="/workshop-ia-docentes.webp" alt="Três educadores analisam juntos uma atividade em um computador" width="900" height="1100" loading="lazy" decoding="async" /><span>Educação em primeiro plano</span></div>
            <div className="workshop-origin__copy"><p className="workshop-kicker">POR QUE ESSE WORKSHOP EXISTE</p><h2 id="origem-workshop">Pesquisa que volta para a <em>sala de aula.</em></h2><p>O PráxIA nasceu de uma pesquisa de mestrado em Sistemas Produtivos, na UNIPLAC, sobre a correlação entre maturidade digital e inovatividade. O estudo ajudou a tornar visível algo que educadores percebem na prática: acesso à tecnologia, sozinho, não produz inovação pedagógica.</p><p>Este workshop é o próximo passo dessa investigação — uma conversa para traduzir evidências em escolhas de planejamento, aplicação e avaliação.</p><blockquote><Quote aria-hidden="true" /><strong>Criado por educadores e pesquisadores, não por especialistas em marketing de IA.</strong></blockquote></div>
          </div>
        </section>

        <aside className="workshop-diagnostic" aria-labelledby="titulo-diagnostico">
          <div className="workshop-shell workshop-diagnostic__inner">
            <div><p className="workshop-kicker">CONHEÇA SEU PONTO DE PARTIDA</p><h2 id="titulo-diagnostico">Antes do workshop, realize o <em>Diagnóstico PráxIA.</em></h2></div>
            <div><p>Uma leitura gratuita da sua fluência digital e em IA, com forças, pontos de atenção e um próximo passo possível para a prática docente.</p><a href="/radar-docente">Realizar o Diagnóstico <span aria-hidden="true">→</span></a></div>
          </div>
        </aside>

        <section className="workshop-final" id="lista-de-espera" aria-labelledby="titulo-lista"><div className="workshop-shell workshop-final__grid"><div><p className="workshop-kicker">SE FIZER SENTIDO PARA VOCÊ</p><h2 id="titulo-lista">Ajude a construir um workshop que responda a <em>dúvidas reais.</em></h2><p>Seu interesse e sua pergunta vão orientar formato, exemplos e aprofundamento. Quando a data for definida, você será uma das primeiras pessoas a saber.</p></div><WorkshopWaitlistForm /></div></section>
      </main>
      <footer className="workshop-footer"><div className="workshop-shell"><div><a href="/"><BrandMark inverse /></a><p>Transforme fluência em prática docente.</p></div><div className="workshop-footer__links"><a href="https://www.radarpraxia.com">radarpraxia.com</a><a href="https://www.instagram.com/radarpraxia" target="_blank" rel="noreferrer"><Instagram aria-hidden="true" /> @radarpraxia</a><a href="https://www.linkedin.com/company/radarpraxia" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn</a></div></div><div className="workshop-shell workshop-footer__bottom"><span>© {new Date().getFullYear()} PráxIA</span><span>Pesquisa, contexto e prática docente.</span></div></footer>
    </div>
  )
}
