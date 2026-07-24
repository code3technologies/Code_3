import type { WhyChooseUsAboutBlock as WhyChooseUsAboutBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { IconMedia } from '@/components/site/IconMedia'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & WhyChooseUsAboutBlockProps

export const WhyChooseUsAboutBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  features = [],
}) => {
  return (
    <section className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-10">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {features && features.length > 0 && (
          <Reveal
            delayMs={100}
            className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border"
          >
            {features.map((feature, index) => (
              <div key={feature.id || index} className="border-r border-b border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon && (
                    <span className="h-11 w-11 flex-none rounded-full bg-[#FDEBEC] flex items-center justify-center overflow-hidden">
                      <IconMedia resource={feature.icon} className="w-6 h-6 object-contain" />
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
