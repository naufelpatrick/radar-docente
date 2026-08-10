import logoNegative from '../assets/logo-praxia-vertical-negative.svg'
import logoPositive from '../assets/logo-praxia-vertical.svg'

type BrandMarkProps = {
  compact?: boolean
  inverse?: boolean
}

export function BrandMark({ compact = false, inverse = false }: BrandMarkProps) {
  return (
    <img
      className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`}
      src={inverse ? logoNegative : logoPositive}
      alt="PráxIA"
      width="245"
      height="247"
    />
  )
}
