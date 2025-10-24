'use client'
import type { ServicesHeroBlock as ServicesHeroBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
} & ServicesHeroBlockProps

export const ServicesHeroBlock: React.FC<Props> = ({
  className,
  title = 'OUR SERVICES',
  subtitle = 'Your Technology, Secured & Simplified',
  buttonText = 'See Our Services',
  buttonLink,
  image1,
  image2,
}) => {
  const getImageUrl = (image: any) => {
    if (!image) return ''
    return typeof image === 'string' ? image : image.url || ''
  }

  return (
    <div className={cn('', className)}>
      {/* Mobile Layout */}
      <div className="md:hidden py-8 bg-[linear-gradient(-70deg,#000000f1_0%,#C90E1D_12%,transparent_35%)]">
        <div className="mx-auto px-4 sm:px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-6xl font-semibold text-[#C90E1D]">
              {title.split(' ').map((word, index) => (
                <React.Fragment key={index}>
                  {word}
                  {index < title.split(' ').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <div className="space-y-3 mt-8">
              <h2 className="text-xl max-w-xs font-semibold text-gray-800">{subtitle}</h2>
              {buttonText && (
                <Button
                    variant="default"
                  onClick={() => {
                    if (buttonLink && buttonLink !== '#') {
                        window.open(buttonLink, '_blank')
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
            <div className="w-full">
              <img
                src={getImageUrl(image1)}
                alt="Business meeting"
                className="w-full aspect-4/3 object-cover rounded-[2rem] shadow-md"
              />
            </div>
            <div className="w-full">
              <img
                src={getImageUrl(image2)}
                alt="Professional team"
                className="w-full aspect-video object-cover rounded-[2rem] shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden px-6 lg:px-8 md:flex max-w-[2000px] mx-auto xl:min-h-[680px] bg-[linear-gradient(-30deg,#000000f1_0%,#C90E1D_12%,transparent_35%)]">
        <div className="mx-auto py-12 max-w-7xl">
          <div className="flex justify-between items-end">
            <h1 className="text-[6rem] xl:text-[8.5rem] font-bold text-[#C90E1D]">
              {title.split(' ')[0]}
            </h1>
            <div className="mb-5">
              {buttonText && (
                <Button
                    variant="default"
                  onClick={() => {
                    if (buttonLink && buttonLink !== '#') {
                      window.open(buttonLink, '_blank')
                    }
                  }}
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="flex col-span-4 flex-col justify-between">
              <h1 className="text-[6rem] translate-y-[-52px] xl:translate-y-[-72px] xl:text-[8.5rem] font-bold text-[#C90E1D]">
                {title.split(' ')[1]}
              </h1>
              <h3 className="lg:text-3xl text-xl max-w-xs mb-4 font-semibold text-gray-800">
                {subtitle}
              </h3>
            </div>
            <div className="md:col-span-4 lg:col-span-3 mt-auto">
              <img
                src={getImageUrl(image1)}
                alt="Business meeting discussion"
                className="aspect-[4/3] min-w-full object-cover rounded-[2rem] shadow-lg"
              />
            </div>
            <div className="md:col-span-4 lg:col-span-5 mt-auto">
              <img
                src={getImageUrl(image2)}
                alt="Professional team collaboration"
                className="md:aspect-square lg:aspect-[6/4] object-cover min-w-full rounded-[2rem] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
