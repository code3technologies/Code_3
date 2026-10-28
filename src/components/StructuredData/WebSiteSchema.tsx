import { getServerSideURL } from '@/utilities/getURL'

// Sitewide WebSite entity with a SearchAction - tells Google/AI answer engines
// the site has its own search (powers the sitelinks search box and gives
// answer engines a defined way to query the site directly) and anchors the
// site as a single named entity, same rationale as OrganizationSchema for the
// business entity itself.
export const WebSiteSchema = () => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CODE3 Technologies',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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
