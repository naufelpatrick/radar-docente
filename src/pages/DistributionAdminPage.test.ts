import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('distribution admin security and previews', () => {
  const page = readFileSync(new URL('./DistributionAdminPage.tsx', import.meta.url), 'utf8')
  const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8')

  it('does not expose Make secrets in the client page', () => {
    expect(page).not.toContain('MAKE_WEBHOOK_URL')
    expect(page).not.toContain('MAKE_WEBHOOK_API_KEY')
    expect(page).not.toContain('x-make-apikey')
  })

  it('uses independent previews with contain and channel aspect ratios', () => {
    expect(page).toContain("imagePreview(item, 'instagram')")
    expect(page).toContain("imagePreview(item, 'facebook')")
    expect(page).toContain("imagePreview(item, 'linkedin')")
    expect(styles).toContain('aspect-ratio: 4 / 5')
    expect(styles).toContain('aspect-ratio: 1200 / 630')
    expect(styles).toContain('object-fit: contain')
  })

  it('keeps LinkedIn selectable and tied to the Instagram image', () => {
    expect(page).toContain('linkedin_enabled')
    expect(page).toContain('linkedin_caption')
    expect(page).toContain('item.instagram_image_url')
    expect(page).toContain('Incluir {channelName} na publicação')
  })
})
