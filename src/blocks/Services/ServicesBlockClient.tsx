'use client'

import type { 
  ServicesBlock as ServicesBlockProps, 
  Page, 
  ServiceOverviewBlock,
  ServiceDetailBannerBlock 
} from 'src/payload-types'
import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'

type ServiceCategoryKey = 'infrastructure' | 'digital'
type ScrollDirection = 'up' | 'down'

const WandIcon: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ServicesBlockClient: React.FC<
  ServicesBlockProps & { servicePages?: Page[]; className?: string; maxServices?: number }
> = ({
  className,
  badge,
  title,
  subtitle,
  maxServices = 6,
  servicePages = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryKey>('infrastructure')
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('down')
  const [mounted, setMounted] = useState(false)
  const [showAllServices, setShowAllServices] = useState(false)
  const [sectionHeight, setSectionHeight] = useState('auto')
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)

  const categories: { key: ServiceCategoryKey; label: string }[] = [
    { key: 'infrastructure', label: 'Infra Services' },
    { key: 'digital', label: 'Digital Services' },
  ]

  const getServiceOverviewData = (page: Page): ServiceOverviewBlock | undefined => {
    if (!page.layout) return undefined
    
    return page.layout.find(
      (block): block is ServiceOverviewBlock => 
        block.blockType === 'serviceOverview'
    )
  }

  const getServiceBannerData = (page: Page): ServiceDetailBannerBlock | undefined => {
    if (!page.layout) return undefined
    
    return page.layout.find(
      (block): block is ServiceDetailBannerBlock => 
        block.blockType === 'serviceDetailBanner'
    )
  }

  const filteredServices = servicePages
    .filter((page) => page.serviceCategory === activeCategory)
    .slice(0, maxServices)

  const totalServices = filteredServices.length
  const mobileServicesCount = 4
  const displayedMobileServices = showAllServices 
    ? filteredServices 
    : filteredServices.slice(0, mobileServicesCount)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !contentRef.current || window.innerWidth < 640) {
      setSectionHeight('auto')
      return
    }

    const calculateHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.offsetHeight
        const extraScrollHeight = window.innerHeight * 0.8
        const totalHeight = contentHeight + ((totalServices - 1) * extraScrollHeight)
        setSectionHeight(`${totalHeight}px`)
      }
    }

    calculateHeight()

    const handleResize = () => {
      setTimeout(calculateHeight, 100)
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted, totalServices, activeCategory])

  useEffect(() => {
    setActiveIndex(0)
    setScrollDirection('down')
    setShowAllServices(false)
    setScrollProgress(0)

    if (contentRef.current && window.innerWidth >= 640) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.offsetHeight
          const extraScrollHeight = window.innerHeight * 0.8
          const totalServices = servicePages
            .filter((page) => page.serviceCategory === activeCategory)
            .slice(0, maxServices).length
          
          const totalHeight = contentHeight + ((totalServices - 1) * extraScrollHeight)
          setSectionHeight(`${totalHeight}px`)
        }
      }, 0)
    }
  }, [activeCategory, servicePages, maxServices])

  useEffect(() => {
    if (!mounted || !sectionRef.current) return

    const handleScroll = () => {
      if (!sectionRef.current || window.innerWidth < 640) return

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const sectionRect = sectionRef.current.getBoundingClientRect()
      const sectionTop = scrollY + sectionRect.top
      const sectionHeight = sectionRect.height
      
      const scrolledPastSection = scrollY - sectionTop
      
      if (scrolledPastSection >= 0 && scrolledPastSection <= sectionHeight) {
        const scrollProgressValue = Math.min(scrolledPastSection / (sectionHeight - viewportHeight), 1)
        
        // NEW: Update smooth progress state
        setScrollProgress(scrollProgressValue * 100)
        
        const serviceThresholds = []
        for (let i = 0; i < totalServices; i++) {
          serviceThresholds.push(i / (totalServices - 1))
        }
        
        let newIndex = 0
        for (let i = serviceThresholds.length - 1; i >= 0; i--) {
          if (scrollProgressValue >= serviceThresholds[i]) {
            newIndex = i
            break
          }
        }
        
        const direction: ScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up'
        
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex)
          setScrollDirection(direction)
        }
      } else if (scrolledPastSection < 0) {
        setScrollProgress(0)
      } else {
        setScrollProgress(100)
      }
      
      lastScrollY.current = scrollY
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [mounted, activeIndex, totalServices])

  const renderServiceCard = (page: Page, index: number, isMobile: boolean = false) => {
    const detailHref = page.slug ? `/${page.slug}` : undefined
    const overviewData = getServiceOverviewData(page)
    const bannerData = getServiceBannerData(page)

    const serviceDescription =
      overviewData?.description ||
      page.meta?.description ||
      'Professional service tailored to your business needs.'
    const serviceImage = overviewData?.image

    const serviceLabel =
      bannerData?.serviceName ||
      (page.serviceCategory === 'infrastructure'
        ? 'Infrastructure'
        : page.serviceCategory === 'digital'
          ? 'Digital Services'
          : 'Service')

    const isActive = !isMobile && index === activeIndex
    const slideAnimationClass = !isMobile && isActive
      ? scrollDirection === 'down' 
        ? 'animate-slide-in-from-bottom opacity-100' 
        : 'animate-slide-in-from-top opacity-100'
      : !isMobile ? 'opacity-0' : 'opacity-100'

    // CHANGED: Use real-time scroll progress instead of card index
    const progressPercentage = !isMobile ? scrollProgress : 100

    return (
      <div 
        className={cn(
          'flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8',
          isMobile && 'mb-12 sm:mb-16 last:mb-8 pb-6 sm:pb-8 border-b border-gray-100 last:border-b-0 last:pb-0',
          !isMobile && 'h-full transition-all duration-1000 ease-in-out transform',
          !isMobile && slideAnimationClass,
          !isMobile && (isActive ? 'translate-y-0' : 'translate-y-4')
        )}
      >
        <div className="relative flex flex-col justify-between w-full sm:w-1/2">
          {/* CHANGED: Smooth real-time progress bar */}
          <div className="absolute sm:block hidden left-0 top-0 bottom-0 w-1 rounded-full bg-gray-200 overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-[#BE251F] via-[#FF1800] to-[#FF3B4B]"
              style={{ 
                height: `${progressPercentage}%`,
                willChange: 'height'
              }}
            />
            
            {/* Optional: Glowing dot that follows scroll */}
            {!isMobile && progressPercentage > 0 && progressPercentage < 100 && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FF1800] rounded-full"
                style={{ 
                  top: `calc(${progressPercentage}% - 6px)`,
                  boxShadow: '0 0 8px #FF1800, 0 0 12px #FF1800',
                  willChange: 'top'
                }}
              />
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full sm:ml-6">
            <div className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 bg-[#FF1800] border border-[#FF919A] rounded-full flex items-center justify-center',
              !isMobile && 'transition-all duration-1000',
              !isMobile && (isActive ? 'scale-100 opacity-100' : 'scale-100 opacity-100')
            )}>
              <WandIcon />
            </div>

            <div className={cn(
              !isMobile && 'transition-all duration-1000 ease-in-out',
              !isMobile && (isActive ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0')
            )}>
              <span className={cn(
                'inline-block bg-[#F5D9D9] text-red-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4',
                !isMobile && 'transition-all duration-1000',
                !isMobile && (isActive ? 'opacity-100 scale-100' : 'opacity-100 scale-95')
              )}>
                {serviceLabel}
              </span>

              {detailHref ? (
                <Link
                  href={detailHref}
                  className={cn(
                    'text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#0D121C] mb-3 sm:mb-4 hover:text-red-600 block',
                    !isMobile && 'transition-all duration-1000',
                    !isMobile && (isActive ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-2')
                  )}
                >
                  {page.title}
                </Link>
              ) : (
                <h2 className={cn(
                  'text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#0D121C] mb-3 sm:mb-4',
                  !isMobile && 'transition-all duration-1000',
                  !isMobile && (isActive ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-2')
                )}>
                  {page.title}
                </h2>
              )}

              <p className={cn(
                'text-gray-600 text-sm sm:text-base leading-relaxed',
                !isMobile && 'transition-all duration-1000 delay-100',
                !isMobile && (isActive ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-3')
              )}>
                {serviceDescription}
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          'relative w-full sm:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/2]',
          !isMobile && 'transition-all duration-1000 ease-in-out',
          !isMobile && (isActive ? 'opacity-100 scale-100 translate-x-0' : 'opacity-100 scale-95 translate-x-4')
        )}>
          {serviceImage ? (
            <Media
              resource={serviceImage}
              fill
              imgClassName={cn(
                'object-cover w-full h-full',
                !isMobile && 'transition-all duration-1000 ease-in-out',
                !isMobile && (isActive ? 'scale-100 opacity-100' : 'scale-80 opacity-100')
              )}
              priority={index === 0}
            />
          ) : (
            <div className={cn(
              'w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center',
              !isMobile && 'transition-all duration-1000',
              !isMobile && (isActive ? 'opacity-100' : 'opacity-100')
            )}>
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (totalServices === 0) {
    return (
      <section className={cn('bg-white py-12 sm:py-16 md:py-20 px-4 relative', className)}>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No {activeCategory} services found.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={cn('bg-white relative', className)}
      style={{ height: sectionHeight }}
    >
      {/* Desktop Version */}
      <div className="hidden sm:block sticky top-[-13.5rem] bg-white z-10">
        <div 
          ref={contentRef}
          className="flex flex-col justify-center h-auto max-h-[1200px] py-12 sm:py-16 md:py-20"
        >
          <div className="text-center mb-8 sm:mb-12 px-4">
            <button className="bg-primary_red text-white px-3 border border-secondary_red py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              {badge}
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[130%] mb-3 sm:mb-4">{title}</h1>
            <p className="text-[#535862] text-sm sm:text-base max-w-2xl mx-auto">{subtitle}</p>
          </div>

          <div ref={containerRef} className="flex justify-center mb-12 sm:mb-16 px-4">
            <div className="flex bg-[#FAF8F8] rounded-full border border-[#D7D4D4] p-1 shadow-sm">
              {categories.map(({ key, label }) => {
                const isActive = key === activeCategory
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={cn(
                      'px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300',
                      isActive
                        ? 'bg-white text-black shadow-sm'
                        : 'text-[#717680]',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full px-4">
            <div className="relative w-full min-h-[350px] sm:min-h-[450px] flex items-center justify-center">
              {filteredServices.map((page, index) => (
                <div
                  key={page.id}
                  className={cn(
                    'absolute w-full h-full',
                    index === activeIndex ? 'z-10' : 'z-0'
                  )}
                >
                  {renderServiceCard(page, index, false)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="block sm:hidden bg-white">
        <div className="py-8 sm:py-12 px-4">
          <div className="text-center mb-6 sm:mb-8">
            <button className="bg-primary_red text-white px-3 border border-secondary_red py-2 rounded-full text-xs font-medium mb-3 sm:mb-4">
              {badge}
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-[130%] mb-2 sm:mb-3">{title}</h1>
            <p className="text-[#535862] text-xs sm:text-sm leading-relaxed">{subtitle}</p>
          </div>

          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex bg-[#FAF8F8] rounded-full border border-[#D7D4D4] p-1 shadow-sm">
              {categories.map(({ key, label }) => {
                const isActive = key === activeCategory
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={cn(
                      'px-5 py-2 rounded-full text-xs font-medium transition-colors duration-300',
                      isActive
                        ? 'bg-white text-black shadow-sm'
                        : 'text-[#717680]',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-8">
            {displayedMobileServices.map((page, index) => (
              <div key={page.id}>
                {renderServiceCard(page, index, true)}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="default"
              size="alignCenter"
              onClick={() => window.open('/services', '_self')}
            >
              {`Explore Our Services`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
