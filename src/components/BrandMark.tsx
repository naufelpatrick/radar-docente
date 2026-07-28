import logoNegative from '../assets/logo-praxia-negative.svg'
import logoPositive from '../assets/logo-praxia.svg'

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
      width={inverse ? 500 : 408}
      height="136"
    />
  )
}
