'use client'

import type { TrustedBrandsBlock as TrustedBrandsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'

// Import the Media type from your generated types
import type { Media } from 'src/payload-types'

type Props = {
  className?: string
} & TrustedBrandsBlockProps

export const TrustedBrandsBlock: React.FC<Props> = ({
  className,
  title = 'Trusted by Leading Brands & Certified for Excellence',
  brands = [],
  animationSpeed = 'normal',
  pauseOnHover = true,
}) => {
  // Handle null/undefined brands array
  const safeBrands = brands || []
  
  // Duplicate brands array for seamless infinite scroll (only if we have brands)
  const duplicatedBrands = safeBrands.length > 0 ? [...safeBrands, ...safeBrands, ...safeBrands] : []
  
  // Handle null animationSpeed
  const safeAnimationSpeed = animationSpeed || 'normal'
  
  // Animation speed classes
  const speedClasses = {
    slow: 'animate-scroll-slow',
    normal: 'animate-scroll',
    fast: 'animate-scroll-fast'
  } as const

  // Correct Brand interface that matches Payload's generated types
  interface Brand {
    name: string
    logo: string | Media | null
    url?: string | null
    id?: string | null
  }

  const BrandLogo = ({ brand, index }: { brand: Brand; index: number }) => {
    // Type guard function for Media objects
    const isMediaObject = (logo: string | Media | null): logo is Media => {
      return typeof logo === 'object' && logo !== null && 'url' in logo
    }

    // Extract URL from logo with proper type checking
    const getLogoUrl = (logo: string | Media | null): string => {
      if (typeof logo === 'string') {
        return logo
      }
      if (isMediaObject(logo)) {
        return logo.url || ''
      }
      return ''
    }

    const logoUrl = getLogoUrl(brand.logo)

    const logoContent = logoUrl ? (
      <img
        src={logoUrl}
        alt={brand.name || 'Brand logo'}
        className="h-5 md:h-[35px] w-auto object-contain transition-all duration-300"
      />
    ) : (
      <div className="h-8 md:h-10 w-24 md:w-32 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-gray-500 text-xs md:text-sm font-medium">{brand.name}</span>
      </div>
    )

    if (brand.url && brand.url.trim() !== '') {
      return (
        <a
          href={brand.url}
          target="_self"
          rel="noopener noreferrer"
          className="block transition-transform duration-300 cursor-pointer"
        >
          {logoContent}
        </a>
      )
    }

    return logoContent
  }

  // Don't render if no brands
  if (duplicatedBrands.length === 0) {
    return (
      <section className={cn('py-12 md:py-16 px-4 bg-white', className)}>
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-xs md:text-sm font-semibold text-gray-800 mb-2">
              {title}
            </h2>
            <p className="text-gray-500">No brands to display</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-12 md:py-16 px-4 bg-white overflow-hidden', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xs md:text-[20px] font-semibold text-gray-800 mb-4">
            {title}
          </h2>
        </div>

        {/* Infinite Scrolling Brands Container */}
        <div className="relative w-full">
          {/* Gradient fade masks */}
          <div className="absolute -left-1 top-0 w-16 md:w-24 h-full bg-gradient-to-r from-white via-white/30 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute -right-1 top-0 w-16 md:w-24 h-full bg-gradient-to-l from-white via-white/30 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling container */}
          <div className="flex overflow-hidden">
            <div 
              className={cn(
                'flex items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 whitespace-nowrap',
                speedClasses[safeAnimationSpeed],
                pauseOnHover && 'hover:[animation-play-state:paused]'
              )}
              style={{
                width: 'max-content',
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div 
                  key={`${brand.name}-${index}`} 
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  <BrandLogo brand={brand} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}