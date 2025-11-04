'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

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
  showGradientLine = true,
}) => {
    return (
        <section className={cn('py-[72px] px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#F7F7F7] to-transparent relative', className)}>
            {showGradientLine && (
                <div className="absolute bg-gradient-to-r from-transparent via-primary_red to-transparent w-[80%] h-[1px] z-[5] bottom-0 left-1/2 -translate-x-1/2"></div>
            )}
            <div className="max-w-5xl mx-auto text-center flex flex-col gap-3 md:gap-6">
                {serviceBadge && (
                    <div className="inline-block w-max mx-auto bg-[#F5D9D9] text-[#BE251F] text-md font-semibold px-3 py-1 md:px-6 md:py-2 rounded-full uppercase tracking-wider">
                        {serviceBadge}
                    </div>
                )}
                {/* Service Name Badge */}
                <div className="my-8 text-primary_red text-4xl md:text-6xl  font-bold">
                    {serviceName}
                </div>

                {/* Main Heading */}
                {title && (
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                        {title}
                    </h1>
                )}

                {/* Subtitle/Description */}
                <p className="px-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    )
}
