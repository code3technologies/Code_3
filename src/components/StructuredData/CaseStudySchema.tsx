import type { CaseStudy, Header, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'

// Case studies are real, substantive content (challenge/solution/quantified
// results) with zero structured data - same rationale as the other
// StructuredData components. Uses clientDescriptor (e.g. "A UAE logistics
// company") instead of clientName when the client is anonymized, since that
// field exists specifically to keep attribution safe for publication.
export const CaseStudySchema = async ({ study, path }: { study: CaseStudy; path: string }) => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')
  const image =
    study.heroImage && typeof study.heroImage === 'object' ? getMediaUrl(study.heroImage.url) : undefined

  // Google's Article guidelines recommend publisher.logo, ideally square -
  // use the header global's logo (the site's actual rendered logo; the
  // footer global's own `logo` field is a stale/broken relationship) and its
  // pre-generated square crop.
  const headerData = (await getCachedGlobal('header', 1, 'en')()) as Header
  const logo = headerData?.logo as Media | undefined
  const square = logo?.sizes?.square
  const logoUrl = square?.url ? getMediaUrl(square.url) : logo?.url ? getMediaUrl(logo.url) : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.summary,
    url: `${siteUrl}${path}`,
    ...(image ? { image: [image] } : {}),
    ...(study.industry ? { about: study.industry } : {}),
    ...(study.clientName || study.clientDescriptor
      ? { mentions: { '@type': 'Organization', name: study.clientName || study.clientDescriptor } }
      : {}),
    author: { '@type': 'Organization', name: 'CODE3 Technologies' },
    publisher: {
      '@type': 'Organization',
      name: 'CODE3 Technologies',
      url: siteUrl,
      ...(logoUrl
        ? {
            logo: {
              '@type': 'ImageObject',
              url: logoUrl,
              ...(square?.width && square?.height ? { width: square.width, height: square.height } : {}),
            },
          }
        : {}),
    },
    ...(study.createdAt ? { datePublished: study.createdAt } : {}),
    ...(study.updatedAt ? { dateModified: study.updatedAt } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
