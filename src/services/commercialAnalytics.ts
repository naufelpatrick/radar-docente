import type { ProductAudience, ProductId } from '../types/products'
import { analyticsAllowed } from './cookieConsent'

export type CommercialEvent =
  | 'view_products_section'
  | 'select_ebook'
  | 'select_mentoring'
  | 'select_institutional_solution'
  | 'view_institutional_page'
  | 'start_institutional_form'
  | 'submit_institutional_lead'

export interface CommercialEventParameters {
  product_id?: ProductId
  audience?: ProductAudience
  source_page?: string
  solution_type?: 'talk' | 'workshop' | 'both'
  form_status?: 'validation_error' | 'integration_pending' | 'success' | 'error'
}

export function trackCommercialEvent(event: CommercialEvent, parameters: CommercialEventParameters = {}) {
  if (typeof window === 'undefined' || !analyticsAllowed() || typeof window.gtag !== 'function') return
  window.gtag('event', event, { ...parameters })
}
