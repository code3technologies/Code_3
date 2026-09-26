import type { Metadata } from 'next/types'

import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { QuoteForm } from './QuoteForm.client'

export default function GetAQuotePage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50/70 to-white pb-20 pt-10 md:pt-12">
      {/* Decorative ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary_red/10 blur-3xl md:h-96 md:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 left-0 h-64 w-64 rounded-full bg-primary_red/5 blur-3xl"
      />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <Eyebrow className="justify-center">Get a Quote</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Get Your Free IT AMC Quote
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Tell us a bit about your IT environment and your business — we&apos;ll put together a tailored AMC
            quote based on exactly what you have, not a one-size-fits-all package.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {['No Commitment', 'Takes 2 Minutes', 'Tailored to Your Setup'].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-primary_red/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary_red shadow-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <QuoteForm />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Get a Free IT AMC Quote | CODE3',
    description:
      'Tell us about your IT environment and get a tailored IT AMC quote from CODE3 — proactive maintenance and support for businesses across Dubai and the UAE.',
  }
}
