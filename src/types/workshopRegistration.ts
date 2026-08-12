export interface WorkshopEdition {
  id: string
  slug: string
  titulo: string
  descricao: string
  inicio_em: string
  fim_em: string
  timezone: string
  valor: number
  carga_horaria: number
  status: string
  limite_vagas: number | null
}

export interface WorkshopRegistrationStatus {
  id: string
  nome: string
  statusPagamento: 'aguardando_pagamento' | 'pago' | 'cancelado' | 'expirado' | 'falhou'
  valor: number
  dataPagamento: string | null
  edition: {
    id: string
    slug: string
    titulo: string
    inicioEm: string
    fimEm: string
    timezone: string
    cargaHoraria: number
    meetingUrl?: string
    telefoneAlternativo?: string
    meetingPin?: string
    googleCalendarUrl?: string
  }
}

