'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/ui'

// Splits the headline so the closing word(s) can be styled as the emphasis
// phrase - e.g. "IT Solutions That Keep Your Business Moving" reads as
// "...Your Business" + accent "Moving".
function splitHeadline(text: string, accentWordCount = 1) {
  const words = text.trim().split(/\s+/)
  if (words.length <= accentWordCount) return { lead: '', accent: text }
  return {
    lead: words.slice(0, -accentWordCount).join(' '),
    accent: words.slice(-accentWordCount).join(' '),
  }
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText, media }) => {
  const { lead, accent } = splitHeadline(HeroText || '', 2)

  return (
    <section className="relative w-full overflow-hidden">
      {/* Fills exactly the viewport height remaining below the sticky header
          (100px on mobile, 116px from sm up, where the top info bar shows),
          so the next section never peeks into view until the visitor
          scrolls - regardless of how short the content itself is. */}
      <div className="relative flex min-h-[calc(100vh-100px)] w-full flex-col justify-center sm:min-h-[calc(100vh-116px)]">
        {/* The hero's actual media asset - a photo or video uploaded in the
            CMS (Media auto-detects which and renders the right tag). Solid
            fallback color underneath in case media is ever unset. */}
        <div aria-hidden className="absolute inset-0 bg-[#0c0505]">
          {media && typeof media === 'object' && (
            <Media
              resource={media}
              fill
              imgClassName="h-full w-full object-cover"
              videoClassName="absolute inset-0 h-full w-full object-cover"
              priority
            />
          )}
        </div>
        {/* Dark-to-light overlay, left to right - keeps the left-aligned text
            fully legible over any photo/video while still letting the
            image's own detail (brand signage, skyline) show through on the
            right rather than blanketing the whole frame evenly. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(10,6,6,0.94) 0%, rgba(10,6,6,0.82) 30%, rgba(10,6,6,0.45) 62%, rgba(10,6,6,0.15) 100%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,6,6,0.35) 0%, rgba(10,6,6,0) 30%, rgba(10,6,6,0.55) 100%)' }}
        />

        <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <Reveal durationMs={450}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-gentle-pulse rounded-full bg-secondary_red" />
                IT Solutions & Technology Services
              </span>
            </Reveal>

            {/* Left un-animated on purpose - the hero's largest text and
                likely LCP candidate; a fade-in would delay its final paint. */}
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-[4rem]">
              {lead && <>{lead}{' '}</>}
              <span className="text-secondary_red">{accent}</span>
            </h1>

            {subText && (
              <Reveal durationMs={450} delayMs={90}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] md:text-lg">
                  {subText}
                </p>
              </Reveal>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <Reveal durationMs={450} delayMs={180}>
                <ul className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {links.map(({ link }, i) => (
                    <li key={i} className="w-full sm:w-auto">
                      <CMSLink
                        {...link}
                        size="lg"
                        appearance={link.appearance === 'outline' ? 'outline' : 'gradientArrow'}
                        className={cn(
                          'w-full sm:w-auto',
                          link.appearance === 'outline' &&
                            'border-white/30 bg-white/5 text-white hover:border-white/50 hover:bg-white/15',
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
