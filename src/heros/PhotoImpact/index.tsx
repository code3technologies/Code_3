import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// A full-bleed photo hero, distinct from HighImpact's abstract animated
// gradient - built for pages (like About) where a real photo tells the
// story better than illustrated icons and a stat carousel.
export const PhotoImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText, media }) => {
  return (
    <section className="relative w-full overflow-hidden bg-foreground">
      <div className="relative flex min-h-[26rem] w-full items-center md:min-h-[34rem]">
        {media && typeof media === 'object' && (
          <Media
            resource={media}
            fill
            priority
            imgClassName="object-cover"
            pictureClassName="absolute inset-0"
            className="absolute inset-0"
          />
        )}

        {/* Dark gradient overlays - left-to-right for text legibility over
            whatever the photo shows, plus a light bottom fade for polish. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
        />

        <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl">
              {HeroText}
            </h1>
            {subText && (
              <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">{subText}</p>
            )}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      size="lg"
                      className={cn(
                        'w-full sm:w-auto',
                        link.appearance === 'default' && 'shadow-[0_8px_30px_-6px_rgba(201,14,29,0.65)]',
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
