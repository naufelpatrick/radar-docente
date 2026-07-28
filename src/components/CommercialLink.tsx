import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { trackCommercialEvent, type CommercialEvent, type CommercialEventParameters } from '../services/commercialAnalytics'

interface CommercialLinkProps {
  to: string
  event: CommercialEvent
  parameters?: CommercialEventParameters
  className?: string
  children: ReactNode
}

export function CommercialLink({ to, event, parameters, className, children }: CommercialLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => trackCommercialEvent(event, parameters)
  return <Link to={to} className={className} onClick={handleClick}>{children}</Link>
}
