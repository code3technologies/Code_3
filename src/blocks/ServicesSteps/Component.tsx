'use client'
import React from 'react'
import type { Media as MediaType, ServicesStepsBlock } from '@/payload-types'
import { Media } from '@/components/Media'

interface ServicesStepsProps {
  badge?: string
  title?: string
  subtitle?: string
  steps?: Array<{
    stepNumber?: string
    title?: string
    description?: string
    icon?: MediaType | string
    id?: string | null
  }> | null
}

const ServicesStepsComponent: React.FC<ServicesStepsProps> = ({
  badge = 'Steps',
  title = 'Simple Steps to Stress-Free IT',
  subtitle = 'We handle the technical hassles so you can focus on growing your business.',
  steps = [],
}) => {
  const stepsArray = steps || []

  return (
    <section className="py-6 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary_red border border-secondary_red text-white text-xs font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl md:max-w-[36rem] lg:max-w-[46rem] mx-auto font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h2>
          <p className="px-3 md:px-0 mx-auto text-md md:text-xl md:max-w-md lg:max-w-lg text-gray-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Desktop Layout (Hidden on mobile) */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-8 relative">
                {/* Timeline Line */}
                <div className="absolute top-3 inset-0 flex justify-center">
                    <div className="w-1 bg-[#BF2620] h-full rounded-full"></div>
                </div>

                {stepsArray.flatMap((step, index) => {
                    const isEven = index % 2 === 0
                    const stepNumber = step.stepNumber || `STEP ${String(index + 1).padStart(2, '0')}`
                    
                    const contentDiv = (
                        <div key={index} className={`col-start-${isEven ? '2' : '1'} relative`}>
                            <div className={`flex items-center ${isEven ? 'mb-4' : 'justify-end mb-4'}`}>
                                {isEven ? (
                                    <>
                                        <div className="absolute left-[-26px] z-10">
                                        <div className="w-5 h-5 border-[3px] border-[#BF2620] bg-[#961712] rounded-full"></div>
                                        </div>
                                        <span className="text-primary_red font-semibold text-3xl ml-4">
                                        {stepNumber}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-primary_red font-semibold text-3xl mr-4">
                                        {stepNumber}
                                        </span>
                                        <div className="absolute right-[-26px] z-10">
                                        <div className="w-5 h-5 border-[3px] border-[#BF2620] bg-[#961712] rounded-full"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={`bg-[#F3F3F3] border border-[#E0DDDD] max-w-[320px] xl:max-w-[360px] ${isEven ? 'ml-auto' : 'mr-auto'} rounded-[2rem] p-8`}>
                                <div className="flex flex-col justify-between h-full gap-16">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        {step.icon && (
                                            <Media
                                              resource={step.icon}
                                              imgClassName="w-[62px] h-[62px] object-contain"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    
                    const emptyDiv = (
                        <div key={`empty-${index}`} className={`col-start-${isEven ? '1' : '2'}`}></div>
                    )
                    
                    return isEven ? [emptyDiv, contentDiv] : [contentDiv, emptyDiv]
                })}
            </div>
        </div>

        {/* Mobile Layout (Visible only on mobile) */}
        <div className="md:hidden">
          <div className="relative max-w-max mx-auto">
            {/* Mobile Timeline Line */}
            <div className="absolute left-[6px] top-[8px] w-[4px] h-full bg-[#BF2620] z-0 rounded-full"></div>

            {stepsArray.map((step, index) => {
              const stepNumber = step.stepNumber || `STEP ${String(index + 1).padStart(2, '0')}`

              return (
                <div key={index} className="relative mb-12 flex items-start justify-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="z-10">
                      <div className="w-4 h-4 border-[3px] border-[#BF2620] bg-[#961712] rounded-full"></div>
                    </div>
                    <div className="text-primary_red font-semibold text-xl w-max">{stepNumber}</div>
                  </div>
                  <div className="bg-[#F3F3F3] border border-[#E0DDDD] max-w-[16rem] rounded-[1.5rem] p-4">
                    <div className="flex flex-col justify-between h-full gap-14">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        {step.icon && (
                            <Media
                              resource={step.icon}
                              imgClassName="w-[62px] h-[62px] object-contain"
                            />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-800 text-sm leading-5.5">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const ServicesStepsBlock: React.FC<ServicesStepsBlock> = (props) => {
  return <ServicesStepsComponent {...props} />
}

export { ServicesStepsBlock }
