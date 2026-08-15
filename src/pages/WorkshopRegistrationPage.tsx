import { useEffect, useState } from 'react'
import { ArrowRight, Award, BookOpen, CalendarDays, CheckCircle2, Clock3, Instagram, Layers3, LineChart, Linkedin, Monitor, Quote, ReceiptText } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { Seo } from '../components/Seo'
import { WorkshopRegistrationForm } from '../components/WorkshopRegistrationForm'
import { WorkshopWaitlistForm } from '../components/WorkshopWaitlistForm'
import { team } from '../data/team'
import { loadWorkshopEdition } from '../services/workshopRegistrationService'
import type { WorkshopEdition } from '../types/workshopRegistration'

const fallback: WorkshopEdition = { id: '', slug: 'ia-pratica-docente-2026-08-29', titulo: 'WORKSHOP | IA para Prática Docente', descricao: 'Uma conversa prática para transformar tecnologia em decisões pedagógicas melhores.', inicio_em: '2026-08-29T11:30:00.000Z', fim_em: '2026-08-29T15:30:00.000Z', timezone: 'America/Sao_Paulo', valor: 50, carga_horaria: 4, status: 'inscricoes_abertas', limite_vagas: null }

const workshopTopics = [
  { number: '01', icon: Layers3, title: 'Fluência real × uso superficial de IA', text: 'Reconheça a diferença entre apenas operar uma ferramenta e tomar decisões pedagógicas mais conscientes com ela.' },
  { number: '02', icon: LineChart, title: 'O que a pesquisa mostra', text: 'Compreenda como maturidade digital, inovatividade e contexto se relacionam com a prática em sala de aula.' },
  { number: '03', icon: BookOpen, title: 'Da teoria ao plano de aula', text: 'Transforme possibilidades da IA em intenção pedagógica, atividade, mediação e critérios de avaliação.' },
]

function editionLabels(edition: WorkshopEdition) {
  const date = new Intl.DateTimeFormat('pt-BR', { timeZone: edition.timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(edition.inicio_em))
  const hour = (value: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: edition.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date(value)).replace(':', 'h')
  return { date: date.charAt(0).toUpperCase() + date.slice(1), time: `${hour(edition.inicio_em)} às ${hour(edition.fim_em)}` }
}

export function WorkshopRegistrationPage() {
  const [edition, setEdition] = useState(fallback)
  useEffect(() => { loadWorkshopEdition().then(setEdition).catch(() => undefined) }, [])
  const labels = editionLabels(edition)
  return <div className="workshop-page workshop-registration-page">
    <Seo title="Inscrições do Workshop IA para Prática Docente | PraxIA" description="Inscreva-se no Workshop IA para Prática Docente, online, em 29 de agosto de 2026. Formação de 4 horas com certificado." path="/lp/workshop-ia-2026/inscricoes" />
    <a className="skip-link" href="#conteudo-inscricoes">Pular para o conteúdo</a>
    <header className="workshop-header"><div className="workshop-shell"><a href="/" aria-label="PraxIA — página inicial"><BrandMark inverse /></a><a href="#inscricao">Inscrever-se <span aria-hidden="true">↘</span></a></div></header>
    <main id="conteudo-inscricoes">
      <section className="workshop-registration-hero"><div className="workshop-orbit" aria-hidden="true"><i /><i /><i /></div><div className="workshop-shell workshop-registration-hero__grid">
        <div><p className="workshop-tag"><span /> INSCRIÇÕES ABERTAS</p><h1>IA para <em>Prática Docente</em></h1><p>{edition.descricao}</p><div className="workshop-registration-facts">
          <span><CalendarDays aria-hidden="true" /><b>{labels.date}</b></span><span><Clock3 aria-hidden="true" /><b>{labels.time}</b></span><span><Monitor aria-hidden="true" /><b>Online</b></span><span><Award aria-hidden="true" /><b>{edition.carga_horaria} horas · Certificado</b></span>
        </div><a className="workshop-registration-primary" href="#inscricao">QUERO ME INSCREVER — R$ {Number(edition.valor).toFixed(0)}<ArrowRight aria-hidden="true" /></a></div>
        <aside><span>INVESTIMENTO</span><strong>R$ {Number(edition.valor).toFixed(2).replace('.', ',')}</strong><p>Pagamento via Pix ou cartão</p><i /><small>Certificado após participação confirmada</small></aside>
      </div></section>
      <section className="workshop-registration-details"><div className="workshop-shell"><p className="workshop-kicker">O ENCONTRO</p><div className="workshop-section-heading"><h2>Quatro horas para transformar possibilidades em <em>decisões pedagógicas.</em></h2><p>Critério, contexto e prática para integrar IA sem perder de vista autoria, aprendizagem e responsabilidade docente.</p></div><div className="workshop-registration-cards">
        <article><span>01</span><h3>Fluência real</h3><p>Reconheça a diferença entre operar uma ferramenta e tomar decisões pedagógicas conscientes.</p></article><article><span>02</span><h3>Critério pedagógico</h3><p>Analise possibilidades da IA a partir dos objetivos de aprendizagem e das condições reais da turma.</p></article><article><span>03</span><h3>Aplicação prática</h3><p>Converta intenção em planejamento, atividade, mediação e critérios de avaliação.</p></article>
      </div></div></section>
      <section className="workshop-topics" aria-labelledby="conteudo-workshop"><div className="workshop-shell"><p className="workshop-kicker">O QUE VAMOS TRABALHAR</p><div className="workshop-section-heading"><h2 id="conteudo-workshop">Um encontro para pensar antes de <em>automatizar.</em></h2><p>Sem receitas prontas ou catálogos de ferramentas. Vamos relacionar evidências, contexto e decisões que cabem na realidade de quem ensina.</p></div><div className="workshop-topic-grid">{workshopTopics.map(({ number, icon: Icon, title, text }) => <article key={number}><div><span>{number}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="workshop-origin" aria-labelledby="origem-workshop"><div className="workshop-shell workshop-origin__grid"><div className="workshop-origin__photo"><img src="/workshop-ia-docentes.webp" alt="Três educadores analisam juntos uma atividade em um computador" width="900" height="1100" loading="lazy" decoding="async" /><span>Educação em primeiro plano</span></div><div className="workshop-origin__copy"><p className="workshop-kicker">POR QUE ESTE WORKSHOP EXISTE</p><h2 id="origem-workshop">Pesquisa que volta para a <em>sala de aula.</em></h2><p>O PraxIA nasceu de uma pesquisa de mestrado em Sistemas Produtivos, na UNIPLAC, sobre a correlação entre maturidade digital e inovatividade. O estudo ajudou a tornar visível algo que educadores percebem na prática: acesso à tecnologia, sozinho, não produz inovação pedagógica.</p><p>Este workshop traduz essa investigação em escolhas de planejamento, aplicação e avaliação que respeitam os objetivos de aprendizagem e as condições reais de cada turma.</p><blockquote><Quote aria-hidden="true" /><strong>Criado por educadores e pesquisadores para quem precisa transformar possibilidades em prática docente.</strong></blockquote></div></div></section>
      <section className="workshop-teachers" aria-labelledby="professores-workshop"><div className="workshop-shell"><p className="workshop-kicker">QUEM CONDUZ O ENCONTRO</p><div className="workshop-section-heading"><h2 id="professores-workshop">Professores que pesquisam e vivem a <em>prática docente.</em></h2><p>Experiências complementares em educação, tecnologia, design e inovação para uma conversa conectada ao cotidiano de quem ensina.</p></div><div className="workshop-teachers__grid">{team.map((teacher) => <article key={teacher.id}><img src={teacher.photo?.src} alt={teacher.photo?.alt || `Retrato de ${teacher.name}`} width={teacher.photo?.width} height={teacher.photo?.height} loading="lazy" /><div><span>PROFESSOR E PESQUISADOR</span><h3>{teacher.name}</h3><p>{teacher.fullBio}</p><div>{teacher.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowRight aria-hidden="true" /></a>)}</div></div></article>)}</div></div></section>
      <section className="workshop-radar-cta" aria-labelledby="radar-workshop"><div className="workshop-shell workshop-radar-cta__grid"><div><p className="workshop-kicker">CONHEÇA SEU PONTO DE PARTIDA</p><h2 id="radar-workshop">Faça o Radar PraxIA antes do workshop.</h2><p>Em aproximadamente oito minutos, receba uma leitura gratuita da sua fluência digital e em IA: score, seis dimensões, forças, pontos de atenção e um próximo passo possível.</p></div><a href="/radar-docente">FAZER O DIAGNÓSTICO GRATUITO<ArrowRight aria-hidden="true" /></a></div></section>
      <section className="workshop-registration-checkout" id="inscricao"><div className="workshop-shell workshop-registration-checkout__grid"><div><p className="workshop-kicker">SUA VAGA</p><h2>Inscrição simples, confirmação segura.</h2><ol><li><span>1</span>Preencha seus dados</li><li><span>2</span>Pague no ambiente ASAAS</li><li><span>3</span>Receba a confirmação e o link do Meet</li></ol><p><CheckCircle2 aria-hidden="true" /> O certificado será emitido após a confirmação de presença no encontro.</p></div><WorkshopRegistrationForm /></div></section>
      <section className="workshop-registration-waitlist"><div className="workshop-shell workshop-registration-waitlist__grid"><div><p className="workshop-kicker">OUTRAS TURMAS</p><h2>Não consegue participar nesta data?</h2><p>Cadastre seu interesse. Teremos uma nova turma em breve.</p></div><WorkshopWaitlistForm compact submitLabel="Quero saber da próxima turma" /></div></section>
    </main>
    <footer className="workshop-footer"><div className="workshop-shell"><div><a href="/"><BrandMark inverse /></a><p>Transforme fluência em prática docente.</p></div><div className="workshop-footer__links"><a href="https://www.radarpraxia.com">radarpraxia.com</a><a href="https://www.instagram.com/radarpraxia" target="_blank" rel="noreferrer"><Instagram aria-hidden="true" /> @radarpraxia</a><a href="https://www.linkedin.com/company/radarpraxia" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn</a></div></div><div className="workshop-shell workshop-footer__bottom"><span>© {new Date().getFullYear()} PraxIA</span><span><ReceiptText aria-hidden="true" /> Inscrição processada com segurança.</span></div></footer>
  </div>
}
