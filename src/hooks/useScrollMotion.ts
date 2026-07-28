import { useEffect } from 'react'

const motionSelector = '[data-reveal], [data-animate]'

export function useScrollMotion() {
  useEffect(() => {
    document.documentElement.classList.add('motion-ready')
    const elements = [...document.querySelectorAll<HTMLElement>(motionSelector)]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-in-view'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting)
        })
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12,
      },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
