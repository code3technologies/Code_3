'use client'

import type { Media, ServicesBlock as ServicesBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Image from 'next/image'
import React from 'react'

type Props = {
  className?: string
} & ServicesBlockProps

export const ServicesBlock: React.FC<Props> = ({
  className,
  badge = 'OUR SERVICES',
  title = 'Your Technology Partner in Every Step',
  subtitle = 'Whether you need a secure IT backbone or a strong digital presence, we provide tailored solutions under one roof.',
  infraService,
  digitalService,
}) => {
  // Always show infrastructure service for now
  const currentService = infraService

  // Debug: Log current service data
  React.useEffect(() => {
    if (currentService) {
      if (currentService.image) {
        const imageUrl =
          typeof currentService.image === 'string'
            ? currentService.image
            : currentService.image.url || ''
      }
    }
  }, [currentService])

  const getImageUrl = (image: string | { url?: string; filename?: string } | Media) => {
    if (typeof image === 'string') {      
      return image.startsWith('http') ? image : `/images/${image}` // adjust relative path if needed
    }
    
    return image?.url || image?.filename || ''
  }

  return (
    <section className={cn('bg-white py-16 lg:py-20 px-4 relative', className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <button className="bg-[#C90E1D] text-white px-3 border border-[#FF3B4B] py-2 rounded-full text-sm font-medium mb-6">
          {badge}
        </button>
        <h1 className="text-3xl md:text-5xl font-semibold leading-[130%] mb-4">{title}</h1>
        <p className="text-[#535862] max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Left Side - Text Content */}
          <div className="relative flex flex-col justify-between">
            {/* Decorative Line */}
            <div className="absolute md:block hidden left-0 top-0 bottom-0 w-2 rounded-full bg-gradient-to-b from-[#BE251F] to-transparent"></div>

            {/* Inner Content */}
            <div className="flex flex-col justify-between gap-5 h-full md:ml-12">
              {/* Icon */}
              <div className="w-16 h-16 bg-[#FF1800] border border-[#FF919A] rounded-full flex items-center justify-center mb-8">
                <svg
                  width="32"
                  height="32"
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
              </div>

              {/* Content */}
              <div className="transition-all duration-500 ease-in-out">
                <span className="inline-block bg-[#F5D9D9] text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  {currentService?.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#0D121C] mb-6 transition-opacity duration-500">
                  {currentService?.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed transition-opacity duration-500">
                  {currentService?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full rounded-3xl overflow-hidden transition-all duration-500">
            {currentService?.image ? (
              <Image
                src={getImageUrl(currentService?.image)}
                alt={currentService?.label || 'Service image'}
                width={800}
                height={500}
                className="aspect-3/2 h-full w-full object-cover transition-all duration-700 ease-in-out"
                onError={(e) => {
                  console.error('Image failed to load:', e.currentTarget.src)
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div
                className="absolute w-0 h-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transform: 'scale(1)',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
