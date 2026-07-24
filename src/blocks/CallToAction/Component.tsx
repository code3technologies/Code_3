import React from 'react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & CTABlockProps

export const CallToActionBlock: React.FC<Props> = ({
  className,
  links,
  title,
  description,
  backgroundImage,
}) => {
  return (
    <section className={cn('bg-white py-12 md:py-16', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-2xl bg-foreground px-8 py-14 md:py-16 text-center">
          {backgroundImage && (
            <>
              <Media
                resource={backgroundImage}
                fill
                imgClassName="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-foreground/70" />
            </>
          )}

          <div className="relative z-[1] mx-auto max-w-2xl">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-white/70 leading-relaxed">{description}</p>
            )}
            {links && links.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} {...link} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
