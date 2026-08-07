import type { AboutUsBannerBlock as AboutUsBannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & AboutUsBannerBlockProps

export const AboutUsBannerBlock: React.FC<Props> = ({ className, title, subtitle, description, links }) => {
  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          {title && <Eyebrow>{title}</Eyebrow>}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
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
      </div>
    </section>
  )
}
