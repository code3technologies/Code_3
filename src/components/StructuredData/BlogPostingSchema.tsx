import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// Every post has an author assigned (see populatedAuthors / populateAuthors.ts)
// but until now that was rendered as plain byline text only - nothing told
// Google or AI answer engines who wrote the piece or when, which is exactly
// what the Expertise/Authoritativeness side of E-E-A-T looks for. Same
// rationale as ServiceSchema for /service pages.
export const BlogPostingSchema = ({ post, path }: { post: Post; path: string }) => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')
  const absoluteUrl = (url: string) => (url.startsWith('http') ? url : `${siteUrl}${url}`)

  const authors = (post.populatedAuthors || []).filter(
    (a): a is { id?: string | null; name?: string | null } => !!a?.name,
  )
  const imageUrl =
    post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url
      ? absoluteUrl(post.heroImage.url)
      : undefined

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
        ? authors.map((a) => ({ '@type': 'Person', name: a.name }))
        : { '@type': 'Organization', name: 'CODE3 Technologies' },
    publisher: {
      '@type': 'Organization',
      name: 'CODE3 Technologies',
      url: siteUrl,
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
