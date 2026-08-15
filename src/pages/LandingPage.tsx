import {
  ArrowDown,
  Compass,
  Gauge,
  Layers3,
  MessageCircleMore,
  Route,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react'
import { ButtonLink } from '../components/ButtonLink'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { RadarGraphic } from '../components/RadarGraphic'
import { ScorePraxia } from '../components/ScorePraxia'
import { SiteHeader } from '../components/SiteHeader'
import { Seo } from '../components/Seo'
import { CommercialSolutions } from '../components/CommercialSolutions'
import { RecentArticles } from '../components/RecentArticles'
import { TeamProfiles } from '../components/TeamProfiles'
import { team } from '../data/team'
import { useScrollMotion } from '../hooks/useScrollMotion'

const benefits = [
  { icon: Gauge, title: 'Score de Fluência', text: 'Uma síntese clara do seu momento atual — sem comparação com outros professores.' },
  { icon: Layers3, title: 'Radar com seis dimensões', text: 'Uma visão ampla de como tecnologia e IA aparecem no seu fazer docente.' },
  { icon: UserRoundSearch, title: 'Leitura personalizada', text: 'Forças e pontos de atenção traduzidos para o seu contexto de atuação.' },
  { icon: Compass, title: 'Próximo passo recomendado', text: 'Uma ação possível para avançar com intenção, no seu ritmo.' },
]

const dimensions = [
  ['01', 'Planejamento e curadoria', 'Selecionar recursos, organizar percursos e tomar decisões informadas.'],
  ['02', 'Criação de experiências', 'Desenhar propostas que ampliem participação, autoria e aprendizagem.'],
  ['03', 'Mediação e colaboração', 'Promover diálogo, cooperação e presença docente em ambientes digitais.'],
  ['04', 'Avaliação e feedback', 'Acompanhar processos e oferecer devolutivas que façam avançar.'],
  ['05', 'Integração pedagógica da IA', 'Usar IA com propósito, criticidade e coerência com os objetivos de aprendizagem.'],
  ['06', 'Ética, segurança e autoria', 'Cuidar de dados, transparência, vieses e responsabilidade autoral.'],
]

const steps = [
  ['01', 'Responda', 'Reflita sobre situações reais da sua prática. Leva aproximadamente 8 minutos.'],
  ['02', 'Receba sua leitura', 'Veja seu score, radar e uma interpretação contextualizada das seis dimensões.'],
  ['03', 'Escolha o próximo passo', 'Parta de uma recomendação viável e conheça conteúdos ou mentorias alinhados ao resultado.'],
]

const homeFaq = [
  {
    question: 'O que o Radar Docente avalia?',
    answer: 'O Radar organiza um autorrelato sobre seis dimensões da fluência digital e em IA: planejamento e curadoria, criação de experiências, mediação e colaboração, avaliação e feedback, integração pedagógica da IA e ética, segurança e autoria.',
  },
  {
    question: 'Preciso conhecer ferramentas de inteligência artificial?',
    answer: 'Não. As perguntas partem de decisões pedagógicas e situações do cotidiano. O Radar acolhe tanto quem está começando quanto quem já utiliza recursos digitais e IA com frequência.',
  },
  {
    question: 'O resultado é uma avaliação do meu desempenho?',
    answer: 'Não. O resultado é orientativo e baseado em autorrelato. Ele não constitui prova, ranking, diagnóstico ou certificação e não compara você com outros professores.',
  },
  {
    question: 'Quanto tempo leva e o que recebo ao final?',
    answer: 'A experiência leva aproximadamente oito minutos. Ao final, você recebe o Score PráxIA, um radar com seis dimensões, interpretações contextualizadas e um próximo experimento, além da opção de exportar o relatório completo em PDF.',
  },
  {
    question: 'Minhas respostas ficam armazenadas?',
    answer: 'Nesta versão, a sessão permanece no seu navegador e nada é transmitido para um servidor. Você pode reiniciar o Radar e apagar o progresso quando quiser.',
  },
]

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'PráxIA',
      url: 'https://www.radarpraxia.com/',
      inLanguage: 'pt-BR',
      description: 'Radar de Fluência Digital e IA para professores.',
    },
    {
      '@type': 'WebApplication',
      name: 'PráxIA',
      description: 'Radar gratuito de fluência digital e IA para transformar conhecimento em prática docente.',
      url: 'https://www.radarpraxia.com/',
      applicationCategory: 'EducationalApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    },
    {
      '@type': 'Organization',
      name: 'PráxIA',
      url: 'https://www.radarpraxia.com/',
      member: team.map((member) => ({
        '@type': 'Person',
        name: member.name,
        sameAs: member.links.map((link) => link.href),
      })),
    },
    {
      '@type': 'WebPage',
      name: 'PráxIA — Radar de Fluência Digital e IA',
      url: 'https://www.radarpraxia.com/',
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'WebSite', name: 'PráxIA', url: 'https://www.radarpraxia.com/' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: homeFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export function LandingPage() {
  useScrollMotion()

  return (
    <>
      <Seo
        title="PráxIA: Radar de Fluência Digital e IA para professores"
        description="Reconheça como tecnologia e IA aparecem na sua prática docente. Receba um score explicado, radar de seis dimensões e próximo passo gratuito."
        path="/"
        jsonLd={homeSchema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <main id="conteudo-principal">
        <section className="hero" id="inicio">
          <div className="hero__glow" aria-hidden="true" />
          <div className="shell">
            <SiteHeader />
            <div className="hero__grid">
              <div className="hero__content">
                <p className="eyebrow"><span /> Radar gratuito <i /> aproximadamente 8 minutos</p>
                <h1>Como sua fluência digital aparece na <em>prática docente?</em></h1>
                <p className="hero__lead">Descubra forças, pontos de atenção e um próximo passo possível — com IA incluída, sem tecnicismo.</p>
                <div className="hero__actions">
                  <ButtonLink href="/radar" variant="light" showArrow>Descobrir meu perfil</ButtonLink>
                  <ButtonLink href="#como-funciona" variant="secondary">Entender como funciona <ArrowDown aria-hidden="true" size={17} /></ButtonLink>
                </div>
                <p className="hero__note">Leitura orientativa baseada em autorrelato. Não é prova, ranking ou certificação.</p>
              </div>
              <div className="hero__visual" data-reveal="scale">
                <RadarGraphic labelled />
                <span className="orbit-label orbit-label--one">CONTEXTO</span>
                <span className="orbit-label orbit-label--two">EVIDÊNCIAS</span>
                <span className="orbit-label orbit-label--three">PRÁTICA</span>
              </div>
            </div>
          </div>
        </section>

        <div className="audiences" aria-label="Público">
          <div className="shell audiences__inner">
            <span>Para quem ensina no</span>
            <strong>Ensino Fundamental</strong><i />
            <strong>Ensino Médio</strong><i />
            <strong>Ensino Superior</strong>
          </div>
        </div>

        <section className="home-workshop" aria-labelledby="home-workshop-title">
          <div className="shell home-workshop__inner" data-reveal="up">
            <div className="home-workshop__signal" aria-hidden="true"><Sparkles /></div>
            <div className="home-workshop__copy">
              <p className="eyebrow"><span /> 29/08 - 8h30 <i /> VAGAS LIMITADAS</p>
              <h2 id="home-workshop-title">Workshop na <em>Prática Docente</em></h2>
              <p>Um encontro para transformar possibilidades da IA em escolhas pedagógicas mais conscientes, aplicáveis e coerentes com a realidade de quem ensina.</p>
            </div>
            <ButtonLink href="/lp/workshop-ia-2026/inscricoes" variant="light" showArrow>Inscreva-se já</ButtonLink>
          </div>
        </section>

        <section className="section section--benefits" id="o-que-voce-recebe">
          <div className="shell">
            <div className="section-heading" data-reveal="up">
              <div><p className="eyebrow eyebrow--dark">O QUE VOCÊ RECEBE</p><h2>Um retrato para orientar,<br />não para julgar.</h2></div>
              <p>O Radar transforma suas respostas em uma leitura útil sobre como sua fluência aparece no planejamento, na mediação, na avaliação e nas escolhas que envolvem IA.</p>
            </div>
            <div className="benefit-grid">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article className="benefit-card" key={title} data-reveal="up">
                  <span className="benefit-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section result-preview" id="resultado">
          <div className="shell result-preview__grid">
            <div className="result-preview__copy" data-reveal="left">
              <p className="eyebrow eyebrow--dark">PRÉVIA DO RESULTADO</p>
              <h2>Seis dimensões.<br /><em>Uma leitura integrada.</em></h2>
              <p>Mais que um número, você recebe contexto para compreender o que já faz bem e onde pode avançar.</p>
              <div className="result-preview__actions">
                <ButtonLink href="/radar" showArrow>Fazer o Radar gratuito</ButtonLink>
                <ButtonLink href="/resultado" variant="secondary">Ver exemplo completo</ButtonLink>
              </div>
            </div>
            <ScorePraxia />
          </div>
        </section>

        <section className="section explain-score">
          <div className="shell explain-score__inner">
            <div className="explain-score__symbol" data-reveal="scale"><span>72</span><i /><i /><i /></div>
            <div data-reveal="right">
              <p className="eyebrow">NOSSO COMPROMISSO</p>
              <h2>Um score que explica,<br /><em>não rotula.</em></h2>
              <p>Seu resultado não mede valor, competência absoluta ou desempenho. Ele organiza percepções sobre sua prática para apoiar reflexão e escolha.</p>
              <ul>
                <li><span>01</span> Baseado em autorrelato</li>
                <li><span>02</span> Sensível ao contexto</li>
                <li><span>03</span> Voltado para desenvolvimento</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section dimensions">
          <div className="shell">
            <div className="section-heading section-heading--compact" data-reveal="up">
              <div><p className="eyebrow eyebrow--dark">AS SEIS DIMENSÕES</p><h2>A prática docente<br />vista por vários ângulos.</h2></div>
              <p>Cada dimensão revela um aspecto diferente — e complementar — da fluência digital e em IA.</p>
            </div>
            <div className="dimension-grid">
              {dimensions.map(([number, title, text]) => (
                <article className="dimension-card" key={number} data-reveal="up">
                  <span>{number}</span><h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section how-it-works" id="como-funciona">
          <div className="shell">
            <div data-reveal="up">
              <p className="eyebrow eyebrow--dark">COMO FUNCIONA</p>
              <h2>Da reflexão à ação<br />em três movimentos.</h2>
            </div>
            <div className="steps">
              {steps.map(([number, title, text], index) => (
                <article className="step" key={number} data-reveal="up">
                  <div className="step__number">{number}</div>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  {index < 2 && <Route aria-hidden="true" />}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section home-trust" id="por-que-confiar">
          <div className="shell home-trust__grid">
            <div data-reveal="left">
              <p className="eyebrow eyebrow--dark">POR QUE CONFIAR</p>
              <h2>Critérios claros.<br />Limites <em>explícitos.</em></h2>
              <p>O Radar foi construído para apoiar reflexão, não para produzir uma aparência de precisão que o instrumento não pode sustentar.</p>
              <ButtonLink href="/metodologia" showArrow>Conhecer a metodologia</ButtonLink>
            </div>
            <div className="home-trust__principles">
              <article data-reveal="up"><span>01</span><h3>Cálculo transparente</h3><p>A pontuação segue regras determinísticas e documentadas. Nenhuma resposta é interpretada por uma IA generativa.</p></article>
              <article data-reveal="up"><span>02</span><h3>Instrumento em validação</h3><p>A versão atual é beta. O resultado não é apresentado como diagnóstico, certificação ou evidência científica concluída.</p></article>
              <article data-reveal="up"><span>03</span><h3>Privacidade desde o início</h3><p>Nesta etapa, respostas e resultado permanecem no navegador. Você mantém controle sobre seu progresso.</p></article>
            </div>
          </div>
        </section>

        <RecentArticles />

        <CommercialSolutions />

        <section className="section about" id="sobre">
          <div className="shell home-team">
            <div className="home-team__heading" data-reveal="up">
              <p className="eyebrow eyebrow--dark">QUEM SOMOS</p>
              <h2>Educação, tecnologia e prática docente</h2>
              <p>A PráxIA é conduzida pelos professores Patrick Naufel e Giovani Letti, reunindo experiências em educação, comunicação, design, tecnologia e inovação.</p>
            </div>
            <TeamProfiles compact showPhotos />
            <ButtonLink href="/para-instituicoes#quem-somos" showArrow>Conheça a PráxIA</ButtonLink>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={homeFaq} title="Perguntas antes de começar" />
        </div>

        <section className="final-cta">
          <div className="final-cta__orbit" aria-hidden="true"><Sparkles /><MessageCircleMore /></div>
          <div className="shell final-cta__inner" data-reveal="up">
            <p className="eyebrow">SEU PRÓXIMO PASSO COMEÇA AQUI</p>
            <h2>Reconheça onde você está.<br /><em>Descubra para onde avançar.</em></h2>
            <p>Reserve cerca de 8 minutos para olhar sua prática por novos ângulos.</p>
            <ButtonLink href="/radar" variant="light" showArrow>Fazer o Radar gratuito</ButtonLink>
            <small>Gratuito • Resultado personalizado • Sem ranking</small>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
