'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQBlockProps {
  title: string
  subtitle?: string
  badge?: string
  faqs: FAQItem[]
  id?: string
  blockName?: string
  blockType: 'faq'
}

const FaqItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: FAQItem
  isOpen: boolean
  onClick: () => void
}) => {
  return (
    <div className="border bg-[#FCFCFC] rounded-lg my-2 px-2 border-[#E0DDDD] py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left  p-2 rounded transition-colors"
      >
        <span className="text-lg font-medium text-gray-800 pr-4">{faq.question}</span>
        <span className="text-xl text-gray-500 flex-shrink-0">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 border rounded-full p-1 border-[#E0DDDD] font-semibold border-b-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 border rounded-full p-1 border-[#E0DDDD] font-semibold border-b-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2  text-gray-600 px-2">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export const FAQBlock: React.FC<FAQBlockProps> = ({
  title,
  subtitle,
  badge = 'FAQS',
  faqs = [],
}) => {
  const [openIndex, setOpenIndex] = useState(0) // First item is open by default

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index) // Allows toggling
  }

  return (
    <div className="bg-white py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 justify-start">
          {/* Left Column: Title Section */}
          <div className="text-center md:text-left max-w-sm mx-auto">
            {badge && (
              <span className="inline-block bg-primary_red border border-secondary_red text-white text-sm font-semibold px-3 py-2 rounded-full uppercase">
                {badge}
              </span>
            )}
            <h1 className="mt-4 text-3xl leading-[130%] md:text-5xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
          </div>

          {/* Right Column: Accordion Section */}
          <div className="col-span-2">
            <div className="p-4 sm:p-8 rounded-lg">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onClick={() => handleItemClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
