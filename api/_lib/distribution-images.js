import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'

const FONT_PATH = fileURLToPath(new URL('./Sora-Variable.ttf', import.meta.url))
const LOGO_PATH = fileURLToPath(new URL('../../src/assets/logo-praxia-negative.svg', import.meta.url))
const OFFICIAL_LOGO = readFileSync(LOGO_PATH, 'utf8')
  .replace(/^<svg[^>]*>/, '<svg x="0" y="0" width="500" height="136" viewBox="0 0 500 136">')

const CHANNELS = {
  instagram: { width: 1080, height: 1350, suffix: 'instagram-1080x1350' },
  facebook: { width: 1200, height: 630, suffix: 'facebook-1200x630' },
}
export const IMAGE_GENERATION_VERSION = 'v3'

function officialLogo(x, y, width) {
  const height = Math.round(width * 136 / 500)
  return OFFICIAL_LOGO
    .replace('x="0" y="0" width="500" height="136"', `x="${x}" y="${y}" width="${width}" height="${height}"`)
}

function escapeXml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function wrapTitle(title, maxCharacters) {
  const words = title.trim().split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxCharacters && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 5)
}

function titleMarkup(lines, x, y, fontSize, lineHeight) {
  return lines.map((line, index) => (
    `<text x="${x}" y="${y + index * lineHeight}" fill="#f8f9fc" font-family="Sora" font-size="${fontSize}" font-weight="700">${escapeXml(line)}</text>`
  )).join('')
}

export function renderChannelSvg(item, channel) {
  const config = CHANNELS[channel]
  if (!config) throw new Error('Canal de imagem inválido')
  const category = escapeXml((item.article_category || 'Prática docente').toUpperCase())

  if (channel === 'instagram') {
    const lines = wrapTitle(item.article_title, 25)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111721"/><stop offset="1" stop-color="#25205f"/></linearGradient>
        <radialGradient id="field"><stop stop-color="#22c7d6" stop-opacity=".3"/><stop offset="1" stop-color="#22c7d6" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1080" height="1350" fill="url(#bg)"/>
      <circle cx="870" cy="1080" r="390" fill="url(#field)"/>
      <path d="M760 705a260 260 0 1 1-185 78" fill="none" stroke="#c8f03e" stroke-width="9"/>
      <path d="M742 770a190 190 0 1 1-130 57" fill="none" stroke="#5142e8" stroke-width="34"/>
      <circle cx="770" cy="965" r="20" fill="#22c7d6"/><circle cx="927" cy="1050" r="13" fill="#c8f03e"/>
      ${officialLogo(82, 58, 300)}
      <text x="82" y="180" fill="#c8f03e" font-family="Sora" font-size="20" font-weight="700" letter-spacing="2">INTELIGÊNCIA APLICADA À DOCÊNCIA</text>
      <rect x="82" y="240" width="500" height="52" rx="26" fill="#c8f03e"/>
      <text x="110" y="274" fill="#111721" font-family="Sora" font-size="19" font-weight="700">${category}</text>
      ${titleMarkup(lines, 82, 390, 64, 76)}
      <text x="82" y="1248" fill="#9ba6b7" font-family="Sora" font-size="24">radarpraxia.com</text>
    </svg>`
  }

  const lines = wrapTitle(item.article_title, 31)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#111721"/><stop offset=".72" stop-color="#191a3d"/><stop offset="1" stop-color="#25205f"/></linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="1010" cy="315" r="220" fill="none" stroke="#c8f03e" stroke-width="4"/>
    <circle cx="1010" cy="315" r="150" fill="none" stroke="#5142e8" stroke-width="24"/>
    <path d="M850 385L950 280l90 65 90-135" fill="none" stroke="#c8f03e" stroke-width="8"/>
    <circle cx="950" cy="280" r="12" fill="#22c7d6"/><circle cx="1040" cy="345" r="12" fill="#c8f03e"/>
    ${officialLogo(72, 30, 230)}
    <text x="72" y="122" fill="#c8f03e" font-family="Sora" font-size="14" font-weight="700" letter-spacing="1.5">${category}</text>
    ${titleMarkup(lines, 72, 220, 48, 57)}
    <text x="72" y="565" fill="#9ba6b7" font-family="Sora" font-size="17">radarpraxia.com</text>
  </svg>`
}

export async function createChannelJpeg(item, channel) {
  const config = CHANNELS[channel]
  if (!config) throw new Error('Canal de imagem inválido')
  const renderer = new Resvg(renderChannelSvg(item, channel), {
    fitTo: { mode: 'original' },
    font: {
      fontFiles: [FONT_PATH],
      loadSystemFonts: false,
      defaultFontFamily: 'Sora',
      sansSerifFamily: 'Sora',
    },
  })
  return sharp(renderer.render().asPng())
    .jpeg({ quality: 90, progressive: true })
    .toBuffer()
}

export async function uploadChannelImage(item, channel) {
  const config = CHANNELS[channel]
  if (!config) throw new Error('Canal de imagem inválido')
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase não configurado para gerar imagens')

  const slug = new URL(item.article_url).pathname.split('/').filter(Boolean).at(-1) || item.id
  const fileName = `${slug}-${config.suffix}-${IMAGE_GENERATION_VERSION}-${Date.now()}.jpg`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/distribution-images/${fileName}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      'content-type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: await createChannelJpeg(item, channel),
  })
  if (!response.ok) throw new Error(`Não foi possível armazenar a imagem de ${channel}: ${await response.text()}`)
  return `${supabaseUrl}/storage/v1/object/public/distribution-images/${fileName}`
}
