import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { getGoogleReviews } from '@/blocks/Testimonials/getGoogleReviews'
import { UAE_AREA_SERVED } from '@/utilities/uaeAreaServed'
import type { Footer, Header, Media } from '@/payload-types'

// Sitewide ProfessionalService/LocalBusiness structured data - one script in
// the root layout covers every page, so search engines and AI answer
// engines can reliably resolve "who is CODE3" (name, contact info, socials)
// without needing to infer it from prose on any one page.
export const OrganizationSchema = async () => {
  const [footerData, headerData, reviewsData] = await Promise.all([
    getCachedGlobal('footer', 1, 'en')() as Promise<Footer>,
    getCachedGlobal('header', 1, 'en')() as Promise<Header>,
    getGoogleReviews(),
  ])

  const contactInfo = footerData?.contactInfo
  const address = contactInfo?.address
  const socialLinks = footerData?.socialLinks
  // The footer global's own `logo` field is a stale/broken relationship
  // (points at a deleted media doc) - use the header global's logo instead,
  // which is the site's actual rendered logo. Google's logo guidance prefers
  // a square image, so use the pre-generated square crop for `logo` while
  // `image` keeps the full wordmark.
  const logo = headerData?.logo as Media | undefined
  const squareLogoUrl = logo?.sizes?.square?.url ? getMediaUrl(logo.sizes.square.url) : undefined
  const siteUrl = getServerSideURL()

  const sameAs = [
    socialLinks?.linkedin,
    socialLinks?.instagram,
    socialLinks?.facebook,
    socialLinks?.twitter,
    socialLinks?.youtube,
    socialLinks?.googleBusiness,
  ].filter((url): url is string => Boolean(url))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: address?.companyName || 'CODE3 Technologies',
    url: siteUrl,
    ...(squareLogoUrl ? { logo: squareLogoUrl } : {}),
    ...(logo?.url ? { image: getMediaUrl(logo.url) } : {}),
    ...(contactInfo?.phone ? { telephone: contactInfo.phone.replace(/\s/g, '') } : {}),
    ...(contactInfo?.email ? { email: contactInfo.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: [address?.building, address?.poBox].filter(Boolean).join(', '),
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    areaServed: UAE_AREA_SERVED,
    ...(reviewsData?.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: reviewsData.geo.lat, longitude: reviewsData.geo.lng } }
      : {}),
    ...(reviewsData?.openingHours
      ? {
          openingHoursSpecification: reviewsData.openingHours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    // Explicit topic list so AI answer engines can map CODE3 to these
    // service entities directly instead of inferring them from footer/nav
    // text - mirrors llms.txt's service list for consistency across both.
    knowsAbout: [
      'Managed IT Services',
      'Cybersecurity',
      'Cloud & Microsoft Solutions',
      'IT Infrastructure',
      'Network Infrastructure',
      'Backup & Business Continuity',
      'Audio Visual (AV) Solutions',
      'CCTV & Security Surveillance',
      'Access Control & Biometric Attendance',
      'ANPR Systems',
      'AI Cameras',
      'Queue Management Systems',
      'Unified Communication',
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(reviewsData?.rating && reviewsData.userRatingsTotal
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviewsData.rating,
            reviewCount: reviewsData.userRatingsTotal,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
