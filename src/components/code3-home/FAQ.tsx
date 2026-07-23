'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface FAQItemData {
  q: string
  a: string
}

export interface FAQProps {
  eyebrow?: string
  title?: string
  description?: string
  faqs?: FAQItemData[]
}

const DEFAULT_FAQS: FAQItemData[] = [
  {
    q: 'What services does CODE3 provide?',
    a: 'CODE3 offers Managed IT Services, Cybersecurity Solutions, ICT & ELV Solutions, Audio Visual solutions, Cloud Services, and Digital Services to support business growth and operational efficiency.',
  },
  {
    q: 'Do you provide services across the UAE?',
    a: 'Yes. Our engineers and support teams operate across Dubai and the wider UAE, with on-site and remote support options.',
  },
  {
    q: 'Can your solutions be customized for our business requirements?',
    a: 'Every engagement starts with an assessment of your objectives, infrastructure, and budget so the solution is designed around your business, not a template.',
  },
  {
    q: 'Do you provide ongoing support and maintenance?',
    a: 'Yes — proactive monitoring, preventive maintenance, and rapid-response support are core to our Managed IT Services.',
  },
  {
    q: 'Which industries do you serve?',
    a: 'We work with SMBs, large enterprises, education institutions, and retail & hospitality businesses across the UAE.',
  },
  {
    q: 'How can we get started with CODE3?',
    a: 'Book a free consultation using the form below, and our team will schedule an initial assessment call within one business day.',
  },
]

export function FAQ({
  eyebrow = 'FAQS',
  title = 'Frequently asked questions',
  description = 'Find answers to common questions about our IT infrastructure, cybersecurity, AV, and digital solutions.',
  faqs = DEFAULT_FAQS,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative overflow-hidden bg-white/[0.88] py-[120px] max-[760px]:py-20">
      <div className="pointer-events-none absolute -right-[4%] -top-[120px] z-0 h-[340px] w-[340px] rounded-full border border-code3-coral/[0.14]" />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-code3-text">
            {title}
          </h2>
          {description && (
            <p className="font-inter mt-4 text-[16.5px] leading-relaxed text-code3-slate">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal className="max-w-[800px]">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q} className="border-b border-code3-line-light">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="font-grotesk flex w-full items-center justify-between py-[26px] text-left text-[17px] font-medium text-code3-text"
                >
                  {item.q}
                  <span className="relative ml-4 h-[22px] w-[22px] flex-none">
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-code3-ink" />
                    <span
                      className={cn(
                        'absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-code3-ink transition-transform duration-[350ms]',
                        open && 'scale-y-0',
                      )}
                    />
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ maxHeight: open ? '240px' : '0px' }}
                >
                  <p className="font-inter max-w-[640px] pb-[26px] text-[14.5px] leading-[1.7] text-code3-slate">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
