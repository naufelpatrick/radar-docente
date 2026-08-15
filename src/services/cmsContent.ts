import type { EditorDoc } from '../types/cms'

export function cmsSlugify(value = '') { return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-') }

function nodeText(node: Record<string, unknown>): string {
  if (node.type === 'text') return String(node.text || '')
  return (Array.isArray(node.content) ? node.content : []).map((item) => nodeText(item as Record<string, unknown>)).join('')
}

export function cmsHeadings(doc?: EditorDoc) {
  const used = new Map<string, number>()
  return (doc?.content || []).filter((node) => node.type === 'heading' && [2, 3].includes(Number((node.attrs as { level?: number })?.level))).map((node) => {
    const label = nodeText(node)
    const base = cmsSlugify(label) || 'secao'
    const count = (used.get(base) || 0) + 1; used.set(base, count)
    return { id: count === 1 ? base : `${base}-${count}`, label, level: Number((node.attrs as { level?: number })?.level) }
  })
}
