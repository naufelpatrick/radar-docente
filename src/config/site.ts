export const SITE_URL = 'https://www.radarpraxia.com'

export function buildSiteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}
