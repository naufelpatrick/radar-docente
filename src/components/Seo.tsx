import { useEffect } from 'react'

type JsonLd = Record<string, unknown> | Record<string, unknown>[]

interface SeoProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  jsonLd?: JsonLd
}

const siteUrl = 'https://radar-docente-pi.vercel.app'
const socialImage = `${siteUrl}/social-graph-praxia.png`

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

export function Seo({ title, description, path, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, siteUrl).toString()
    document.title = title

    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'PráxIA' })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage })
    setMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: socialImage })
    setMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: 'image/png' })
    setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
    setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'PráxIA — descubra sua maturidade para ensinar com inteligência artificial' })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage })
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: 'PráxIA — descubra sua maturidade para ensinar com inteligência artificial' })

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const scriptId = 'page-json-ld'
    document.getElementById(scriptId)?.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => document.getElementById(scriptId)?.remove()
  }, [description, jsonLd, path, title, type])

  return null
}
