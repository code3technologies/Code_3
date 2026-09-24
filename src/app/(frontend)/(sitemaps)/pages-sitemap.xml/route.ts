import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    // NEXT_PUBLIC_SERVER_URL has a trailing slash in Vercel, which produced
    // "//" in every URL below.
    const SITE_URL = (
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'
    ).replace(/\/+$/, '')

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        serviceCategory: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            // Service pages are served under /service/ (same rule as
            // getPagePath in admin-revalidate-all and generateMeta's
            // canonical) - listing them at the bare slug pointed Google at
            // URLs that duplicate/404 instead of the real ones.
            const isService = !!page.serviceCategory && page.serviceCategory !== 'none'
            const path = page.slug === 'home' ? '/' : isService ? `/service/${page.slug}` : `/${page.slug}`
            return {
              loc: `${SITE_URL}${path}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    // Product pages at /service/device/<slug> are public and indexable but
    // were missing from every sitemap.
    const devices = await payload.find({
      collection: 'devices',
      depth: 0,
      limit: 500,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    const deviceSitemap = devices.docs
      .filter((device) => Boolean(device?.slug))
      .map((device) => ({
        loc: `${SITE_URL}/service/device/${device.slug}`,
        lastmod: device.updatedAt || dateFallback,
      }))

    return [...defaultSitemap, ...sitemap, ...deviceSitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
