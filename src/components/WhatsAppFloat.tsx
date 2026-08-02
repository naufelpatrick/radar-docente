import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const whatsappUrl = 'https://wa.me/5549991106400'

export function WhatsAppFloat() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/admin')) return null

  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a PráxIA pelo WhatsApp"
    >
      <MessageCircle aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  )
}
