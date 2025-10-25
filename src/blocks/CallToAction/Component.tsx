// import React from 'react'

// import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

// import RichText from '@/components/RichText'
// import { CMSLink } from '@/components/Link'

// export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
//   return (
//     <div className="container">
//       <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
//         <div className="max-w-[48rem] flex items-center">
//           {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
//         </div>
//         <div className="flex flex-col gap-8">
//           {(links || []).map(({ link }, i) => {
//             return <CMSLink key={i} size="lg" {...link} />
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }











'use client'
import React from 'react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & CTABlockProps

export const CallToActionBlock: React.FC<Props> = ({
  className,
  links,
  title,
  description,
  backgroundImage,
  showLogo = false,
}) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12', className)}>
      <div className="relative mx-auto min-w-full max-w-6xl rounded-[32px] text-center overflow-hidden">
        {backgroundImage && (
          <div className="absolute inset-0 z-[-1] rounded-[32px] overflow-hidden">
            <img
              src={
                typeof backgroundImage === 'string' ? backgroundImage : backgroundImage.url || ''
              }
              alt="Background"
              className="h-full w-full rounded-[32px] object-cover"
            />
          </div>
        )}

        <div className="flex flex-col justify-center gap-5 px-6 py-12 md:py-16 relative z-10">
          {showLogo && (
            <div className="mx-auto mb-3 flex items-center gap-2 rounded-full bg-white p-1 pr-4">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.8" y="0.3" width="23.4" height="23.4" rx="11.7" fill="#181A1A" />
                <rect
                  x="0.8"
                  y="0.3"
                  width="23.4"
                  height="23.4"
                  rx="11.7"
                  stroke="url(#paint0_linear_158_28312)"
                  strokeWidth="0.6"
                />
                <path
                  d="M8.21394 15.8048L15.8744 9.37696M15.8744 9.37696L8.83022 8.76067M15.8744 9.37696L15.2581 16.4211"
                  stroke="#F8FAFC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_158_28312"
                    x1="7"
                    y1="2.04688"
                    x2="19.5"
                    y2="22.5469"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.409189" stopColor="#505050" />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              CODE3
            </div>
          )}

          {/* Title/RichText Section */}
          {title && (
            <h1 className="mx-auto max-w-xl text-3xl font-bold lg:leading-snug text-gray-900 md:text-4xl lg:max-w-3xl lg:text-5xl">
              {title}
            </h1>
          )}

          {/* description Section */}
          {description && (
            <p className="mx-auto max-w-lg px-4 text-base leading-relaxed text-gray-800 sm:text-lg md:text-xl">
              {description}
            </p>
          )}

          {/* Links Section - Multiple CMSLinks (fallback) */}
          {links && links.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              {links.map(({ link }, i) => {
                return <CMSLink key={i} size="alignCenter" {...link} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
