import {
  ArrowDown,
  BookOpenCheck,
  Compass,
  FileText,
  Gauge,
  Layers3,
  Linkedin,
  MessageCircleMore,
  Route,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react'
import { ButtonLink } from '../components/ButtonLink'
import { Footer } from '../components/Footer'
import { RadarGraphic } from '../components/RadarGraphic'
import { ScorePraxia } from '../components/ScorePraxia'
import { SiteHeader } from '../components/SiteHeader'
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

export function LandingPage() {
  useScrollMotion()

  return (
    <>
      <main>
        <section className="hero" id="inicio">
          <div className="hero__glow" aria-hidden="true" />
          <div className="shell">
            <SiteHeader />
            <div className="hero__grid">
              <div className="hero__content" data-reveal="up">
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
              <ButtonLink href="/radar" showArrow>Fazer o Radar gratuito</ButtonLink>
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

        <section className="section about" id="sobre">
          <div className="shell about__grid">
            <div className="about__portrait" aria-hidden="true" data-reveal="left">
              <BookOpenCheck />
              <span>PN</span>
              <div className="about__path" />
            </div>
            <div data-reveal="right">
              <p className="eyebrow eyebrow--dark">QUEM ESTÁ POR TRÁS</p>
              <div className="about__name">
                <h2>Patrick Naufel</h2>
                <div className="about__links">
                  <a
                    href="https://www.linkedin.com/in/patricknaufel"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn de Patrick Naufel, abre em uma nova aba"
                  >
                    <Linkedin aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="http://lattes.cnpq.br/0026328778886854"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Currículo Lattes de Patrick Naufel, abre em uma nova aba"
                  >
                    <FileText aria-hidden="true" />
                    <span>Currículo Lattes</span>
                  </a>
                </div>
              </div>
              <p className="about__role">Professor, pesquisador e mentor.</p>
              <p>A PráxIA nasce da vontade de aproximar tecnologia, inteligência artificial e prática pedagógica sem perder de vista o que importa: as pessoas, o contexto e a aprendizagem.</p>
              <p>Uma iniciativa independente para ajudar professores a transformar curiosidade em escolha consciente — e fluência em prática.</p>
            </div>
          </div>
        </section>

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
