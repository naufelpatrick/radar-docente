import { describe, expect, it } from 'vitest'
import { channelImageError } from './distributionImages'

describe('distribution channel images', () => {
  it('requires an explicit Instagram image without using the social graph fallback', () => {
    expect(channelImageError({
      instagram_image_url: null,
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    }, 'instagram')).toContain('adicione ou gere')
  })

  it('requires a Facebook image', () => {
    expect(channelImageError({
      instagram_image_url: 'https://cdn.example.com/instagram.jpg',
      facebook_image_url: null,
    }, 'facebook')).toContain('adicione ou gere')
  })

  it('rejects equal, invalid and insecure URLs', () => {
    const same = 'https://cdn.example.com/same.jpg'
    expect(channelImageError({ instagram_image_url: same, facebook_image_url: same }, 'instagram')).toContain('diferentes')
    expect(channelImageError({ instagram_image_url: 'not-a-url', facebook_image_url: null }, 'instagram')).toContain('válida')
    expect(channelImageError({ instagram_image_url: null, facebook_image_url: 'http://cdn.example.com/image.jpg' }, 'facebook')).toContain('HTTPS')
  })

  it('accepts two valid and independent HTTPS images', () => {
    const images = {
      instagram_image_url: 'https://cdn.example.com/instagram.jpg',
      facebook_image_url: 'https://cdn.example.com/facebook.jpg',
    }
    expect(channelImageError(images, 'instagram')).toBeNull()
    expect(channelImageError(images, 'facebook')).toBeNull()
  })
})
