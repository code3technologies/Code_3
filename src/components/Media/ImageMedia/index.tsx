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

// Last-resort alt text when a media record has none: a readable name from the
// file name ("Lulu Group Logo.jpg" -> "Lulu Group Logo"), dropping the random
// blob suffix and generated size suffix so it never reads as "abc123XyZ".
const altFromFilename = (filename?: string | null): string => {
  if (!filename) return ''
  return filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/-\d+x\d+$/, '')
    .replace(/-[A-Za-z0-9]{20,}$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    quality = 82,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
    onError,
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
      (resource && typeof resource === 'object' ? altFromFilename(resource.filename) : '')

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
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth, filename } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || altFromProps || altFromFilename(filename)

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
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={shimmerDataURL}
        priority={priority}
        quality={quality}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
        onError={onError}
      />
    </picture>
  )
}
