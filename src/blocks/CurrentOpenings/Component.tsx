
import type { CurrentOpeningsBlock as CurrentOpeningsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'

type Props = {
  className?: string
} & CurrentOpeningsBlockProps

interface Department {
  id?: string | null | undefined
  value: string
  label: string
}

interface JobListing {
  id?: string | null | undefined
  department: string
  title: string
  category: string
  categoryColor: 'blue' | 'pink' | 'green' | 'orange'
  description: string
  location: string
  type: string
  viewJobText?: string
  viewJobLink?: string | null | undefined
}

const getCategoryColorClasses = (color: string) => {
  const colorMap = {
    blue: 'text-blue-700 border-blue-400 bg-blue-100',
    pink: 'text-pink-700 border-pink-400 bg-pink-100',
    green: 'text-green-700 border-green-400 bg-green-100',
    orange: 'text-orange-700 border-orange-400 bg-orange-100',
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

const getCategoryDotColor = (color: string) => {
  const colorMap = {
    blue: 'bg-blue-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

export const CurrentOpeningsBlock: React.FC<Props> = ({
  className,
  badge = 'JOIN US',
  title = 'Current Openings',
  subtitle = "At CODE3, you'll innovate, grow, and make an impact—shaping the future of technology through IT, AV, and security solutions.",
  showFilter = true,
  departments = [],
  jobListings = [],
}) => {
  return (
    <div className={cn('max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8', className)}>
      {/* Header Section */}
      <div className="text-center mb-8">
        {/* CODE3 Badge */}
        <div className="inline-block bg-[#C90E1D] border border-[#FF3B4B] text-white text-xs font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
          {badge}
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-5">
          {subtitle}
        </p>
      </div>

      {/* Filter Section */}
      {showFilter && departments && departments.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="block text-md font-medium text-gray-700 mb-2 sm:mb-0">
              Department:
            </label>

            <select className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 w-full sm:w-48">
              {departments.map((dept: Department, index: number) => (
                <option key={dept.id || index} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="space-y-6">
        {jobListings?.map((job: JobListing, index: number) => (
          <div
            key={job.id || index}
            className="bg-[#FAFAFA] border border-[#E0DDDD] rounded-xl p-6 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-xs text-purple-700 font-medium mr-2">{job.department}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div
                    className={`flex items-center gap-1 px-2 border py-[1px] rounded-full text-xs ${getCategoryColorClasses(job.categoryColor)}`}
                  >
                    <span
                      className={`w-[5px] h-[5px] rounded-full ${getCategoryDotColor(job.categoryColor)}`}
                    ></span>
                    <span>{job.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.description}</p>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 10.416C11.3807 10.416 12.5 9.29673 12.5 7.91602C12.5 6.5353 11.3807 5.41602 10 5.41602C8.6193 5.41602 7.50001 6.5353 7.50001 7.91602C7.50001 9.29673 8.6193 10.416 10 10.416Z"
                        stroke="#A4A7AE"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 18.3327C11.6667 14.9993 16.6667 12.8479 16.6667 8.33268C16.6667 4.65078 13.6819 1.66602 10 1.66602C6.31811 1.66602 3.33334 4.65078 3.33334 8.33268C3.33334 12.8479 8.33334 14.9993 10 18.3327Z"
                        stroke="#A4A7AE"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_205_1851)">
                        <path
                          d="M9.99999 4.99935V9.99935L13.3333 11.666M18.3333 9.99935C18.3333 14.6017 14.6024 18.3327 9.99999 18.3327C5.39762 18.3327 1.66666 14.6017 1.66666 9.99935C1.66666 5.39698 5.39762 1.66602 9.99999 1.66602C14.6024 1.66602 18.3333 5.39698 18.3333 9.99935Z"
                          stroke="#A4A7AE"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_205_1851">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <button className="text-[#C90E1D]/70 gap-2 text-sm font-medium hover:text-red-600 flex items-center">
                  {job.viewJobText || 'View Job'}
                  <svg
                    width="10"
                    height="10"
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
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
