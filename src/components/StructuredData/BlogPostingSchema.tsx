import type { Post, Header, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'

// Every post has an author assigned (see populatedAuthors / populateAuthors.ts)
// but until now that was rendered as plain byline text only - nothing told
// Google or AI answer engines who wrote the piece or when, which is exactly
// what the Expertise/Authoritativeness side of E-E-A-T looks for. Same
// rationale as ServiceSchema for /service pages.
export const BlogPostingSchema = async ({ post, path }: { post: Post; path: string }) => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')
  const absoluteUrl = (url: string) => (url.startsWith('http') ? url : `${siteUrl}${url}`)

  const authors = (post.populatedAuthors || []).filter(
    (a): a is { id?: string | null; name?: string | null; jobTitle?: string | null; linkedinUrl?: string | null } =>
      !!a?.name,
  )
  const imageUrl =
    post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url
      ? absoluteUrl(post.heroImage.url)
      : undefined

  // Google's Article/BlogPosting guidelines recommend publisher.logo, ideally
  // square - use the header global's logo (the site's actual rendered logo;
  // the footer global's own `logo` field is a stale/broken relationship) and
  // its pre-generated square crop.
  const headerData = (await getCachedGlobal('header', 1, 'en')()) as Header
  const logo = headerData?.logo as Media | undefined
  const square = logo?.sizes?.square
  const logoUrl = square?.url ? getMediaUrl(square.url) : logo?.url ? getMediaUrl(logo.url) : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author:
      authors.length > 0
        ? authors.map((a) => ({
            '@type': 'Person',
            name: a.name,
            ...(a.jobTitle ? { jobTitle: a.jobTitle } : {}),
            ...(a.linkedinUrl ? { sameAs: [a.linkedinUrl] } : {}),
          }))
        : { '@type': 'Organization', name: 'CODE3 Technologies' },
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
