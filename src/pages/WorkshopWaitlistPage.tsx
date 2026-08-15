import { useState } from 'react'
import { BookOpen, Instagram, Layers3, LineChart, Linkedin, Quote } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Seo } from '../components/Seo'
import { WorkshopWaitlistForm } from '../components/WorkshopWaitlistForm'
import '../workshopWaitlist.css'

const topics = [
  { number: '01', icon: Layers3, title: 'Fluência real × uso superficial de IA', text: 'Como reconhecer a diferença entre apenas operar uma ferramenta e tomar decisões pedagógicas mais conscientes com ela.' },
  { number: '02', icon: LineChart, title: 'Critério pedagógico em um cenário de mudança', text: 'Como analisar possibilidades da IA sem perder de vista objetivos de aprendizagem, contexto e responsabilidade docente.' },
  { number: '03', icon: BookOpen, title: 'Da teoria ao plano de aula', text: 'Um caminho aplicado para transformar possibilidades da IA em intenção pedagógica, atividade e critérios de avaliação.' },
]

type Props = { registered?: boolean }

export function WorkshopWaitlistPage({ registered = false }: Props) {
  const navigate = useNavigate()
  const [interestRegistered, setInterestRegistered] = useState(registered)

  function handleSuccess() {
    setInterestRegistered(true)
    navigate('/lp/workshop-ia-2026/inscrito', { replace: true })
  }

  return (
    <div className="workshop-page">
      <Seo title={registered ? 'Interesse registrado' : 'Workshop: IA na prática docente'} description={registered ? 'Seu interesse no workshop IA na prática docente foi registrado.' : 'Entre na lista de espera do workshop sobre fluência em IA, critérios pedagógicos e aplicação prática no planejamento docente.'} path={registered ? '/lp/workshop-ia-2026/inscrito' : '/lp/workshop-ia-2026'} robots={registered ? 'noindex, follow' : undefined} image="https://www.radarpraxia.com/social/workshop-ia-pratica-docente-lista-prioritaria-v2-1200x630.jpg" imageAlt="Arte do workshop IA na prática docente com chamada para entrar na lista prioritária" />
      <a className="skip-link" href="#conteudo-workshop">Pular para o conteúdo</a>
      <header className="workshop-header"><div className="workshop-shell"><a href="/" aria-label="PraxIA — página inicial"><BrandMark inverse /></a><a href="#lista-de-espera">Entrar na lista <span aria-hidden="true">↘</span></a></div></header>
      <main id="conteudo-workshop">
        <section className="workshop-hero">
          <div className="workshop-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="workshop-shell workshop-hero__grid">
            <div className="workshop-hero__copy">
              <p className="workshop-tag"><span /> EM BREVE</p>
              <h1>Workshop: <em>IA na prática docente</em></h1>
              <p>Antes de marcar a data, queremos saber: isso faz sentido para você?</p>
              <div className="workshop-hero__signal"><span>Critério</span><i /><span>Contexto</span><i /><span>Prática</span></div>
            </div>
            <WorkshopWaitlistForm compact submitLabel="Quero entrar na lista de espera" registered={registered} onSuccess={handleSuccess} />
          </div>
        </section>

        {interestRegistered && <aside className="workshop-diagnostic" aria-labelledby="titulo-diagnostico">
          <div className="workshop-shell workshop-diagnostic__inner">
            <div><p className="workshop-kicker">CONHEÇA SEU PONTO DE PARTIDA</p><h2 id="titulo-diagnostico">Antes do workshop, realize o <em>Diagnóstico PraxIA.</em></h2></div>
            <div><p>Uma leitura gratuita da sua fluência digital e em IA, com forças, pontos de atenção e um próximo passo possível para a prática docente.</p><div className="workshop-diagnostic__actions"><a href="/radar-docente">Realizar o Diagnóstico <span aria-hidden="true">→</span></a><a className="workshop-diagnostic__secondary" href="/">Conhecer o site PraxIA <span aria-hidden="true">→</span></a></div></div>
          </div>
        </aside>}

        <section className="workshop-topics" aria-labelledby="sobre-workshop">
          <div className="workshop-shell"><p className="workshop-kicker">SOBRE O WORKSHOP</p><div className="workshop-section-heading"><h2 id="sobre-workshop">Um encontro para pensar antes de <em>automatizar.</em></h2><p>Sem receitas prontas. Vamos olhar para evidências, contexto e decisões que cabem na realidade de quem ensina.</p></div>
          <div className="workshop-topic-grid">{topics.map(({ number, icon: Icon, title, text }) => <article key={number}><div><span>{number}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="workshop-instructors" aria-labelledby="titulo-instrutores">
          <div className="workshop-shell workshop-instructors__grid">
            <div className="workshop-instructors__photo">
              <img src="/workshop-facilitadores-patrick-giovani.png" alt="Patrick Naufel e Giovani Letti, facilitadores do workshop" width="1123" height="1401" loading="lazy" decoding="async" />
            </div>
            <div className="workshop-instructors__content">
              <p className="workshop-kicker">QUEM CONDUZ O WORKSHOP</p>
              <h2 id="titulo-instrutores">Uma formação entre educadores, <em>para educadores.</em></h2>
              <p className="workshop-instructors__intro">O workshop é conduzido por Patrick Naufel e Giovani Letti, profissionais que unem educação, design, inovação e uso responsável de tecnologias para apoiar decisões mais conscientes na prática docente.</p>
              <div className="workshop-instructors__bios">
                <article><h3>Patrick Naufel</h3><strong>Professor e pesquisador nas áreas de design centrado no usuário, inovação e transformação digital.</strong><p>Atua no ensino superior e técnico, desenvolvendo projetos que aproximam design, tecnologia, gestão e resolução de problemas reais. É mestrando em Engenharia e Gestão de Sistemas Produtivos, com pesquisa voltada à maturidade digital e à inovatividade organizacional.</p></article>
                <article><h3>Giovani Letti</h3><strong>Professor e pesquisador com formação interdisciplinar em comunicação, tecnologia e educação.</strong><p>É graduado em Comunicação Social, com habilitação em Publicidade e Propaganda, pela UFRGS, e mestre em Ciência da Computação, com ênfase em Sistemas de Conhecimento, pela UFSC. Atua como professor universitário e desenvolve trabalhos relacionados à aprendizagem, inovação e integração da tecnologia em diferentes contextos.</p></article>
              </div>
            </div>
            <p className="workshop-instructors__closing">Uma conversa prática para transformar tecnologia em decisões pedagógicas melhores.</p>
          </div>
        </section>

        <section className="workshop-origin" aria-labelledby="origem-workshop">
          <div className="workshop-shell workshop-origin__grid">
            <div className="workshop-origin__photo"><img src="/workshop-ia-docentes.webp" alt="Três educadores analisam juntos uma atividade em um computador" width="900" height="1100" loading="lazy" decoding="async" /><span>Educação em primeiro plano</span></div>
            <div className="workshop-origin__copy"><p className="workshop-kicker">POR QUE ESSE WORKSHOP EXISTE</p><h2 id="origem-workshop">Tecnologia só faz sentido quando encontra um <em>propósito pedagógico.</em></h2><p>Novas ferramentas de IA aparecem o tempo todo. Para quem ensina, porém, a questão central não é acompanhar cada novidade, mas compreender quando, por que e como usar esses recursos de forma coerente com a aprendizagem.</p><p>O workshop cria um espaço para analisar possibilidades, discutir limites e transformar intenção pedagógica em decisões aplicáveis ao planejamento, às atividades e à avaliação.</p><blockquote><Quote aria-hidden="true" /><strong>Criado por educadores e pesquisadores, que usam IA no dia-a-dia.</strong></blockquote></div>
          </div>
        </section>

        {!interestRegistered && <section className="workshop-final" id="lista-de-espera" aria-labelledby="titulo-lista"><div className="workshop-shell workshop-final__grid"><div><p className="workshop-kicker">SE FIZER SENTIDO PARA VOCÊ</p><h2 id="titulo-lista">Ajude a construir um workshop que responda a <em>dúvidas reais.</em></h2><p>Seu interesse e sua pergunta vão orientar formato, exemplos e aprofundamento. Quando a data for definida, você será uma das primeiras pessoas a saber.</p></div><WorkshopWaitlistForm onSuccess={handleSuccess} /></div></section>}
      </main>
      <footer className="workshop-footer"><div className="workshop-shell"><div><a href="/"><BrandMark inverse /></a><p>Transforme fluência em prática docente.</p></div><div className="workshop-footer__links"><a href="https://www.radarpraxia.com">radarpraxia.com</a><a href="https://www.instagram.com/radarpraxia" target="_blank" rel="noreferrer"><Instagram aria-hidden="true" /> @radarpraxia</a><a href="https://www.linkedin.com/company/radarpraxia" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn</a></div></div><div className="workshop-shell workshop-footer__bottom"><span>© {new Date().getFullYear()} PraxIA</span><span>Contexto, critério e prática docente.</span></div></footer>
    </div>
  )
}
