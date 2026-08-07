import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('dist/lp/workshop-ia-2026')
const source = await readFile(resolve('dist/index.html'), 'utf8')
const title = 'Workshop gratuito: IA na prática docente | PráxIA'
const description = 'Entre na lista de espera do workshop gratuito sobre fluência em IA, maturidade digital e aplicação prática no planejamento docente.'
const canonical = 'https://www.radarpraxia.com/lp/workshop-ia-2026'
const image = 'https://www.radarpraxia.com/social/workshop-ia-pratica-docente-1200x630.jpg'
const imageAlt = 'Educadores reunidos em torno de um computador durante atividade de formação'

const html = source
  .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
  .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
  .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
  .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${image}" />`)
  .replace(/<meta property="og:image:secure_url"[^>]*>/, `<meta property="og:image:secure_url" content="${image}" />`)
  .replace(/<meta property="og:image:type"[^>]*>/, '<meta property="og:image:type" content="image/jpeg" />')
  .replace(/<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${imageAlt}" />`)
  .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`)
  .replace(/<meta name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${imageAlt}" />`)
  .replace('</head>', `    <link rel="canonical" href="${canonical}" />\n    <meta property="og:url" content="${canonical}" />\n    <meta name="twitter:title" content="${title}" />\n    <meta name="twitter:description" content="${description}" />\n  </head>`)

await mkdir(outputDirectory, { recursive: true })
await writeFile(resolve(outputDirectory, 'index.html'), html)
console.log('Landing page do workshop pré-renderizada.')
