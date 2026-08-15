import { EBOOK_FILE, json, readJson, supabase } from '../ebook.js'

const profiles = new Set(['fundamental', 'medio', 'superior', 'tecnico', 'outro', 'nao_professor'])
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' })

  try {
    const body = await readJson(request)
    if (body.website) return json(response, 200, { downloadUrl: '/ebook' })

    const name = String(body.name || '').trim()
    const teachingProfile = String(body.teachingProfile || '')
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const phoneDigits = phone.replace(/\D/g, '')

    if (name.length < 2) return json(response, 400, { error: 'Informe seu nome.' })
    if (!profiles.has(teachingProfile)) return json(response, 400, { error: 'Selecione seu perfil.' })
    if (!validEmail(email)) return json(response, 400, { error: 'Informe um e-mail válido.' })
    if (phoneDigits.length < 10 || phoneDigits.length > 13) return json(response, 400, { error: 'Informe um telefone com DDD.' })
    if (body.messagingConsent !== true) return json(response, 400, { error: 'É necessário autorizar o recebimento de mensagens.' })

    const lead = await supabase('/rest/v1/ebook_leads', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        name,
        teaching_profile: teachingProfile,
        email,
        phone,
        messaging_consent: true,
        messaging_consent_text: 'Mensagens da PráxIA por e-mail e telefone/WhatsApp sobre conteúdos, produtos e eventos.',
        consented_at: new Date().toISOString(),
        source_page: '/ebook',
      }),
    })
    if (!lead.ok) throw new Error(`Unable to save ebook lead: ${lead.status}`)

    const signed = await supabase(`/storage/v1/object/sign/paid-assets/${EBOOK_FILE}`, {
      method: 'POST',
      body: JSON.stringify({ expiresIn: 600 }),
    })
    if (!signed.ok) throw new Error('Unable to sign ebook file')
    const { signedURL } = await signed.json()
    const downloadUrl = `${process.env.SUPABASE_URL}/storage/v1${signedURL}`
    return json(response, 200, { downloadUrl })
  } catch (error) {
    console.error('free ebook download error', error)
    return json(response, 500, { error: 'Não foi possível liberar o e-book agora. Tente novamente.' })
  }
}
