import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface WhyCardData {
  idx: string
  title: string
  body: string
}

export interface WhyProps {
  eyebrow?: string
  title?: string
  description?: string
  cards?: WhyCardData[]
}

const DEFAULT_CARDS: WhyCardData[] = [
  {
    idx: '01 / EXPERTISE',
    title: 'Certified Expertise & Trusted Technologies',
    body: 'Our certified engineers and vendor partnerships ensure every solution meets global standards for reliability, security and performance.',
  },
  {
    idx: '02 / COVERAGE',
    title: 'End-to-End Technology Solutions',
    body: 'From IT infrastructure and cybersecurity to AV systems and digital services — one trusted partner under one roof.',
  },
  {
    idx: '03 / SUPPORT',
    title: 'Proactive Support & Rapid Response',
    body: 'Proactive monitoring and preventive maintenance minimize downtime and keep operations running uninterrupted.',
  },
  {
    idx: '04 / SCALE',
    title: 'Scalable Solutions for Every Business',
    body: 'From growing SMBs to large enterprises, our solutions are designed to scale alongside your business.',
  },
]

export function Why({
  eyebrow = 'WHY BUSINESSES CHOOSE CODE3',
  title = 'Certified expertise. Proactive support. Solutions built to scale.',
  description = 'We combine technical expertise, proactive support, and industry-leading technologies to deliver secure, future-ready solutions across the UAE.',
  cards = DEFAULT_CARDS,
}: WhyProps) {
  return (
    <section id="why" className="bg-code3-ink py-[120px] text-white max-[760px]:py-20">
      <div className="mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-white">
            {title}
          </h2>
          {description && (
            <p className="font-inter mt-4 text-[16.5px] leading-relaxed text-code3-slate-light">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal
          delayMs={100}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/10 bg-white/10 sm:grid-cols-2"
        >
          {cards.map((c) => (
            <div key={c.idx} className="bg-code3-ink2 p-9 max-[760px]:p-7">
              <span className="font-jetmono mb-[18px] block text-[13px] text-code3-signal">
                {c.idx}
              </span>
              <h3 className="font-grotesk mb-3 text-[19px] text-white">{c.title}</h3>
              <p className="font-inter text-[14.5px] leading-relaxed text-code3-slate-light">
                {c.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
