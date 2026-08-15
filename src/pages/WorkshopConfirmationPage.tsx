import { useEffect, useState } from 'react'
import { CalendarPlus, CheckCircle2, Clock3, ExternalLink, LoaderCircle, XCircle } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { Seo } from '../components/Seo'
import { loadWorkshopRegistration } from '../services/workshopRegistrationService'
import type { WorkshopRegistrationStatus } from '../types/workshopRegistration'

export function WorkshopConfirmationPage() {
  const params = new URLSearchParams(window.location.search)
  const inscricao = params.get('inscricao') || ''
  const token = params.get('token') || ''
  const validLink = Boolean(inscricao && token)
  const [registration, setRegistration] = useState<WorkshopRegistrationStatus | null>(null)
  const [error, setError] = useState(validLink ? '' : 'Link de confirmação inválido.')
  useEffect(() => {
    if (!validLink) return undefined
    let timer = 0; let active = true
    const check = async () => { try { const value = await loadWorkshopRegistration(inscricao, token); if (!active) return; setRegistration(value); if (value.statusPagamento === 'aguardando_pagamento') timer = window.setTimeout(check, 5000) } catch { if (active) setError('Não foi possível localizar esta inscrição.') } }
    check()
    return () => { active = false; window.clearTimeout(timer) }
  }, [inscricao, token, validLink])
  const paid = registration?.statusPagamento === 'pago'
  const failed = registration && ['cancelado', 'expirado', 'falhou'].includes(registration.statusPagamento)
  const ics = `/api/workshops/calendar?${new URLSearchParams({ inscricao, token })}`
  const schedule = registration ? (() => {
    const date = new Intl.DateTimeFormat('pt-BR', { timeZone: registration.edition.timezone, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(registration.edition.inicioEm))
    const hour = (value: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: registration.edition.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date(value)).replace(':', 'h')
    return `${date} · ${hour(registration.edition.inicioEm)} às ${hour(registration.edition.fimEm)}`
  })() : ''
  return <div className="workshop-confirmation-page"><Seo title="Confirmação do Workshop IA para Prática Docente | PraxIA" description="Consulte a confirmação da sua inscrição no Workshop IA para Prática Docente." path="/lp/workshop-ia-2026/inscricoes/confirmacao" robots="noindex, nofollow" /><header><a href="/"><BrandMark inverse /></a></header><main>
    {error ? <section className="workshop-confirmation-card"><XCircle /><h1>Não encontramos esta inscrição.</h1><p>{error}</p><a href="/lp/workshop-ia-2026/inscricoes">Voltar para as inscrições</a></section>
      : !registration || (!paid && !failed) ? <section className="workshop-confirmation-card"><LoaderCircle className="spin" /><p className="workshop-kicker">PAGAMENTO EM ANÁLISE</p><h1>Estamos confirmando seu pagamento...</h1><p>Esta página será atualizada automaticamente assim que o ASAAS confirmar. Você não precisa mantê-la aberta: a confirmação também será enviada por e-mail.</p></section>
      : failed ? <section className="workshop-confirmation-card"><XCircle /><p className="workshop-kicker">PAGAMENTO NÃO CONCLUÍDO</p><h1>Sua inscrição ainda não foi confirmada.</h1><p>O pagamento foi cancelado, expirou ou não pôde ser processado. Você pode iniciar uma nova inscrição.</p><a href="/lp/workshop-ia-2026/inscricoes">Tentar novamente</a></section>
      : <section className="workshop-confirmation-card workshop-confirmation-card--paid"><CheckCircle2 /><p className="workshop-kicker">PAGAMENTO CONFIRMADO ✓</p><h1>Sua vaga está garantida.</h1><p>Olá, {registration.nome}. Sua inscrição no <strong>{registration.edition.titulo}</strong> foi confirmada.</p><div><span><Clock3 />{schedule}</span><span>Online · {registration.edition.cargaHoraria} horas · Certificado após presença</span></div><a className="workshop-confirmation-primary" href={registration.edition.meetingUrl} target="_blank" rel="noreferrer">Entrar no Workshop <ExternalLink /></a><div className="workshop-confirmation-actions"><a href={registration.edition.googleCalendarUrl} target="_blank" rel="noreferrer"><CalendarPlus />Adicionar ao Google Calendar</a><a href={ics}><CalendarPlus />Adicionar à agenda (.ics)</a></div><small>A confirmação e os dados de acesso também foram enviados por e-mail.</small></section>}
  </main></div>
}
