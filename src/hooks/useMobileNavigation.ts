import { useCallback, useEffect, useRef, useState } from 'react'

const DESKTOP_BREAKPOINT = 768

export function useMobileNavigation() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [close, open])

  return { open, setOpen, close, rootRef }
}
