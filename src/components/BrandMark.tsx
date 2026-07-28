type BrandMarkProps = {
  compact?: boolean
  inverse?: boolean
}

export function BrandMark({ compact = false, inverse = false }: BrandMarkProps) {
  return (
    <span
      className={`brand-mark ${inverse ? 'brand-mark--inverse' : ''}`}
      aria-label="PráxIA"
    >
      Práx<span className="brand-mark__ia">IA</span>
      {!compact && <span className="brand-mark__dot" aria-hidden="true" />}
    </span>
  )
}
