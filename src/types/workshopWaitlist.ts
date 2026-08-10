export type TeachingStage = 'fundamental' | 'medio' | 'superior_graduacao' | 'superior_pos_graduacao' | 'tecnico' | 'outro'
export type PaymentIntent = 'sim' | 'nao' | 'depende'

export type WorkshopWaitlistLead = {
  nome: string
  email: string
  etapaEnsino: TeachingStage | ''
  duvidaPrincipal: string
  topaPagar: PaymentIntent | ''
  utmSource?: string
  utmCampaign?: string
}

export type WorkshopWaitlistErrors = Partial<Record<keyof WorkshopWaitlistLead, string>>
