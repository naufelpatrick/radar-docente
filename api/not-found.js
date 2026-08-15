const SITE_URL = 'https://www.radarpraxia.com'

export default function handler(_request, response) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página não encontrada | PraxIA</title><meta name="description" content="A página solicitada não existe ou foi movida."><meta name="robots" content="noindex, follow"></head><body><main><p>Erro 404</p><h1>Página não encontrada</h1><p>O endereço pode estar incorreto ou o conteúdo pode ter sido movido.</p><nav aria-label="Próximos caminhos"><a href="${SITE_URL}/">Início</a> · <a href="${SITE_URL}/radar-docente">Radar Docente</a> · <a href="${SITE_URL}/blog">Blog</a></nav></main></body></html>`
  response.status(404).setHeader('content-type', 'text/html; charset=utf-8').setHeader('x-robots-tag', 'noindex, follow').end(html)
}
