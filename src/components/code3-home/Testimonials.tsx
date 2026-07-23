import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import { getGoogleReviews } from './getGoogleReviews'

export interface TestimonialQuote {
  quote: string
  name: string
  role: string
}

export interface TestimonialsProps {
  eyebrow?: string
  title?: string
  useGoogleReviews?: boolean
  fallbackQuotes?: TestimonialQuote[]
}

const FALLBACK_QUOTES: TestimonialQuote[] = [
  {
    quote:
      'CODE3 has been a reliable technology partner for our organization. Their proactive approach and rapid response significantly improved the stability of our IT environment.',
    name: 'IT Manager',
    role: 'UAE-Based Enterprise',
  },
  {
    quote:
      'The team demonstrated exceptional professionalism throughout the project. From consultation to implementation, every stage was delivered efficiently and exceeded expectations.',
    name: 'Operations Manager',
    role: 'Retail Sector',
  },
  {
    quote:
      "CODE3's expertise in IT infrastructure and cybersecurity has strengthened our technology environment while ensuring uninterrupted business operations.",
    name: 'Director',
    role: 'Healthcare Organization',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export async function Testimonials({
  eyebrow = 'CLIENT VOICES',
  title = 'Trusted by IT managers, directors, and operations leaders',
  useGoogleReviews = true,
  fallbackQuotes = FALLBACK_QUOTES,
}: TestimonialsProps = {}) {
  const googleReviews = useGoogleReviews ? await getGoogleReviews() : null

  const cards: { quote: string; name: string; role: string; rating?: number }[] = googleReviews
    ? googleReviews.map((r) => ({
        quote: r.text,
        name: r.author_name,
        role: r.relative_time_description ? `${r.relative_time_description} · Google Review` : 'Google Review',
        rating: r.rating,
      }))
    : fallbackQuotes

  return (
    <section className="relative overflow-hidden py-[120px] max-[760px]:py-20">
      <div className="pointer-events-none absolute -right-[100px] -top-[140px] z-0 h-[420px] w-[420px] rounded-full border border-code3-coral/[0.14]" />
      <div
        className="pointer-events-none absolute -bottom-[140px] -left-[100px] z-0 h-[380px] w-[380px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(201,14,29,0.12), transparent 68%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-code3-text">
            {title}
          </h2>
        </Reveal>
        <Reveal className="grid grid-cols-1 items-start gap-[22px] md:grid-cols-3">
          {cards.map((t) => (
            <div
              key={t.name + t.role}
              className="h-full rounded-[20px] border border-code3-line-light bg-white p-9 transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(10,15,30,0.18)]"
            >
              {typeof t.rating === 'number' ? (
                <div className="mb-[18px] flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(t.rating as number)} />
                  ))}
                </div>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="mb-[18px] h-[30px] w-[30px] text-code3-amber">
                  <path d="M7 8c-2.5 0-4.5 2-4.5 4.5S4.5 17 7 17c.4 0 .8-.1 1.1-.2C7.4 19 5.6 20.5 3 21l.6 1.8C8 21.8 11 18.4 11 13.5 11 10.5 9.5 8 7 8zm10 0c-2.5 0-4.5 2-4.5 4.5S14.5 17 17 17c.4 0 .8-.1 1.1-.2-.7 2.2-2.5 3.7-5.1 4.2l.6 1.8c4.4-1 7.4-4.4 7.4-9.3 0-3-1.5-5.5-4-5.5z" />
                </svg>
              )}
              <p className="font-grotesk mb-[26px] line-clamp-6 text-lg leading-snug text-code3-text">
                {t.quote}
              </p>
              <div className="flex items-center gap-3.5">
                <div className="font-jetmono flex h-11 w-11 flex-none items-center justify-center rounded-full bg-code3-ink text-sm font-semibold text-code3-signal">
                  {initials(t.name)}
                </div>
                <div>
                  <div className="font-inter text-[14.5px] font-bold text-code3-text">{t.name}</div>
                  <div className="font-inter text-[13px] text-code3-slate">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? '#DF3341' : 'none'}
      stroke={filled ? '#DF3341' : '#D4D4D8'}
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}
