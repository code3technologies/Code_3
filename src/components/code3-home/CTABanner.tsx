import React from 'react'
import { Reveal } from './Reveal'

export function CTABanner({
  title,
  buttonLabel = 'Book a Free Consultation',
  buttonHref = '#contact',
}: {
  title: string
  buttonLabel?: string
  buttonHref?: string
}) {
  return (
    <div className="relative overflow-hidden py-6 max-[760px]:py-4">
      <div className="mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal
          className="flex flex-col items-center justify-between gap-4 rounded-full bg-code3-ink px-8 py-4 sm:flex-row max-[760px]:rounded-2xl max-[760px]:px-5 max-[760px]:py-5"
        >
          <h3 className="font-grotesk text-center text-[15.5px] font-semibold text-white sm:text-left">
            {title}
          </h3>
          <a
            href={buttonHref}
            className="group inline-flex flex-none items-center gap-2 rounded-full bg-code3-amber px-5 py-2.5 text-[13.5px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            {buttonLabel}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </div>
  )
}
