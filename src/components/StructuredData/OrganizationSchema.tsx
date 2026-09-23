import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import type { Footer, Media } from '@/payload-types'

// Sitewide ProfessionalService/LocalBusiness structured data - one script in
// the root layout covers every page, so search engines and AI answer
// engines can reliably resolve "who is CODE3" (name, contact info, socials)
// without needing to infer it from prose on any one page.
export const OrganizationSchema = async () => {
  const footerData = (await getCachedGlobal('footer', 1, 'en')()) as Footer

  const contactInfo = footerData?.contactInfo
  const address = contactInfo?.address
  const socialLinks = footerData?.socialLinks
  const logo = footerData?.logo as Media | undefined
  const siteUrl = getServerSideURL()

  const sameAs = [
    socialLinks?.linkedin,
    socialLinks?.instagram,
    socialLinks?.facebook,
    socialLinks?.twitter,
    socialLinks?.youtube,
  ].filter((url): url is string => Boolean(url))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: address?.companyName || 'CODE3 Technologies',
    url: siteUrl,
    ...(logo?.url ? { logo: getMediaUrl(logo.url), image: getMediaUrl(logo.url) } : {}),
    ...(contactInfo?.phone ? { telephone: contactInfo.phone } : {}),
    ...(contactInfo?.email ? { email: contactInfo.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: [address?.building, address?.poBox].filter(Boolean).join(', '),
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
