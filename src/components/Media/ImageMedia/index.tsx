'use client'

import type { StaticImageData } from 'next/image'
import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React from 'react'
import type { Props as MediaProps } from '../types'
import { cssVariables } from '@/cssVariables'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { shimmer, toBase64 } from '@/utilities/shimmer'

const { breakpoints } = cssVariables

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  // Image referenced by an external URL (no uploaded file). Rendered with a plain
  // <img> so it bypasses blob storage and Next's remote-image allowlist, and works
  // without known dimensions.
  const externalUrl =
    resource && typeof resource === 'object' && typeof resource.externalUrl === 'string'
      ? resource.externalUrl.trim()
      : ''

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  if (!srcFromProps && externalUrl) {
    const externalAlt =
      altFromProps ||
      (resource && typeof resource === 'object' ? resource.alt || '' : '') ||
      'alt text not provided'

    return (
      <picture className={cn(pictureClassName)}>
        <img
          alt={externalAlt}
          className={cn(imgClassName)}
          loading={loading}
          src={externalUrl}
          style={
            fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined
          }
        />
      </picture>
    )
  }

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''

    const cacheTag = resource.updatedAt
    src = getMediaUrl(url, cacheTag)
  }

  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ')

  if (!src) {
    return null
  }

  const shimmerDataURL = `data:image/svg+xml;base64,${toBase64(
    shimmer(width || 700, height || 475)
  )}`

  return (
    <picture className={cn(pictureClassName)}>
      <NextImage
        alt={alt || 'alt text not provided'}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={shimmerDataURL}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
