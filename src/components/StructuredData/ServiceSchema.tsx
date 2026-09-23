import type { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// Every page rendered by /service/[slug] is a real service offering (that
// route only ever queries pages with serviceCategory !== 'none'), so this
// can be added unconditionally there. Marks each one up as a distinct
// Service instead of leaving Google/AI search to infer that from prose -
// same rationale as the sitewide ProfessionalService and per-page FAQPage
// schema added earlier.
export const ServiceSchema = ({ page, path }: { page: Page; path: string }) => {
  // NEXT_PUBLIC_SERVER_URL is set with a trailing slash in Vercel, which
  // produced a double slash when concatenated with path (which already
  // starts with one) - see the same fix in next-sitemap.config.cjs.
  const siteUrl = getServerSideURL().replace(/\/+$/, '')
  const parentTitle =
    typeof page.parentService === 'object' && page.parentService ? page.parentService.title : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    ...(page.meta?.description ? { description: page.meta.description } : {}),
    url: `${siteUrl}${path}`,
    provider: {
      '@type': 'ProfessionalService',
      name: 'CODE3 Technologies',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    ...(parentTitle ? { category: parentTitle } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
