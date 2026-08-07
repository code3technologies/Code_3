'use client'

import type { CareersBlock as CareersBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = CareersBlockProps & {
  className?: string
}

export const CareersBlock: React.FC<Props> = ({
  className,
  title,
  subtitle,
  description,
  buttonText,
  cultureBadge,
  cultureHeading,
  cultureDescription,
  cultureLinkText,
  cultureLinkHref,
  teamImages,
}) => {
  const handleScrollToOpenings = () => {
    document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const visibleImages = (teamImages || []).filter((member) => member?.image)
  const showCultureCard = Boolean(cultureHeading)

  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={cn('grid gap-10', showCultureCard && 'lg:grid-cols-2 lg:items-center')}>
          <Reveal className="max-w-2xl">
            {title && <Eyebrow>{title}</Eyebrow>}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              {subtitle}
            </h1>
            {description && <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>}
            {buttonText && (
              <div className="mt-6">
                <Button variant="default" onClick={handleScrollToOpenings}>
                  {buttonText}
                </Button>
              </div>
            )}
          </Reveal>

          {showCultureCard && (
            <Reveal delayMs={100}>
              <div className="rounded-2xl bg-gray-50 p-8 md:p-10">
                {cultureBadge && (
                  <span className="text-sm md:text-base font-semibold uppercase tracking-[0.12em] text-primary_red">
                    {cultureBadge}
                  </span>
                )}
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {cultureHeading}
                </h2>
                {cultureDescription && (
                  <p className="mt-4 text-gray-600 leading-relaxed">{cultureDescription}</p>
                )}
                {cultureLinkText && cultureLinkHref && (
                  <a
                    href={cultureLinkHref}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary_red hover:text-primary_red"
                  >
                    {cultureLinkText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {visibleImages.length > 0 && (
          <Reveal delayMs={100} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {visibleImages.map((teamMember, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-2xl border border-border"
              >
                <Media
                  resource={teamMember.image!}
                  fill
                  size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  imgClassName="object-cover"
                />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
