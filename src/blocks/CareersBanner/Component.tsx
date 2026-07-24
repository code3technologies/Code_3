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
  teamImages,
}) => {
  const handleScrollToOpenings = () => {
    document.getElementById('current-openings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const visibleImages = (teamImages || []).filter((member) => member?.image)

  return (
    <section className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          {title && <Eyebrow>{title}</Eyebrow>}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
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

        {visibleImages.length > 0 && (
          <Reveal delayMs={100} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {visibleImages.map((teamMember, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-2xl border border-border"
              >
                <Media resource={teamMember.image!} fill imgClassName="object-cover" />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
