import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface AboutTeaserProps {
  eyebrow?: string
  heading?: string
  body?: string
  linkHref?: string
  linkLabel?: string
}

export function AboutTeaser({
  eyebrow = 'ABOUT CODE3',
  heading = 'Built by engineers who believe infrastructure should be invisible — until you need it.',
  body = "CODE3 Technologies was founded to give UAE businesses a single, trusted partner for everything technology touches — from the network in the wall to the cloud that runs on it. Today our certified team supports hundreds of organizations across Dubai and the wider UAE.",
  linkHref = '#contact',
  linkLabel = 'Read our full story',
}: AboutTeaserProps) {
  return (
    <section id="about" className="relative overflow-hidden bg-white/[0.88] py-[120px] max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -right-[110px] -bottom-[150px] z-0 h-[420px] w-[420px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(201,14,29,0.12), transparent 68%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[760px] px-8 max-[760px]:px-5">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk mb-[18px] text-[clamp(26px,3vw,36px)] font-semibold text-code3-text">
            {heading}
          </h2>
          <p className="font-inter mb-7 text-base leading-[1.7] text-code3-slate">{body}</p>
          <a
            href={linkHref}
            className="font-inter group inline-flex items-center gap-2.5 rounded-full border border-code3-line-light px-[26px] py-3.5 text-[15px] font-semibold text-code3-text transition-transform duration-300 hover:-translate-y-0.5 hover:border-code3-ink"
          >
            {linkLabel}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
