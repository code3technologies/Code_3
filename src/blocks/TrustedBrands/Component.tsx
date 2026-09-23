'use client'

import type { TrustedBrandsBlock as TrustedBrandsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import type { Media as MediaType, Page } from 'src/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { CtaButton } from '@/components/site/CtaButton'
import { ClearQuickEnquiry } from '@/components/site/ClearQuickEnquiry'

type Props = {
  className?: string
} & TrustedBrandsBlockProps

export const TrustedBrandsBlock: React.FC<Props> = ({
  className,
  title,
  subtitle,
  brands = [],
  displayStyle = 'scroll',
  gridColumns = '4',
  animationSpeed = 'normal',
  pauseOnHover = true,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBrands = brands || []
  const isGrid = displayStyle === 'grid'
  const isHorizontalScroll = displayStyle === 'horizontalScroll'
  const isMarquee = !isGrid && !isHorizontalScroll
  const duplicatedBrands = isMarquee && safeBrands.length > 0 ? [...safeBrands, ...safeBrands, ...safeBrands] : safeBrands
  const safeAnimationSpeed = animationSpeed || 'normal'
  const speedClasses = {
    slow: 'animate-scroll-slow',
    normal: 'animate-scroll',
    fast: 'animate-scroll-fast'
  } as const

  interface Brand {
    name: string
    logo?: string | MediaType | null
    linkType?: 'none' | 'external' | 'service' | null
    url?: string | null
    servicePage?: string | Page | null
    id?: string | null
  }

  const getBrandLink = (brand: Brand): string | null => {
    if (!brand.linkType || brand.linkType === 'none') {
      return null
    }

    if (brand.linkType === 'external' && brand.url && brand.url.trim() !== '') {
      return brand.url
    }

    if (brand.linkType === 'service' && brand.servicePage) {
      if (typeof brand.servicePage === 'string') {
        return null
      }
      
      const page = brand.servicePage
      
      if (!page.slug) {
        return null
      }
      
      return `/service/${page.slug}`
    }

    return null
  }

  const BrandLogo = ({ brand, wrap = false }: { brand: Brand; index: number; wrap?: boolean }) => {
    const [logoFailed, setLogoFailed] = useState(false)
    const hasResolvedLogo = brand.logo && typeof brand.logo === 'object'
    const logoContent = hasResolvedLogo && !logoFailed ? (
      <Media
        resource={brand.logo}
        size="180px"
        imgClassName={cn(
          'w-auto max-w-[180px] object-contain transition-all duration-300',
          wrap ? 'h-14 md:h-20' : 'h-16 md:h-24',
        )}
        onError={() => setLogoFailed(true)}
      />
    ) : (
      <div className={cn('flex items-center justify-center', wrap ? 'px-1 py-1' : 'h-8 px-2 md:h-10')}>
        <span
          className={cn(
            'font-semibold uppercase tracking-wide text-gray-500 transition-all duration-300 group-hover:text-primary_red',
            wrap
              ? 'text-center text-xs leading-snug sm:text-sm'
              : 'whitespace-nowrap text-sm group-hover:scale-110 md:text-base',
          )}
        >
          {brand.name}
        </span>
      </div>
    )

    const brandLink = getBrandLink(brand)

    if (brandLink) {
      const isExternal = brand.linkType === 'external'
      
      if (isExternal) {
        return (
          <a
            href={brandLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            {logoContent}
          </a>
        )
      }

      return (
        <Link
          href={brandLink}
          className="block transition-transform duration-300 hover:scale-110 cursor-pointer"
        >
          {logoContent}
        </Link>
      )
    }

    return <div className="opacity-90">{logoContent}</div>
  }

  if (duplicatedBrands.length === 0) {
    return (
      <section className={cn('pt-12 pb-8 md:pt-16 md:pb-10 px-4 bg-white', className)}>
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-gray-500 mb-2">{subtitle}</p>}
            <p className="text-gray-500">No brands to display</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('pt-12 pb-8 md:pt-16 md:pb-10 px-4 bg-white overflow-hidden', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-500 md:text-base">{subtitle}</p>}
        </div>

        {isGrid ? (
          <>
            <ClearQuickEnquiry />
            <div className="flex flex-wrap justify-center gap-4">
              {safeBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className={cn(
                    'group flex min-h-[5.5rem] items-center justify-center rounded-2xl border border-border/70 bg-gray-50/60 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary_red/40 hover:bg-white hover:shadow-md md:min-h-[6.5rem]',
                    'w-[calc((100%-1rem)/2)]',
                    gridColumns === '5' ? 'sm:w-[calc((100%-4rem)/5)]' : 'sm:w-[calc((100%-3rem)/4)]',
                  )}
                >
                  <BrandLogo brand={brand} index={index} wrap />
                </div>
              ))}
            </div>
          </>
        ) : isHorizontalScroll ? (
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
            {safeBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="group flex flex-none snap-start items-center justify-center rounded-2xl border border-border/70 bg-gray-50/60 px-8 py-6 h-32 min-w-[180px] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary_red/40 hover:bg-white hover:shadow-md md:h-36"
              >
                <BrandLogo brand={brand} index={index} wrap />
              </div>
            ))}
          </div>
        ) : (
          /* Infinite Scrolling Brands Container */
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
                    className="group flex-shrink-0 flex items-center justify-center"
                  >
                    <BrandLogo brand={brand} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-8 md:mt-10" />
      </div>
    </section>
  )
}
