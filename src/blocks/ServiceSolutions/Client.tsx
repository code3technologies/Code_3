'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

interface Service {
  title: string
  description: string
  showButton?: boolean
  buttonText?: string
  buttonLink?: string
  gridSpan?: string
  category?: 'infrastructure' | 'digital'
}

interface ServiceSolutionsBlockProps {
  blockId?: string
  badge?: string
  title?: string
  description?: string
  headerAlignment?: 'left' | 'center' | 'right'
  services?: Service[]
  serviceType?: 'infrastructure' | 'digital'
  className?: string
}

type Props = ServiceSolutionsBlockProps

const getGridSpanClass = (gridSpan: string) => {
  switch (gridSpan) {
    case '2':
      return 'lg:col-span-2'
    case '3':
      return 'lg:col-span-3'
    case '2-3':
      return 'md:col-span-2 lg:col-span-3'
    default:
      return 'lg:col-span-2'
  }
}

const getAlignmentClass = (alignment: string) => {
  switch (alignment) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right md:text-end'
    case 'left':
    default:
      return 'text-center md:text-start'
  }
}

export const ServiceSolutionsBlock: React.FC<Props> = ({
  blockId = 'service-section',
  className,
  badge,
  title,
  description,
  headerAlignment = 'left',
  services = [],
  serviceType,
}) => {
  return (
    <section id={blockId} className={cn('py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className={cn('mb-10', getAlignmentClass(headerAlignment))}>
            <div className="inline-block bg-primary_red border border-secondary_red text-white text-xs font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
              {badge}
            </div>
            <h2 className={cn('text-3xl md:text-5xl max-w-4xl font-bold text-gray-900 mb-6 leading-tight', headerAlignment === 'center' ? 'mx-auto' : headerAlignment === 'right' ? 'md:ml-auto md:mr-0' : 'mx-auto md:mx-0',)}>
              {title}
            </h2>
            <p
              className={cn(
                'px-3 md:px-0 text-md md:text-xl lg:max-w-3xl text-gray-600 leading-relaxed',
                headerAlignment === 'center'
                  ? 'mx-auto'
                  : headerAlignment === 'right'
                    ? 'md:ml-auto md:mr-0'
                    : 'mx-auto md:mx-0',
              )}
            >
              {description}
            </p>
          </div>
          
          {services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {services.map((service: Service, index: number) => (
                <Card
                  key={`${serviceType}-${index}`}
                  className={cn(
                    'border border-[#E0DDDD] bg-[#FAFAFA] rounded-3xl flex flex-col md:justify-between transition-all duration-300 p-6',
                    getGridSpanClass(service.gridSpan || '2'),
                  )}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="mb-16 lg:mb-22">
                      <span className="inline-block bg-[#F5D9D9] text-[#BE251F] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        {service.title}
                      </span>
                    </div>
                    <h3 className="text-md max-w-lg md:text-xl font-semibold text-gray-900 mb-4">
                      {service.description}
                    </h3>
                    {service.showButton && (
                      <Button
                        variant="exploreLink"
                        size="link"
                        onClick={() => {
                          if (service.buttonLink && service.buttonLink !== '#') {
                            window.open(service.buttonLink, '_self')
                          }
                        }}
                      >
                        {service.buttonText || 'Explore Service'}
                        <svg
                          width="6"
                          height="6"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.833252 9.16732L9.16659 0.833984M9.16659 0.833984H0.833252M9.16659 0.833984V9.16732"
                            stroke="url(#paint0_linear_864_7934)"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_864_7934"
                              x1="3.3963"
                              y1="11.8317"
                              x2="-1.83432"
                              y2="3.96613"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#C90E1D" />
                              <stop offset="1" stopColor="#F0B4AC" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
