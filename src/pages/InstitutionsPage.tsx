import { ArrowDown, Check, Mic2, Route, UsersRound } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { InstitutionalLeadForm } from '../components/InstitutionalLeadForm'
import { TeamProfiles } from '../components/TeamProfiles'
import { Seo } from '../components/Seo'
import { institutionalProcess, institutionalThemes, lectureApplications, workshopExpectedResults } from '../data/institutionalSolutions'
import { team, teamIntroduction } from '../data/team'
import { trackCommercialEvent } from '../services/commercialAnalytics'
import { useScrollMotion } from '../hooks/useScrollMotion'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Palestras e workshops PraxIA para instituições',
  provider: {
    '@type': 'Organization',
    name: 'PraxIA',
    url: 'https://radarpraxia.com/',
    member: team.map((member) => ({
      '@type': 'Person',
      name: member.name,
      sameAs: member.links.map((link) => link.href),
    })),
  },
  areaServed: 'Brasil',
  audience: { '@type': 'EducationalAudience', educationalRole: 'educator' },
  description: 'Formações sobre fluência digital, inteligência artificial e prática docente para instituições educacionais.',
}

export function InstitutionsPage() {
  useScrollMotion()
  useEffect(() => trackCommercialEvent('view_institutional_page', { audience: 'institutions', source_page: '/para-instituicoes' }), [])

  return (
    <>
      <Seo title="Palestras e Workshops para Professores | PraxIA" description="Palestras e workshops sobre fluência digital, inteligência artificial e prática docente para escolas, faculdades e organizações educacionais." path="/para-instituicoes" jsonLd={schema} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="institutions" />
      <main id="conteudo-principal" className="institutions-page">
        <section className="institutions-hero">
          <div className="shell institutions-hero__grid">
            <div>
              <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><span>/</span><span aria-current="page">Para instituições</span></nav>
              <p className="eyebrow">PRAXIA PARA INSTITUIÇÕES</p>
              <h1>Formação docente para transformar tecnologia em <em>prática pedagógica.</em></h1>
              <p>Palestras e workshops para escolas, faculdades e organizações que desejam desenvolver fluência digital, pensamento crítico e integração responsável da inteligência artificial à educação.</p>
              <div className="institutions-hero__actions"><ButtonLink href="#solicitar-proposta" variant="light" showArrow>Solicitar uma proposta</ButtonLink><ButtonLink href="#formatos" variant="secondary">Conhecer os formatos<ArrowDown aria-hidden="true" /></ButtonLink></div>
            </div>
            <div className="institutions-visual" aria-hidden="true"><span /><span /><span /><i /><i /><b>prática</b></div>
          </div>
        </section>

        <section className="section institutions-challenge">
          <div className="shell institutions-challenge__grid">
            <div data-reveal="left"><p className="eyebrow eyebrow--dark">O DESAFIO</p><h2>Adotar ferramentas não é o mesmo que <em>transformar a aprendizagem.</em></h2></div>
            <div data-reveal="right"><p>Instituições não precisam apenas de demonstrações de ferramentas. Precisam de formação que ajude professores a relacionar tecnologia às decisões que sustentam uma experiência de aprendizagem.</p><ul>{['Objetivos de aprendizagem e planejamento', 'Criação de experiências', 'Avaliação e feedback', 'Pensamento crítico', 'Ética, autoria e segurança', 'Integração pedagógica da IA'].map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
          </div>
        </section>

        <section className="section institutional-formats" id="formatos">
          <div className="shell">
            <div className="section-heading" data-reveal="up"><div><p className="eyebrow eyebrow--dark">FORMATOS</p><h2>Uma conversa que mobiliza.<br />Uma oficina que <em>coloca em prática.</em></h2></div><p>Conteúdo e formato são ajustados ao público, aos objetivos e ao contexto da instituição. As atividades são conduzidas pessoalmente pelos professores Patrick Naufel e Giovani Letti.</p></div>
            <article className="format-editorial" id="palestras" data-reveal="up">
              <div className="format-editorial__title"><Mic2 aria-hidden="true" /><span>PALESTRA · 60 A 90 MINUTOS</span><h3>Fluência digital docente em tempos de IA</h3><p>Uma experiência de sensibilização, reflexão e mobilização para equipes educacionais.</p></div>
              <div><h4>Temas adaptáveis</h4><ul>{['O que realmente muda na docência com a IA', 'Intenção pedagógica antes da ferramenta', 'Pensamento crítico e autoria', 'Ética, transparência e supervisão humana', 'Caminhos para desenvolver fluência digital docente'].map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h4>Aplicação indicada</h4><ul>{lectureApplications.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </article>
            <article className="format-editorial format-editorial--lime" id="workshops" data-reveal="up">
              <div className="format-editorial__title"><UsersRound aria-hidden="true" /><span>WORKSHOP · PRESENCIAL OU ON-LINE</span><h3>IA na prática docente: do recurso à intenção pedagógica</h3><p>Formação aplicada na qual professores experimentam abordagens, analisam situações e desenvolvem propostas para seu próprio contexto.</p></div>
              <div><h4>Formatos</h4><ul><li><strong>2 horas:</strong> sensibilização e primeiro experimento</li><li><strong>4 horas:</strong> formação prática e produção orientada</li><li><strong>8 horas:</strong> oficina completa com aplicação, compartilhamento e reflexão</li></ul></div>
              <div><h4>Resultados esperados</h4><p>A formação busca favorecer:</p><ul>{workshopExpectedResults.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </article>
          </div>
        </section>

        <section className="section institutional-themes">
          <div className="shell"><div className="section-heading section-heading--compact"><div><p className="eyebrow eyebrow--dark">TEMAS PERSONALIZÁVEIS</p><h2>Um campo de formação conectado às necessidades da equipe.</h2></div></div><div className="institutional-themes__grid">{institutionalThemes.map((theme, index) => <article key={theme} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><h3>{theme}</h3></article>)}</div></div>
        </section>

        <section className="section institutional-process">
          <div className="shell"><p className="eyebrow">COMO FUNCIONA</p><h2>Da necessidade à continuidade,<br /><em>em cinco movimentos.</em></h2><ol>{institutionalProcess.map((step, index) => <li key={step} data-reveal="up"><span>{index + 1}</span><p>{step}</p>{index < 4 && <Route aria-hidden="true" />}</li>)}</ol></div>
        </section>

        <section className="section institutional-authority" id="quem-somos">
          <div className="shell">
            <div className="institutional-authority__heading" data-reveal="up">
              <p className="eyebrow eyebrow--dark">QUEM ESTÁ À FRENTE DA PRAXIA</p>
              <h2>Educação, tecnologia e prática docente</h2>
              <p>{teamIntroduction}</p>
            </div>
            <TeamProfiles showPhotos />
          </div>
        </section>

        <section className="institutional-proposal" id="solicitar-proposta">
          <div className="shell institutional-proposal__grid">
            <div><p className="eyebrow">SOLICITAR PROPOSTA</p><h2>Vamos conversar sobre sua instituição?</h2><p id="form-intro">Conte um pouco sobre a necessidade da sua equipe. A proposta será preparada de acordo com o público, o formato e os objetivos da instituição.</p><p><strong>Prefere escrever diretamente?</strong><br /><a href="mailto:praxia@radarpraxia.com">praxia@radarpraxia.com</a></p></div>
            <InstitutionalLeadForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
