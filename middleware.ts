const LEGACY_HOST = 'radar-docente-pi.vercel.app'
const CANONICAL_ORIGIN = 'https://www.radarpraxia.com'

export default function middleware(request: Request) {
  const requestedUrl = new URL(request.url)

  if (requestedUrl.hostname !== LEGACY_HOST) return

  const destination = new URL(`${requestedUrl.pathname}${requestedUrl.search}`, CANONICAL_ORIGIN)
  return Response.redirect(destination, 308)
}
