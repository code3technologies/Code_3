import React from 'react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

interface ServiceDetailBannerBlockProps {
  serviceName?: string
  title?: string
  description?: string
  showGradientLine?: boolean
  className?: string
  serviceBadge?: string
}

type Props = ServiceDetailBannerBlockProps

export const ServiceDetailBannerBlock: React.FC<Props> = ({
  className,
  serviceBadge,
  serviceName,
  title,
  description,
}) => {
  return (
    <section className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          {(serviceBadge || serviceName) && <Eyebrow>{serviceBadge || serviceName}</Eyebrow>}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
            {title || serviceName}
          </h1>
          {description && <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>}
        </Reveal>
      </div>
    </section>
  )
}
