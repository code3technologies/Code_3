import type { AboutUsBannerBlock as AboutUsBannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & AboutUsBannerBlockProps

export const AboutUsBannerBlock: React.FC<Props> = ({
  className,
  title,
  subtitle,
  description,
  links,
  mobileImages = [],
  desktopImages = [],
}) => {
  return (
    <section className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          {title && <Eyebrow>{title}</Eyebrow>}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
            {subtitle}
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>
          {links && links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} />
              ))}
            </div>
          )}
        </Reveal>

        {/* Desktop images */}
        <Reveal delayMs={100} className="hidden md:grid grid-cols-2 gap-6">
          {desktopImages?.map((imageData, index) => {
            if (!imageData.image) return null
            return (
              <div
                key={index}
                className={cn(
                  'relative w-full overflow-hidden rounded-2xl border border-border',
                  imageData.aspectRatio || 'aspect-6/3',
                  imageData.hasMarginBottom && 'self-start',
                )}
              >
                <Media resource={imageData.image} fill imgClassName="object-cover" priority={index === 0} />
              </div>
            )
          })}
        </Reveal>

        {/* Mobile images */}
        <Reveal delayMs={100} className="md:hidden flex flex-col gap-4">
          {mobileImages?.map((imageData, index) => {
            if (!imageData.image) return null
            return (
              <div
                key={index}
                className={cn(
                  'relative w-full overflow-hidden rounded-2xl border border-border',
                  imageData.aspectRatio || 'aspect-4/3',
                )}
              >
                <Media resource={imageData.image} fill imgClassName="object-cover" priority={index === 0} />
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
