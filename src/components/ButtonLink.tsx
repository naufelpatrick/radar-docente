import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type ButtonLinkProps = {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary' | 'light'
  showArrow?: boolean
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  showArrow = false,
}: ButtonLinkProps) {
  const className = `button-link button-link--${variant}`

  return (
    <a className={className} href={href}>
      {children}
      {showArrow && <ArrowRight aria-hidden="true" size={18} />}
    </a>
  )
}
