import { useEffect, useId, useRef, useState } from 'react'
import { Check, Copy, Facebook, Linkedin, MessageCircle, Share2 } from 'lucide-react'
import type { BlogArticle } from '../data/blogArticles'
import { trackArticleShare, type ArticleShareMethod } from '../services/articleShareAnalytics'
import { buildArticleShareUrls } from '../services/articleShareUrls'

type ArticleShareProps = {
  article: BlogArticle
  variant?: 'compact' | 'full'
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Continue with the legacy fallback when permission or browser support fails.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('Não foi possível copiar o link.')
}

export function ArticleShare({ article, variant = 'full' }: ArticleShareProps) {
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const shareUrls = buildArticleShareUrls(article)
  const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  useEffect(() => {
    if (!menuOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleExternalShare = (method: Exclude<ArticleShareMethod, 'native' | 'copy_link'>) => {
    trackArticleShare(article.title, article.slug, method)
    setMenuOpen(false)
  }

  const handleCopy = async () => {
    try {
      await copyText(article.canonicalUrl)
      setCopied(true)
      trackArticleShare(article.title, article.slug, 'copy_link')
    } catch {
      setCopied(false)
    } finally {
      setMenuOpen(false)
    }
  }

  const handleNativeShare = async () => {
    if (!supportsNativeShare) {
      setMenuOpen((current) => !current)
      return
    }
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: article.canonicalUrl,
      })
      trackArticleShare(article.title, article.slug, 'native')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  const options = (
    <>
      <a className="article-share__action article-share__action--primary" href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => handleExternalShare('whatsapp')} aria-label={`Compartilhar “${article.title}” no WhatsApp`}>
        <MessageCircle aria-hidden="true" /> <span>WhatsApp</span>
      </a>
      <a className="article-share__action article-share__action--primary" href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => handleExternalShare('linkedin')} aria-label={`Compartilhar “${article.title}” no LinkedIn`}>
        <Linkedin aria-hidden="true" /> <span>LinkedIn</span>
      </a>
      <a className="article-share__action" href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" onClick={() => handleExternalShare('facebook')} aria-label={`Compartilhar “${article.title}” no Facebook`}>
        <Facebook aria-hidden="true" /> <span>Facebook</span>
      </a>
      <button className="article-share__action" type="button" onClick={handleCopy} aria-label={`Copiar link do artigo “${article.title}”`}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} <span>{copied ? 'Link copiado!' : 'Copiar link'}</span>
      </button>
    </>
  )

  if (variant === 'compact') {
    return (
      <div className="article-share article-share--compact" ref={containerRef}>
        <button className="article-share__trigger" type="button" onClick={handleNativeShare} aria-label={`Compartilhar o artigo “${article.title}”`} aria-expanded={supportsNativeShare ? undefined : menuOpen} aria-controls={supportsNativeShare ? undefined : menuId}>
          <Share2 aria-hidden="true" /> Compartilhar
        </button>
        {!supportsNativeShare && menuOpen && <div className="article-share__menu" id={menuId}>{options}</div>}
      </div>
    )
  }

  return (
    <section className="article-share article-share--full" aria-labelledby={`${menuId}-title`}>
      <div>
        <p className="method-kicker">COMPARTILHE A REFLEXÃO</p>
        <h2 id={`${menuId}-title`}>Este conteúdo foi útil?</h2>
        <p>Compartilhe com outros professores e ajude esta reflexão a chegar a mais pessoas.</p>
      </div>
      <div className="article-share__actions">
        {options}
        {supportsNativeShare && (
          <button className="article-share__action" type="button" onClick={handleNativeShare} aria-label={`Abrir compartilhamento do dispositivo para “${article.title}”`}>
            <Share2 aria-hidden="true" /> <span>Compartilhar</span>
          </button>
        )}
      </div>
      <span className="sr-only" aria-live="polite">{copied ? 'Link copiado!' : ''}</span>
    </section>
  )
}
