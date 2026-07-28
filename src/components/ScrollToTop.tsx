import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const targetId = hash.slice(1)
      const scrollToTarget = () => {
        const target = document.getElementById(targetId)
        if (!target) return
        target.scrollIntoView({ block: 'start' })
      }
      const timers = [0, 200, 700, 1400].map((delay) => window.setTimeout(scrollToTarget, delay))
      return () => timers.forEach((timer) => window.clearTimeout(timer))
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname])

  return null
}
