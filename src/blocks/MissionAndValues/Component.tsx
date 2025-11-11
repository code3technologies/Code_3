import type { MissionAndValuesBlock as MissionAndValuesBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Media } from '@/components/Media'

type Props = {
  className?: string
} & MissionAndValuesBlockProps

export const MissionAndValuesBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  missionCard,
  visionCard,
  valuesCard,
}) => {
  return (  
    <section className={cn('py-12 px-6 max-w-7xl mx-auto', className)}>
      {/* Header Section - Centered */}
      <div className="text-center sm:text-start mb-12">
        {/* Red Badge */}
        <div className="inline-block bg-primary_red border border-secondary_red text-white text-xs font-semibold px-5 py-2 rounded-full mb-4 uppercase tracking-wider">
          {badge}
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">{title}</h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-base md:text-lg max-w-sm sm:max-w-2xl mx-auto sm:mx-0">
          {subtitle}
        </p>
      </div>

      {/* Three Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[76.5rem] mx-auto">
        {/* Mission Card */}
        {missionCard && (
          <div className="bg-[#FAFAFA] flex flex-col justify-between border border-[#E0DDDD] rounded-[32px] p-8 text-left">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              {missionCard.icon && (
                <Media
                  resource={missionCard.icon}
                  imgClassName="w-[62px] h-[62px] object-contain"
                />
              )}
            </div>

            {/* Title */}
            <h2 className="text-primary_red text-2xl lg:text-3xl font-semibold pb-[72px] uppercase tracking-wider">
              {missionCard.title}
            </h2>

            {/* Content */}
            <p className="text-gray-800 lg:text-lg leading-6">{missionCard.content}</p>
          </div>
        )}

        {/* Vision Card */}
        {visionCard && (
          <div className="bg-[#FAFAFA] flex flex-col justify-between border border-[#E0DDDD] rounded-[32px] p-8 text-left">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              {visionCard.icon && (
                <Media
                  resource={visionCard.icon}
                  imgClassName="w-[62px] h-[62px] object-contain"
                />
              )}
            </div>

            {/* Title */}
            <h2 className="text-primary_red text-2xl lg:text-3xl font-semibold pb-[72px] uppercase tracking-wider">
              {visionCard.title}
            </h2>

            {/* Content */}
            <p className="text-gray-800 lg:text-lg leading-6">{visionCard.content}</p>
          </div>
        )}

        {/* Values Card */}
        {valuesCard && (
          <div className="bg-[#FAFAFA] flex flex-col justify-between border border-[#E0DDDD] rounded-[32px] p-8 text-left">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              {valuesCard.icon && (
                <Media
                  resource={valuesCard.icon}
                  imgClassName="w-[62px] h-[62px] object-contain"
                />
              )}
            </div>

            {/* Title */}
            <h2 className="text-primary_red text-2xl lg:text-3xl font-semibold pb-[72px] uppercase tracking-wider">
              {valuesCard.title}
            </h2>

            {/* Values Content */}
            <div className="text-gray-800 leading-6 lg:text-lg space-y-1">{valuesCard.content}</div>
          </div>
        )}
      </div>
    </section>
  )
}
