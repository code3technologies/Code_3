import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getSiteVerification } from './getSiteVerification'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/code3-social-share.webp'

  if (image && typeof image === 'object') {
    const externalUrl = 'externalUrl' in image && typeof image.externalUrl === 'string' ? image.externalUrl.trim() : ''

    if (externalUrl) {
      url = externalUrl
    } else if ('url' in image) {
      const src = image.sizes?.og?.url || image.url || ''

      // Vercel Blob storage returns absolute URLs - only prefix relative paths.
      if (src) url = /^https?:\/\//i.test(src) ? src : serverUrl + src
    }
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
  locale?: 'en' | 'ar'
}): Promise<Metadata> => {
  const { doc, locale } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title || 'Code 3'

  const basePath = getCanonicalBasePath(doc)
  const arPath = basePath === '/' ? '/ar' : `/ar${basePath}`

  // Most /ar pages still render English content (untranslated fields fall
  // back to English), so they canonicalise to the English URL to avoid
  // duplicates. A page whose Arabic meta title is actually written in Arabic
  // has been translated, so its /ar URL is canonical for itself.
  const isTranslatedArabic = locale === 'ar' && /[؀-ۿ]/.test(doc?.meta?.title || '')
  const canonicalPath = isTranslatedArabic ? arPath : basePath

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
      url: canonicalPath,
      // Blog posts are articles (with dates) for link previews and crawlers;
      // pages stay "website".
      ...(doc && !('layout' in doc)
        ? {
            type: 'article' as const,
            publishedTime: (doc as Partial<Post>).publishedAt || undefined,
            modifiedTime: doc.updatedAt || undefined,
          }
        : {}),
    }),
    alternates: {
      canonical: canonicalPath,
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
