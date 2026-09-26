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
  style,
}) => {
  const isRedGradient = style === 'redGradient'

  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal
          className={cn(
            'relative overflow-hidden rounded-2xl px-8 py-14 text-center md:py-16',
            isRedGradient
              ? 'bg-gradient-to-br from-primary_red to-red-800'
              : 'bg-foreground',
          )}
        >
          {isRedGradient ? (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 left-0 h-56 w-56 rounded-full bg-black/10 blur-3xl"
              />
            </>
          ) : (
            backgroundImage && (
              <>
                <Media
                  resource={backgroundImage}
                  fill
                  imgClassName="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-foreground/70" />
              </>
            )
          )}

          <div className="relative z-[1] mx-auto max-w-2xl">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className={cn('mt-4 leading-relaxed', isRedGradient ? 'text-white/85' : 'text-white/70')}>
                {description}
              </p>
            )}
            {links && links.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {links.map(({ link }, i) => {
                  const isPrimary = link.appearance !== 'outline'
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      // The red-gradient panel already carries the brand color in its
                      // background, so its primary CTA stays a white pill (a red-on-red
                      // button would disappear); the plain dark panel gets the new
                      // gradient-arrow treatment instead.
                      appearance={isPrimary && !isRedGradient ? 'gradientArrow' : link.appearance}
                      className={cn(isRedGradient && isPrimary && 'bg-white !text-primary_red hover:bg-white/90')}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
