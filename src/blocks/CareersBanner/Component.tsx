'use client'

import type { CareersBlock as CareersBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Button } from '@/components/ui/button'

type Props = CareersBlockProps & {
  className?: string
}

export const CareersBlock: React.FC<Props> = ({
  className,
  title = 'CAREERS',
  subtitle = 'Join Us. Build the Future.',
  description = 'At CODE3, we believe in people who push boundaries, embrace challenges, and create impactful solutions.',
  buttonText = 'See Open Positions',
  buttonLink = '#',
  teamImages,
}) => {
  // Helper function to generate responsive classes for each team member
  const getResponsiveClasses = (member: NonNullable<typeof teamImages>[number]) => {
    return cn(
      `aspect-[1/1]`,
      `sm:aspect-[2/3]`,
      `lg:aspect-[2/3]`,
      member.hasTopMargin && 'sm:mt-8 xl:mt-10',
      member.isVisibleOnMobile ? 'block' : 'hidden',
      member.isVisibleOnTablet ? 'sm:block' : 'sm:hidden',
      member.isVisibleOnDesktop ? 'lg:block' : 'lg:hidden'
    )
  }

  if (!teamImages || teamImages.length === 0) return null

  return (
    <div
      className={cn(
        'py-8 lg:py-16 max-w-[2000px] mx-auto bg-[linear-gradient(-70deg,#000000f1_0%,#C90E1D_12%,transparent_35%)] md:bg-[linear-gradient(-50deg,#000000f1_0%,#C90E1D_12%,transparent_35%)]',
        className
      )}
    >
      {/* Header Section */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 max-w-[1400px] mx-auto md:grid-cols-3 gap-4 sm:gap-x-26 sm:gap-y-20 md:gap-x-0">
        {/* Left Side - Title and Content */}
        <h1 className="text-6xl md:text-[5.5rem] md:col-span-2 lg:text-[8rem] xl:text-[10rem] font-semibold text-[#C90E1D] mb-6 lg:mb-8">
          {title}
        </h1>
        <div className="space-y-4 sm:mt-3 md:mt-6 lg:mt-8 xl:mt-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800">
            {subtitle}
          </h2>
          <p className="text-sm lg:text-base xl:text-xl text-gray-800 max-w-sm xl:max-w-2xl">
            {description}
          </p>
          {buttonText && (
            <Button
              variant="buttonWithGradientOnHover"
              size="alignLeft"
              onClick={() => {
                if (buttonLink && buttonLink !== '#') {
                  window.open(buttonLink, '_self')
                }
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* Team Images */}
        <div className="grid sm:col-span-2 md:col-span-3 grid-cols-1 lg:grid-cols-5 sm:grid-cols-3 gap-4">
          {teamImages.map((teamMember, index) => {
            if (!teamMember || !teamMember.image) return null

            const imageUrl =
              typeof teamMember.image === 'string' ? teamMember.image : teamMember.image.url || ''

            return (
              <div key={index} className={getResponsiveClasses(teamMember)}>
                <img
                  src={imageUrl}
                  alt={teamMember.alt || 'Team member'}
                  className="w-full h-full object-cover object-top rounded-[2rem]"
                  onError={(e) => {
                    console.error('Team image failed to load:', e.currentTarget.src)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}