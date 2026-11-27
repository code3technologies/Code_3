import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  quality?: number // for NextImage only, defaults to 82
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  size?: string // for NextImage only
  // For small images shown at a known fixed width (e.g. logos): renders at that
  // width with a 1x/2x srcset instead of the full responsive set, and no blur
  // placeholder. Keeps pages with many logos from carrying ~5KB of markup each.
  displayWidth?: number // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
  isBgVideo?: boolean // for VideoMedia only
  isBgImage?: boolean // for ImageMedia only
}
