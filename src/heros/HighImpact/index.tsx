'use client'
import React, { useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Eyebrow } from '@/components/site/Eyebrow'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, HeroText, subText }) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-3xl">
          <Eyebrow>IT Infrastructure · Cybersecurity · Digital Growth</Eyebrow>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-foreground">
            {HeroText}
          </h1>
          {subText && (
            <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 max-w-2xl">
              {subText}
            </p>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="mt-8 flex w-full flex-col sm:flex-row gap-3">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} size="default" className="w-full sm:w-auto" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {media && typeof media === 'object' && !imageFailed && (
          <div className="mt-12 md:mt-16 w-full rounded-2xl overflow-hidden relative aspect-[16/7] border border-border">
            <Media
              fill
              imgClassName="object-cover"
              priority
              resource={media}
              onError={() => setImageFailed(true)}
            />
          </div>
        )}
      </div>
    </section>
  )
}
