import { SITE_URL } from '../config/site'

export function buildCanonicalUrl(path: string) {
  const url = new URL(path, SITE_URL)
  url.search = ''
  url.hash = ''
  return url.toString()
}
