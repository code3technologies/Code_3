'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface ProcessStepData {
  num: string
  title: string
  body: string
}

export interface ProcessProps {
  eyebrow?: string
  title?: string
  description?: string
  steps?: ProcessStepData[]
}

const DEFAULT_STEPS: ProcessStepData[] = [
  {
    num: 'STEP 01',
    title: 'Assess & Consult',
    body: 'Understanding your objectives, existing infrastructure, and technology requirements.',
  },
  {
    num: 'STEP 02',
    title: 'Design & Plan',
    body: 'Customized solutions aligned with your goals, scalability needs, and budget.',
  },
  {
    num: 'STEP 03',
    title: 'Procure & Prepare',
    body: 'Sourcing genuine hardware and licensing from trusted global manufacturers.',
  },
  {
    num: 'STEP 04',
    title: 'Implement & Deploy',
    body: 'Certified engineers deploy solutions while minimizing operational disruption.',
  },
  {
    num: 'STEP 05',
    title: 'Test & Validate',
    body: 'Rigorous testing ensures reliability, security, and performance before go-live.',
  },
  {
    num: 'STEP 06',
    title: 'Support & Optimize',
    body: 'Proactive monitoring and continuous optimization to stay future-ready.',
  },
]

function ProcessStep({
  step,
  index,
  isLast,
}: {
  step: ProcessStepData
  index: number
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setInView(true), index * 140)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={ref} className="relative flex-1 px-4 text-left max-[760px]:px-0">
      <div className="mb-[26px] flex items-center">
        <div
          className={cn(
            'relative z-[2] h-3.5 w-3.5 flex-none rounded-full border-[3px] transition-colors duration-[400ms]',
            inView ? 'border-code3-signal bg-code3-signal' : 'border-code3-ink bg-white',
          )}
        />
        {!isLast && (
          <div className="relative h-0.5 flex-1 overflow-hidden bg-code3-line-light max-[760px]:h-[34px] max-[760px]:w-0.5 max-[760px]:flex-none max-[760px]:ml-[6px]">
            <div
              className={cn(
                'absolute inset-0 origin-left bg-code3-signal transition-transform duration-[800ms]',
                inView ? 'scale-x-100' : 'scale-x-0',
              )}
            />
          </div>
        )}
      </div>
      <span className="font-jetmono mb-2 block text-xs text-code3-slate-light">{step.num}</span>
      <h3 className="font-grotesk mb-2 text-base text-code3-text">{step.title}</h3>
      <p className="font-inter text-[13px] leading-snug text-code3-slate">{step.body}</p>
    </div>
  )
}

export function Process({
  eyebrow = 'OUR DELIVERY PROCESS',
  title = 'A proven approach to delivering technology excellence',
  description = 'From initial consultation to ongoing support — every solution is strategically designed, seamlessly implemented, and continuously optimized.',
  steps = DEFAULT_STEPS,
}: ProcessProps) {
  return (
    <section id="process" className="relative overflow-hidden py-[120px] max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -right-[140px] -top-[160px] z-0 h-[480px] w-[480px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(139,15,31,0.13), transparent 68%)' }}
      />
      <div className="pointer-events-none absolute -bottom-[100px] left-[6%] z-0 h-[300px] w-[300px] rounded-full border border-code3-coral/[0.14]" />
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
        <div className="flex items-start max-[760px]:flex-col max-[760px]:gap-[34px]">
          {steps.map((step, i) => (
            <ProcessStep key={step.num} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
