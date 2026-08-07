import type { WhyChooseUsAboutBlock as WhyChooseUsAboutBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { IconMedia } from '@/components/site/IconMedia'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'
import { ClearQuickEnquiry } from '@/components/site/ClearQuickEnquiry'

type Props = {
  className?: string
} & WhyChooseUsAboutBlockProps

export const WhyChooseUsAboutBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  features = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow className="text-base md:text-lg">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {features && features.length > 0 && (
          <>
            <ClearQuickEnquiry />
            <Reveal
              delayMs={100}
              className={cn(
                'grid grid-cols-1 gap-4 sm:grid-cols-2',
                features.length === 1 && 'lg:grid-cols-1',
                features.length === 2 && 'lg:grid-cols-2',
                features.length === 3 && 'lg:grid-cols-3',
                features.length >= 4 && 'lg:grid-cols-4',
              )}
            >
              {features.map((feature, index) => (
                <div
                  key={feature.id || index}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-[#FDEBEC] text-primary_red transition-transform duration-300 group-hover:scale-105">
                    {feature.icon && typeof feature.icon === 'object' ? (
                      <IconMedia resource={feature.icon} className="h-6 w-6 object-contain" />
                    ) : (
                      <span className="text-base font-bold">{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </div>
              ))}
            </Reveal>
          </>
        )}

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-6" />
      </div>
    </section>
  )
}
