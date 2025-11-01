'use client'

import type { WhyChooseUsBlock as WhyChooseUsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Media } from '@/components/Media'

type Props = {
  className?: string
} & WhyChooseUsBlockProps

export const WhyChooseUsBlock: React.FC<Props> = ({
  className,
  badge = 'WHY CHOOSE US',
  title = 'Why Businesses Trust Us',
  subtitle = "Designing the right technology partner isn't just about products — it's about reliability, capabilities, and support that never stops.",
  features = [],
}) => {
  return (
    <div className={cn('py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden', className)}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-[64px]">
          <div className="inline-block bg-[#C90E1D] border border-[#FF3B4B] text-white text-xs font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 gap-6 lg:gap-8">
          {features?.map((feature, index) => {
            if (!feature.image) return null

            const colSpanClass = feature.colSpan === '5' ? 'md:col-span-5' : 'md:col-span-4'
            const heightClass =
              feature.colSpan === '5'
                ? 'sm:h-[20rem] lg:h-[26rem] h-[26rem]'
                : 'sm:h-[20rem] lg:h-[26rem] h-[21rem]'
            const textColorClass = feature.textColor === 'black' ? 'text-black' : 'text-white'
            const contentPositionClass =
              feature.contentPosition === 'center' ? 'lg:bottom-[53%]' : 'bottom-12'

            return (
              <div key={index} className={cn('relative group card-hover', colSpanClass)}>
                <div
                  className={cn(
                    'bg-white rounded-3xl border border-[#CACACA] overflow-hidden',
                    heightClass,
                  )}
                >
                  <div className="relative h-full flex flex-col justify-between overflow-hidden">
                    <Media
                      resource={feature.image}
                      imgClassName="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    {feature.hasGradient && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-6 left-6 lg:top-10 lg:left-10">
                      <span className="bg-white text-gray-800 backdrop-blur-sm border border-[#CACACA] px-4 py-2 rounded-full text-xs font-medium">
                        {feature.title}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className={cn(
                        'absolute left-6 right-6 lg:left-12',
                        contentPositionClass,
                        'bottom-8',
                        textColorClass,
                      )}
                    >
                      <p
                        className={cn(
                          'text-md lg:text-xl leading-6 font-medium',
                          feature.colSpan === '4' ? 'max-w-sm' : 'max-w-sm lg:max-w-xs',
                          feature.colSpan === '5' && index === 2 && 'lg:max-w-[12rem]',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
