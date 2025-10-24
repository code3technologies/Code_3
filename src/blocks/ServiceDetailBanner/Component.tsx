'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface ServiceDetailBannerBlockProps {
  serviceName?: string
  title?: string
  description?: string
  showGradientLine?: boolean
  className?: string
}

type Props = ServiceDetailBannerBlockProps

export const ServiceDetailBannerBlock: React.FC<Props> = ({
  className,
  serviceName = 'IT AMC',
  title = 'Peace of Mind, Powered by IT AMC.',
  description = 'From technology infrastructure to digital growth, we deliver end-to-end solutions that help your business run smarter and grow faster.',
  showGradientLine = true,
}) => {
    return (
        <section className={cn('py-[72px] px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#F7F7F7] to-transparent relative', className)}>
            {showGradientLine && (
                <div className="absolute bg-gradient-to-r from-transparent via-[#C90E1D] to-transparent w-[80%] h-[1px] z-[5] bottom-0 left-1/2 -translate-x-1/2"></div>
            )}
            <div className="max-w-5xl mx-auto text-center flex flex-col gap-3 md:gap-6">
                {/* Service Name Badge */}
                <div className="my-10 md:my-14 text-[#C90E1D] text-5xl md:text-6xl lg:text-7xl font-bold">
                    {serviceName}
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    {title}
                </h1>

                {/* Subtitle/Description */}
                <p className="px-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    )
}
