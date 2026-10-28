import type { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// Marks the About and Contact pages up as their specific WebPage subtypes
// (AboutPage/ContactPage) instead of leaving them as generic, untyped pages -
// a small but real signal for "who is this company" / "how do I reach them"
// queries, same rationale as the other StructuredData components. Silently
// renders nothing for every other slug.
const SLUG_TYPES: Record<string, string> = {
  'about-us': 'AboutPage',
  contact: 'ContactPage',
}

export const PageTypeSchema = ({ page, path }: { page: Page; path: string }) => {
  const type = page.slug ? SLUG_TYPES[page.slug] : undefined
  if (!type) return null

  const siteUrl = getServerSideURL().replace(/\/+$/, '')

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: page.title,
    url: `${siteUrl}${path}`,
    about: {
      '@type': 'ProfessionalService',
      name: 'CODE3 Technologies',
      url: siteUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
