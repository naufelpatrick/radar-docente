import type { ScoreBandId } from './result'

export type ProductAudience = 'teachers' | 'institutions'
export type ProductId = 'ebook' | 'mentoring' | 'workshop' | 'talk'

export interface PraxiaProduct {
  id: ProductId
  name: string
  audience: ProductAudience
  category: 'ebook' | 'mentoring' | 'training' | 'lecture'
  description: string
  benefits: string[]
  ctaLabel: string
  href: string
  status: 'information_available' | 'coming_soon'
  recommendedFor: ScoreBandId[]
  format?: string[]
  duration?: string[]
}
