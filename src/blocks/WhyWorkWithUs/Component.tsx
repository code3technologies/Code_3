import type { WhyWorkWithUsBlock as WhyWorkWithUsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Media } from '@/components/Media'

type Props = {
  className?: string
} & WhyWorkWithUsBlockProps

export const WhyWorkWithUsBlock: React.FC<Props> = ({
  className,
  badge = 'WHY WORK WITH US',
  title = 'Why Businesses Trust Us',
  subtitle = "Choosing the right technology partner isn't just about products — it's about reliability, expertise, and support that never stops",
  features = [],
}) => {
  return (
    <section className={cn('py-12 lg:py-20 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Red Badge */}
          <div className="inline-block bg-primary_red border border-secondary_red text-white text-xs font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
            {badge}
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 max-w-[17rem] sm:max-w-2xl mx-auto">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-base sm:text-lg  sm:max-w-2xl mx-auto leading-relaxed max-w-[20rem]">
            {subtitle.split('—').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && subtitle.includes('—') && (
                  <>
                    —<br className="hidden sm:block" />
                  </>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 gap-6 lg:gap-8">
          {features?.map((feature, index) => (
            <div
              key={feature.id || index}
              className={cn(
                'bg-[#FAFAFA] flex flex-col justify-between border border-[#E0DDDD] rounded-[32px] p-8 text-left max-w-[380px] md:max-w-full mx-auto md:mx-0',
                feature.colSpan === '4' ? 'md:col-span-4' : 'md:col-span-5',
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 flex items-center justify-center mb-6',
                  feature.iconAlignment === 'right' ? 'md:ml-auto' : '',
                )}
              >
                {feature.icon && typeof feature.icon === 'object' && (
                  <Media
                    resource={feature.icon}
                    imgClassName="w-[62px] h-[62px] object-contain"
                  />
                )}
              </div>

              <div>
                {/* Title */}
                <h2 className="text-2xl lg:text-3xl max-w-xs font-semibold mt-14 mb-4 uppercase tracking-wider">
                  {feature.title}
                </h2>

                {/* Content */}
                <p className="text-gray-800 lg:text-lg max-w-md">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
