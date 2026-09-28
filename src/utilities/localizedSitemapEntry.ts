import type { ISitemapField } from 'next-sitemap'

// Every content page under [locale] is served at both the plain path (en)
// and its /ar/ counterpart (see src/middleware.ts) - the sitemap previously
// only ever listed the English URL, so Google had no crawl path to the
// Arabic version except an on-page <link rel="alternate"> tag. Emitting both
// URLs, each annotated with alternateRefs to the other, is the standard
// hreflang-via-sitemap pattern and gives Arabic-locale UAE searchers (a
// meaningful share of Dubai/Abu Dhabi traffic) a direct route into the index.
export function buildLocalizedSitemapEntries(
  siteUrl: string,
  path: string,
  lastmod: string,
): ISitemapField[] {
  const enUrl = `${siteUrl}${path}`
  const arPath = path === '/' ? '/ar' : `/ar${path}`
  const arUrl = `${siteUrl}${arPath}`

  const alternateRefs = [
    { href: enUrl, hreflang: 'en' },
    { href: arUrl, hreflang: 'ar' },
    { href: enUrl, hreflang: 'x-default' },
  ]

  return [
    { loc: enUrl, lastmod, alternateRefs },
    { loc: arUrl, lastmod, alternateRefs },
  ]
}
