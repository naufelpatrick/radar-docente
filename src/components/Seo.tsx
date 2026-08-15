import { useEffect } from 'react'
import { SITE_URL } from '../config/site'

type JsonLd = Record<string, unknown> | Record<string, unknown>[]

interface SeoProps {
  title: string
  socialTitle?: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
  imageAlt?: string
  jsonLd?: JsonLd
  robots?: string
  omitCanonical?: boolean
}

const socialImage = `${SITE_URL}/social-graph-praxia.png`
const defaultImageAlt = 'PraxIA — fluência digital e inteligência artificial para a prática docente'

function formatPageTitle(title: string) {
  const pageName = title.replace(/\s*\|\s*Pr[áa]xIA\s*$/i, '').trim()
  return `${pageName} | PraxIA`
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

export function Seo({ title, socialTitle = title, description, path, type = 'website', image = socialImage, imageAlt = defaultImageAlt, jsonLd, robots = 'index, follow', omitCanonical = false }: SeoProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_URL).toString()
    document.title = formatPageTitle(title)

    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[name="robots"]', { name: 'robots', content: robots })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: socialTitle })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'PraxIA' })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: image })
    const imageType = image.endsWith('.webp') ? 'image/webp' : image.endsWith('.jpg') || image.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'
    setMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: imageType })
    setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
    setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: imageAlt })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: socialTitle })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: imageAlt })

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (omitCanonical) {
      canonical?.remove()
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = canonicalUrl
    }

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
  }, [description, image, imageAlt, jsonLd, omitCanonical, path, robots, socialTitle, title, type])

  return null
}
