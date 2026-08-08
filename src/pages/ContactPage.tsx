import { FormEvent, useState } from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  Lightbulb,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FaqSection } from '../components/FaqSection'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { useScrollMotion } from '../hooks/useScrollMotion'
import { contactLeadService, validateContactLead } from '../services/publicLeadService'
import type { ContactLead, LeadErrors } from '../types/publicLead'

const contactEmail = 'praxia@radarpraxia.com'

const subjects = [
  { value: 'radar', label: 'Dúvida sobre o Radar Docente' },
  { value: 'metodologia', label: 'Metodologia e pesquisa' },
  { value: 'formacao', label: 'Formação ou mentoria' },
  { value: 'parceria', label: 'Parceria institucional' },
  { value: 'privacidade', label: 'Privacidade e dados' },
  { value: 'outro', label: 'Outro assunto' },
]

const contactReasons = [
  {
    icon: CircleHelp,
    title: 'Dúvidas sobre o Radar',
    text: 'Questões sobre acesso, respostas, interpretação do resultado ou exportação do relatório.',
  },
  {
    icon: BookOpenCheck,
    title: 'Metodologia e pesquisa',
    text: 'Conversas sobre o instrumento, suas dimensões, limitações e processo de validação.',
  },
  {
    icon: GraduationCap,
    title: 'Formação e mentoria',
    text: 'Interesse em experiências formativas ligadas à fluência digital, IA e prática pedagógica.',
  },
  {
    icon: Sparkles,
    title: 'Parcerias',
    text: 'Propostas coerentes com educação, desenvolvimento docente e uso responsável de tecnologia.',
  },
]

const contactFaq = [
  {
    question: 'O formulário envia minha mensagem diretamente pelo site?',
    answer: 'Sim. A mensagem é registrada de forma segura para que a equipe PráxIA possa responder pelo e-mail informado.',
  },
  {
    question: 'Posso enviar dúvidas sobre meu resultado?',
    answer: 'Sim. Para proteger sua privacidade, evite incluir respostas individuais ou informações pessoais de estudantes. Se necessário, descreva apenas a parte da devolutiva sobre a qual deseja conversar.',
  },
  {
    question: 'A PráxIA recebe propostas de parceria?',
    answer: 'Sim. Propostas são bem-vindas quando estão alinhadas ao desenvolvimento docente, à clareza metodológica e ao uso responsável de tecnologia e IA.',
  },
  {
    question: 'Onde encontro informações metodológicas antes de escrever?',
    answer: 'A página Metodologia explica o instrumento, as seis dimensões, o cálculo, as faixas de desenvolvimento e os limites da versão beta.',
  },
]

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      name: 'Contato PráxIA',
      description: 'Entre em contato com a PráxIA para dúvidas sobre o Radar Docente, metodologia, formação, pesquisa ou parcerias.',
      url: 'https://radar-docente-pi.vercel.app/contato',
      inLanguage: 'pt-BR',
      mainEntity: {
        '@type': 'Organization',
        name: 'PráxIA',
        email: contactEmail,
        url: 'https://radar-docente-pi.vercel.app/',
        contactPoint: {
          '@type': 'ContactPoint',
          email: contactEmail,
          contactType: 'customer support',
          availableLanguage: 'Portuguese',
        },
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radar-docente-pi.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Contato', item: 'https://radar-docente-pi.vercel.app/contato' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: contactFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export function ContactPage() {
  useScrollMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(subjects[0].value)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<LeadErrors<ContactLead>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting' || status === 'success') return
    const lead = { name, email, subject, message }
    const nextErrors = validateContactLead(lead)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      document.getElementById(`contact-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }
    setStatus('submitting')
    try {
      await contactLeadService.submit(lead)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Seo
        title="Contato"
        description="Fale com a PráxIA sobre o Radar Docente, metodologia, pesquisa, formação, privacidade ou propostas de parceria."
        path="/contato"
        jsonLd={contactSchema}
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="contact" />
      <main id="conteudo-principal" className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero__field" aria-hidden="true"><span /><span /><span /></div>
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Contato</span>
            </nav>
            <div className="contact-hero__grid">
              <div>
                <p className="method-kicker">VAMOS CONVERSAR</p>
                <h1>Uma boa conversa também começa por <em>contexto e intenção.</em></h1>
                <p>Escreva para tirar dúvidas, compartilhar uma questão metodológica ou apresentar uma proposta alinhada ao desenvolvimento docente e ao uso responsável de tecnologia.</p>
              </div>
              <a className="contact-hero__email" href={`mailto:${contactEmail}`} data-reveal="scale">
                <Mail aria-hidden="true" />
                <span>CANAL OFICIAL</span>
                <strong>{contactEmail}</strong>
                <small>Abrir no aplicativo de e-mail <ArrowRight aria-hidden="true" /></small>
              </a>
            </div>
          </div>
        </section>

        <nav className="method-index" aria-label="Nesta página">
          <div className="shell">
            <span>Nesta página</span>
            <a href="#assuntos">Assuntos</a>
            <a href="#mensagem">Enviar mensagem</a>
            <a href="#privacidade">Privacidade</a>
            <a href="#perguntas">FAQ</a>
          </div>
        </nav>

        <section className="contact-section contact-reasons" id="assuntos">
          <div className="shell">
            <div className="method-heading" data-reveal="up">
              <div><p className="method-kicker">COMO PODEMOS CONVERSAR</p><h2>Escolha o assunto que mais se aproxima da sua necessidade.</h2></div>
              <p>Se nenhuma opção representar exatamente sua mensagem, use “Outro assunto” no formulário.</p>
            </div>
            <div className="contact-reasons__grid">
              {contactReasons.map(({ icon: Icon, title, text }, index) => (
                <article key={title} data-reveal="up">
                  <div><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
                  <h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section contact-compose" id="mensagem">
          <div className="shell contact-compose__grid">
            <div data-reveal="left">
              <p className="method-kicker">ESCREVA SUA MENSAGEM</p>
              <h2>Conte o suficiente para situar a conversa.</h2>
              <p>Sua mensagem será registrada para que a equipe PráxIA possa responder pelo e-mail informado. Compartilhe apenas os dados necessários para contextualizar a conversa.</p>
              <div className="contact-compose__tip"><Lightbulb aria-hidden="true" /><span>Para dúvidas sobre resultado, indique a dimensão ou seção do relatório sem compartilhar respostas individuais.</span></div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__field">
                <label htmlFor="contact-name">Seu nome</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-error-name' : undefined} value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })) }} />
                {errors.name && <span className="form-error" id="contact-error-name">{errors.name}</span>}
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-email">Seu e-mail</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-error-email' : undefined} value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })) }} />
                {errors.email && <span className="form-error" id="contact-error-email">{errors.email}</span>}
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-subject">Assunto</label>
                <select id="contact-subject" name="subject" value={subject} onChange={(event) => { setSubject(event.target.value); setErrors((current) => ({ ...current, subject: undefined })) }}>
                  {subjects.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-message">Mensagem</label>
                <textarea id="contact-message" name="message" rows={7} minLength={20} value={message} onChange={(event) => { setMessage(event.target.value); setErrors((current) => ({ ...current, message: undefined })) }} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-help contact-error-message' : 'contact-message-help'} />
                <small id="contact-message-help">Inclua contexto e sua principal pergunta. Mínimo de 20 caracteres.</small>
                {errors.message && <span className="form-error" id="contact-error-message">{errors.message}</span>}
              </div>
              <p className="form-privacy-notice">Os dados informados serão utilizados para responder à sua solicitação e dar continuidade a este contato. Saiba mais na <a href="/privacidade">Política de Privacidade</a>.</p>
              <button type="submit" disabled={status === 'submitting' || status === 'success'}>
                {status === 'submitting' ? 'Enviando…' : status === 'success' ? 'Mensagem enviada' : 'Enviar mensagem'} <ArrowRight aria-hidden="true" />
              </button>
              <div className="form-submit-status" role="status" aria-live="polite">
                {status === 'success' && <p><CheckCircle2 aria-hidden="true" /> Mensagem recebida. Responderemos pelo e-mail informado.</p>}
                {status === 'error' && <p>Não foi possível enviar agora. Tente novamente ou escreva para <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
              </div>
            </form>
          </div>
        </section>

        <section className="contact-section contact-privacy" id="privacidade">
          <div className="shell contact-privacy__grid">
            <div data-reveal="left">
              <ShieldCheck aria-hidden="true" />
              <p className="method-kicker">PRIVACIDADE NA CONVERSA</p>
              <h2>Compartilhe somente o necessário.</h2>
            </div>
            <div data-reveal="right">
              <p>Não envie dados pessoais de estudantes, respostas individuais ao Radar, documentos institucionais restritos ou informações sensíveis.</p>
              <ul>
                <li><span>01</span>Descreva o contexto sem identificar estudantes ou terceiros.</li>
                <li><span>02</span>Em dúvidas sobre o Radar, mencione a dimensão e a interpretação, não suas respostas.</li>
                <li><span>03</span>Revise sua mensagem antes de enviar e mantenha uma cópia apenas quando necessário.</li>
              </ul>
            </div>
          </div>
        </section>

        <div id="perguntas">
          <FaqSection items={contactFaq} title="Antes de escrever" />
        </div>

        <section className="contact-alternative">
          <div className="shell contact-alternative__grid" data-reveal="up">
            <div><MessageSquareText aria-hidden="true" /><div><span>PREFERE ESCREVER DIRETAMENTE?</span><h2>{contactEmail}</h2></div></div>
            <a href={`mailto:${contactEmail}`}>Abrir e-mail <ArrowRight aria-hidden="true" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
