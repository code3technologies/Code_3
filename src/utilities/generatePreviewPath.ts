import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  serviceCategory?: string | null
}

export const generatePreviewPath = ({ collection, slug, serviceCategory }: Props) => {
  // Service pages are served under /service/[slug] (see getPagePath), so the
  // preview/open-link path must match or it 404s.
  const isServicePage =
    collection === 'pages' && !!serviceCategory && serviceCategory !== 'none'

  const basePath = isServicePage ? '/service' : collectionPrefixMap[collection]

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${basePath}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
