export type DistributionChannel = 'instagram' | 'facebook' | 'linkedin'

export type ChannelImages = {
  instagram_image_url: string | null
  facebook_image_url: string | null
}

export function channelImageError(images: ChannelImages, channel: DistributionChannel) {
  const label = channel === 'instagram' ? 'Instagram' : channel === 'facebook' ? 'Facebook' : 'LinkedIn'
  const imageChannel = channel === 'linkedin' ? 'instagram' : channel
  const value = images[`${imageChannel}_image_url`]
  if (!value) return `${label}: adicione ou gere a imagem antes de publicar.`
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') return `${label}: use uma URL HTTPS.`
  } catch {
    return `${label}: informe uma URL válida.`
  }
  if (channel !== 'linkedin') {
    const other = images[channel === 'instagram' ? 'facebook_image_url' : 'instagram_image_url']
    if (other && other.trim() === value.trim()) return 'As artes de Instagram e Facebook precisam ser diferentes.'
  }
  return null
}
