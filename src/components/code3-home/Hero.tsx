'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

export interface HeroSlideData {
  image: string
  eyebrow: string
  headlineText: string
  headlineHighlight: string
  sub: string
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    image:
      'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&w=1800&q=70',
    eyebrow: 'IT INFRASTRUCTURE · CYBERSECURITY · DIGITAL GROWTH',
    headlineText: "Technology infrastructure that keeps the UAE's businesses",
    headlineHighlight: 'running, secure, and growing.',
    sub: 'CODE3 delivers end-to-end IT infrastructure, cybersecurity, cloud and digital solutions — engineered by certified specialists, backed by 50+ global technology partners.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=70',
    eyebrow: 'NETWORK & CONNECTIVITY',
    headlineText: 'Reliable networks built to',
    headlineHighlight: 'carry your business forward.',
    sub: 'From structured cabling to enterprise Wi-Fi, we design and manage networks that keep every office connected and every system online.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=1800&q=70',
    eyebrow: 'CYBERSECURITY',
    headlineText: 'Defend what matters with security',
    headlineHighlight: 'built for the way you work.',
    sub: '24/7 monitoring, threat detection and response from certified security specialists — protecting your business around the clock.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1800&q=70',
    eyebrow: 'DIGITAL GROWTH',
    headlineText: 'Technology partnerships that help your business',
    headlineHighlight: 'grow with confidence.',
    sub: 'From consultation to ongoing support, our team becomes an extension of yours — focused on outcomes, not just uptime.',
  },
]

const AUTOPLAY_MS = 7000

export function Hero({ slides = DEFAULT_SLIDES }: { slides?: HeroSlideData[] }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
  }, [slides.length])

  useEffect(() => {
    restartAutoplay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [restartAutoplay])

  const goTo = (i: number) => {
    setIndex((i + slides.length) % slides.length)
    restartAutoplay()
  }

  const slide = slides[index]!

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#0A0605] py-20 max-[760px]:py-14">
      {/* Slides */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div
            key={s.image + i}
            className={cn(
              'c3-hero-slide absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-[1200ms]',
              i === index && 'c3-active opacity-100',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt=""
              referrerPolicy="no-referrer"
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(100deg, rgba(10,6,5,.96) 0%, rgba(20,9,9,.9) 32%, rgba(30,12,10,.55) 55%, rgba(10,6,5,.35) 100%), linear-gradient(180deg, rgba(10,6,5,.15) 0%, transparent 35%, rgba(10,6,5,.9) 100%)',
        }}
      />

      {/* Streaks */}
      <div
        className="pointer-events-none absolute -inset-x-[10%] -inset-y-[10%] z-[1] overflow-hidden opacity-65 mix-blend-screen"
        aria-hidden="true"
      >
        <span
          className="c3-streak absolute -top-[30%] left-[8%] h-[170%] w-[3px] animate-[c3StreakDrift_22s_linear_infinite]"
          style={{
            background: 'linear-gradient(180deg, transparent, #DF3341 40%, #DF3341 60%, transparent)',
          }}
        />
        <span
          className="c3-streak absolute -top-[30%] left-[28%] h-[170%] w-[5px] animate-[c3StreakDrift_26s_linear_infinite]"
          style={{
            animationDelay: '-6s',
            background: 'linear-gradient(180deg, transparent, #8B0F1F 40%, #8B0F1F 60%, transparent)',
          }}
        />
        <span
          className="c3-streak absolute -top-[30%] left-[55%] h-[170%] w-[2px] animate-[c3StreakDrift_19s_linear_infinite]"
          style={{
            animationDelay: '-11s',
            background: 'linear-gradient(180deg, transparent, #FF3B4B 40%, #FF3B4B 60%, transparent)',
          }}
        />
        <span
          className="c3-streak absolute -top-[30%] left-[78%] h-[170%] w-[4px] animate-[c3StreakDrift_30s_linear_infinite]"
          style={{
            animationDelay: '-4s',
            background: 'linear-gradient(180deg, transparent, #DF3341 40%, #DF3341 60%, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[2] mx-auto w-full max-w-[1240px] px-8 max-[760px]:px-5">
        <div className="max-w-[760px]">
          <div className="font-jetmono mb-4 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] text-code3-coral">
            <span className="inline-flex gap-1">
              <span className="h-[5px] w-[5px] rounded-full bg-code3-coral" />
              <span className="h-[5px] w-[5px] rounded-full bg-code3-coral" />
              <span className="h-[5px] w-[5px] rounded-full bg-code3-coral" />
            </span>
            {slide.eyebrow}
          </div>
          <h1 className="font-grotesk mb-6 text-[clamp(38px,5.4vw,68px)] font-semibold leading-[1.04] text-white transition-opacity duration-300">
            {slide.headlineText}{' '}
            <span className="bg-gradient-to-r from-code3-coral to-code3-coral-light bg-clip-text text-transparent">
              {slide.headlineHighlight}
            </span>
          </h1>
          <p className="font-inter mb-10 max-w-[560px] text-lg leading-relaxed text-code3-slate-light transition-opacity duration-300">
            {slide.sub}
          </p>
          <div className="mb-14 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-code3-amber px-[26px] py-3.5 text-[15px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(201,14,29,0.55)]"
            >
              Book a Free Consultation
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 px-[26px] py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-code3-coral hover:text-code3-coral"
            >
              Explore Services
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-9 right-8 z-[3] flex items-center gap-5 max-[760px]:right-5">
        <div className="flex gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.image + i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full bg-white/30 transition-all duration-300',
                i === index ? 'w-[22px] bg-code3-coral' : 'w-2',
              )}
            />
          ))}
        </div>
        <div className="flex gap-2.5">
          <button
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 hover:border-code3-coral hover:bg-code3-coral"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 hover:border-code3-coral hover:bg-code3-coral"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="font-jetmono absolute bottom-9 left-[110px] z-[2] hidden flex-col items-center gap-2 text-[11px] tracking-[0.12em] text-code3-slate-light sm:flex max-[760px]:hidden">
        <span>SCROLL</span>
        <span
          className="c3-scroll-cue-line h-[34px] w-px"
          style={{ background: 'linear-gradient(#DF3341, transparent)' }}
        />
      </div>
    </section>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn('h-4 w-4', className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-[15px] w-[15px]"
    >
      <path d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}
