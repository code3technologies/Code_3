import React from 'react'
import type { Code3HeroBlock as Code3HeroBlockProps } from '@/payload-types'
import { Hero } from '@/components/code3-home/Hero'
import type { HeroSlideData } from '@/components/code3-home/Hero'

export const Code3HeroBlock: React.FC<Code3HeroBlockProps> = ({ slides }) => {
  const mapped: HeroSlideData[] = (slides || []).map((slide) => ({
    image: typeof slide.image === 'object' && slide.image?.url ? slide.image.url : '',
    eyebrow: slide.eyebrow,
    headlineText: slide.headlineText,
    headlineHighlight: slide.headlineHighlight,
    sub: slide.subtext,
  }))

  return <Hero slides={mapped.length > 0 ? mapped : undefined} />
}
