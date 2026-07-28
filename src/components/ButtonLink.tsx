import type { MouseEventHandler, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type ButtonLinkProps = {
  children: ReactNode
  href: string
  variant?: 'primary' | 'secondary' | 'light'
  showArrow?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  showArrow = false,
  onClick,
}: ButtonLinkProps) {
  const className = `button-link button-link--${variant}`

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
      {showArrow && <ArrowRight aria-hidden="true" size={18} />}
    </a>
  )
}
