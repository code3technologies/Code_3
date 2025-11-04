import React from 'react'
import type { Media as MediaType, ServiceOverviewBlock } from '@/payload-types'
import { Media } from '@/components/Media'

interface ServiceOverviewProps {
  badge?: string
  title?: string
  description?: string
  image?: string | MediaType
}

const ServiceOverviewComponent: React.FC<ServiceOverviewProps> = ({
  badge,
  title,
  description,
  image,
}) => {
  return (
    <div className="pt-10 pb-6 md:py-16 w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row rounded-2xl py-12 overflow-hidden max-w-7xl mx-auto gap-8">
        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start justify-center gap-6">
          <div className="inline-block w-max bg-primary_red border border-secondary_red text-white text-xs font-semibold px-5 py-2 rounded-full uppercase tracking-wider lg:mb-8 xl:mb-12">
            {badge}
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{title}</h2>

          {/* Description */}
          <p className="max-w-lg text-md lg:text-xl lg:max-w-3xl text-gray-600">{description}</p>
        </div>

        {/* Image Section */}
        <div className="flex-1 rounded-[2rem]">
            {image && (
              <Media
                resource={image}
                imgClassName="w-full h-full rounded-[2rem] object-cover"
              />
            )}
        </div>
      </div>
    </div>
  )
}

const ServiceOverviewBlock: React.FC<ServiceOverviewBlock> = (props) => {
  return <ServiceOverviewComponent {...props} />
}

export { ServiceOverviewBlock }
