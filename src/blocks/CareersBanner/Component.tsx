'use client'

import type { CareersBlock as CareersBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'

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
  const getResponsiveClasses = (member: NonNullable<typeof teamImages>[number]) => {
    return cn(
      member.hasTopMargin && 'sm:mt-8 xl:mt-10',
      member.isVisibleOnMobile ? 'block' : 'hidden',
      member.isVisibleOnTablet ? 'sm:block' : 'sm:hidden',
      member.isVisibleOnDesktop ? 'lg:block' : 'lg:hidden'
    )
  }

  const handleScrollToOpenings = () => {
    const openingsElement = document.getElementById('current-openings')
    if (openingsElement) {
      openingsElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
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
        <h1 className="text-6xl md:text-[5.5rem] md:col-span-2 lg:text-[8rem] xl:text-[10rem] font-semibold text-primary_red mb-6 lg:mb-8">
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
              onClick={handleScrollToOpenings}
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* Team Images */}
        <div className="grid sm:col-span-2 md:col-span-3 grid-cols-1 lg:grid-cols-5 sm:grid-cols-3 gap-4">
          {teamImages.map((teamMember, index) => {
            if (!teamMember || !teamMember.image) return null

            return (
              <div key={index} className={getResponsiveClasses(teamMember)}>
                <Media
                  resource={teamMember.image}
                  imgClassName="aspect-square md:aspect-[2/3] w-full h-full object-cover object-top rounded-[2rem]"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}