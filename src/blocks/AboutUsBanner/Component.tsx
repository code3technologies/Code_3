'use client'

import type { AboutUsBannerBlock as AboutUsBannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type Props = {
  className?: string
} & AboutUsBannerBlockProps

export const AboutUsBannerBlock: React.FC<Props> = ({
  className,
  subtitle,
  description,
  links,
  mobileImages = [],
  desktopImages = [],
}) => {
  return (
    <div className={cn('', className)}>
      {/* Mobile Layout */}
      <div className="md:hidden pt-10 pb-8 bg-[linear-gradient(-70deg,#000000f1_0%,#C90E1D_12%,transparent_35%)]">
        <div className="mx-auto px-4 pb-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-[6rem] md:col-span-2 font-semibold text-primary_red">
              ABOUT
              <br />
              US
            </h1>
            <div className="space-y-3 mt-8">
              <h2 className="text-3xl font-semibold text-gray-800">{subtitle}</h2>
              <p className="text-md text-gray-700 max-w-xs">{description}</p>
              {links && links.length > 0 && (
                <div>
                  {links.map(({ link }, i) => {
                    return <CMSLink key={i} size="alignLeft" {...link} />
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            {mobileImages?.map((imageData, index) => {
              if (!imageData.image) return null

              return (
                <div 
                  key={index} 
                  className={cn(
                    'w-full relative rounded-[2rem] shadow-md overflow-hidden',
                    imageData.aspectRatio || 'aspect-4/3'
                  )}
                >
                  <Media
                    resource={imageData.image}
                    fill
                    imgClassName="object-cover"
                    priority={index === 0}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-[2000px] mx-auto xl:min-h-[760px] bg-[linear-gradient(-30deg,#000000f1_0%,#C90E1D_12%,transparent_35%)]">
        <div className="container mx-auto px-4 py-16 max-w-[1400px]">
          <div className="flex justify-between items-end">
            <h1 className="text-[7rem] xl:text-[9rem] font-bold text-primary_red">ABOUT</h1>
            <div className="pb-4">
              {links && links.length > 0 && (
                <div>
                  {links.map(({ link }, i) => {
                    return <CMSLink key={i} size="alignRight" {...link} />
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col justify-between">
              <h1 className="text-[7rem] translate-y-[-52px] xl:text-[9rem] font-bold text-primary_red">
                US
              </h1>
              <p className="md:text-sm lg:text-lg text-gray-600">{description}</p>
            </div>
            <div className="col-span-2">
              {desktopImages?.[0]?.image && (
                <div className={cn(
                  'relative rounded-[2rem] shadow-lg overflow-hidden',
                  desktopImages[0].aspectRatio || 'aspect-6/3'
                )}>
                  <Media
                    resource={desktopImages[0].image}
                    fill
                    imgClassName="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
            <div className="">
              {desktopImages?.[1]?.image && (
                <div className={cn(
                  'relative rounded-[2rem] shadow-lg overflow-hidden',
                  desktopImages[1].aspectRatio || 'aspect-6/3',
                  desktopImages[1].hasMarginBottom && 'mb-4'
                )}>
                  <Media
                    resource={desktopImages[1].image}
                    fill
                    imgClassName="object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl lg:text-2xl font-semibold leading-6 lg:leading-8 text-gray-800">
                {subtitle}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
