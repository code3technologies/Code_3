'use client'

import type { AboutUsBannerBlock as AboutUsBannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
} & AboutUsBannerBlockProps

export const AboutUsBannerBlock: React.FC<Props> = ({
  className,
  subtitle = "See Why We're the Better Choice",
  description = 'No guesswork. Transparent side-by-side comparison to help you choose confidently',
  buttonText = 'See Our Services',
  buttonLink = '#',
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
            <h1 className="text-7xl md:text-[6rem] md:col-span-2 font-semibold text-[#C90E1D]">
              ABOUT
              <br />
              US
            </h1>
            <div className="space-y-3 mt-8">
              <h2 className="text-3xl font-semibold text-gray-800">{subtitle}</h2>
              <p className="text-md text-gray-700 max-w-xs">{description}</p>
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
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            {mobileImages?.map((imageData, index) => {
              if (!imageData.image) return null

              const imageUrl =
                typeof imageData.image === 'string' ? imageData.image : imageData.image.url || ''

              return (
                <div key={index} className="w-full">
                  <img
                    src={imageUrl}
                    alt={imageData.alt || 'About us image'}
                    className={cn(
                      'w-full object-cover rounded-[2rem] shadow-md',
                      imageData.aspectRatio || 'aspect-4/3',
                    )}
                    onError={(e) => {
                      console.error('Mobile image failed to load:', e.currentTarget.src)
                      e.currentTarget.style.display = 'none'
                    }}
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
            <h1 className="text-[7rem] xl:text-[9rem] font-bold text-red-600">ABOUT</h1>
            <div className="pb-4">
              {buttonText && (
                <Button
                  variant="buttonWithGradientOnHover"
                  size="alignRight"
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
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col justify-between">
              <h1 className="text-[7rem] translate-y-[-52px] xl:text-[9rem] font-bold text-red-600">
                US
              </h1>
              <p className="md:text-sm lg:text-lg text-gray-600">{description}</p>
            </div>
            <div className="col-span-2">
              {desktopImages?.[0]?.image && (
                <img
                  src={
                    typeof desktopImages[0].image === 'string'
                      ? desktopImages[0].image
                      : desktopImages[0].image.url || ''
                  }
                  alt={desktopImages[0].alt || 'About us image'}
                  className={cn(
                    'aspect-6/3 min-w-full object-cover rounded-[2rem] shadow-lg',
                    desktopImages[0].aspectRatio || 'aspect-6/3',
                  )}
                  onError={(e) => {
                    console.error('Desktop image 1 failed to load:', e.currentTarget.src)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
            <div className="">
              {desktopImages?.[1]?.image && (
                <img
                  src={
                    typeof desktopImages[1].image === 'string'
                      ? desktopImages[1].image
                      : desktopImages[1].image.url || ''
                  }
                  alt={desktopImages[1].alt || 'About us image'}
                  className={cn(
                    'aspect-6/3 object-cover rounded-[2rem] shadow-lg',
                    desktopImages[1].aspectRatio || 'aspect-6/3',
                    desktopImages[1].hasMarginBottom && 'mb-4',
                  )}
                  onError={(e) => {
                    console.error('Desktop image 2 failed to load:', e.currentTarget.src)
                    e.currentTarget.style.display = 'none'
                  }}
                />
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
