'use client'

import { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'

interface FAQItem {
  question: string
  answer: string
}

interface FAQBlockProps {
  title: string
  subtitle?: string
  badge?: string
  faqs: FAQItem[]
  ctaText?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
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
    <div className="border-b border-border">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center gap-4 text-left py-5"
      >
        <span className="font-medium text-foreground">{faq.question}</span>
        <span className="relative h-4 w-4 flex-none text-gray-400">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300"
            style={{ transform: isOpen ? 'scaleY(0)' : 'scaleY(1)' }}
          />
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 pr-8 text-sm text-gray-600 leading-relaxed">
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
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const [openIndex, setOpenIndex] = useState(0)

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="bg-white py-8 md:py-10">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <Reveal className="md:col-span-1">
            {badge && <Eyebrow>{badge}</Eyebrow>}
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            {subtitle && <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>}
            <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-6 !flex-col !items-start" />
          </Reveal>

          <Reveal delayMs={100} className="md:col-span-2">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  )
}
