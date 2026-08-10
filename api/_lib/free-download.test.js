import { afterEach, describe, expect, it, vi } from 'vitest'
import handler from '../ebook/free-download.js'

function createResponse() {
  return {
    statusCode: 0,
    headers: {},
    status(code) { this.statusCode = code; return this },
    setHeader(name, value) { this.headers[name] = value; return this },
    end(body) { this.body = body },
  }
}

const validBody = {
  name: 'Ana Silva',
  teachingProfile: 'superior',
  email: 'ANA@example.com',
  phone: '(11) 99999-9999',
  messagingConsent: true,
}

describe('free ebook download', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  it('requires messaging consent', async () => {
    const response = createResponse()
    await handler({ method: 'POST', body: { ...validBody, messagingConsent: false } }, response)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).error).toContain('autorizar')
  })

  it('stores the lead and returns a temporary download URL', async () => {
    process.env.SUPABASE_URL = 'https://project.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ signedURL: '/object/sign/paid-assets/ebook.pdf?token=test' }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const response = createResponse()

    await handler({ method: 'POST', body: validBody }, response)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).downloadUrl).toContain('token=test')
    const lead = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(lead).toMatchObject({
      name: 'Ana Silva',
      teaching_profile: 'superior',
      email: 'ana@example.com',
      messaging_consent: true,
      source_page: '/ebook',
    })
  })
})
