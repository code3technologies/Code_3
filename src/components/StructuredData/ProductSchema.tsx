import type { Device } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'

// Device catalog pages had zero structured data despite being a real
// hardware catalog (brand, category, specs, images) - same rationale as
// ServiceSchema for /service pages. Deliberately omits `offers` - these are
// request-a-quote pages with no stored price/availability, and fabricating
// either would be misleading structured data rather than a real signal.
export const ProductSchema = ({ device, path }: { device: Device; path: string }) => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')

  const images = [
    device.image,
    ...(device.gallery || []).map((g) => g.image),
  ]
    .map((img) => (img && typeof img === 'object' ? getMediaUrl(img.url) : undefined))
    .filter((url): url is string => Boolean(url))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: device.title,
    url: `${siteUrl}${path}`,
    brand: { '@type': 'Brand', name: device.brand },
    ...(device.category ? { category: device.category } : {}),
    ...(device.shortDescription ? { description: device.shortDescription } : {}),
    ...(images.length > 0 ? { image: images } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
