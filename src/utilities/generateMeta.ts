import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getSiteVerification } from './getSiteVerification'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/code3-social-share.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

// Posts only ever have a `content` field, Pages only ever have `layout` - used to
// tell them apart since generateMeta accepts either.
const getCanonicalBasePath = (doc: Partial<Page> | Partial<Post> | null): string => {
  if (!doc?.slug) return '/'
  if ('layout' in doc) {
    if (doc.slug === 'home') return '/'
    const page = doc as Partial<Page>
    return page.serviceCategory && page.serviceCategory !== 'none'
      ? `/service/${doc.slug}`
      : `/${doc.slug}`
  }
  return `/posts/${doc.slug}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title || 'Code 3'

  const basePath = getCanonicalBasePath(doc)
  const arPath = basePath === '/' ? '/ar' : `/ar${basePath}`

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    alternates: {
      canonical: basePath,
      languages: {
        en: basePath,
        ar: arPath,
      },
    },
    verification: getSiteVerification(),
    title,
    keywords: doc?.meta?.keywords || undefined,
  }
}
