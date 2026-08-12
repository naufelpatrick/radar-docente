import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  supabase: vi.fn(),
}))

vi.mock('../_lib/ebook.js', () => ({
  json: vi.fn(),
  readJson: vi.fn(),
  supabase: mocks.supabase,
}))

vi.mock('../_lib/workshop.js', () => ({
  sendConfirmationEmail: vi.fn(),
}))

import { removePaidRegistrantFromWaitlist } from './asaas.js'

describe('ASAAS workshop webhook', () => {
  beforeEach(() => mocks.supabase.mockReset())

  it('removes a paid registrant from the waitlist by normalized email', async () => {
    mocks.supabase.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue([{}]) })

    await removePaidRegistrantFromWaitlist('  Professora+IA@Example.com  ')

    expect(mocks.supabase).toHaveBeenCalledWith(
      '/rest/v1/workshop_waitlist?email=eq.professora%2Bia%40example.com',
      { method: 'DELETE', headers: { prefer: 'return=representation' } },
    )
  })

  it('fails the webhook processing when the automatic removal cannot be completed', async () => {
    mocks.supabase.mockResolvedValue({ ok: false })

    await expect(removePaidRegistrantFromWaitlist('professora@example.com'))
      .rejects.toThrow('Unable to remove paid registrant from workshop waitlist')
  })
})
