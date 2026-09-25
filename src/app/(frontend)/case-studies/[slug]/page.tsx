import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { Page } from '@/payload-types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/site/Reveal'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getLocale } from '@/utilities/getLocale'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { CountUp } from './CountUp'

type Args = { params: Promise<{ slug: string }> }

const fetchCaseStudy = async ({ slug, locale, draft }: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
}

// Draft/preview reads fresh; published reads are cached and invalidated by
// the case_study_<slug> tag from revalidateCaseStudy.
const queryCaseStudy = (args: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  if (args.draft) return fetchCaseStudy(args)
  return unstable_cache(() => fetchCaseStudy(args), ['case-study', args.slug, args.locale], {
    tags: [`case_study_${args.slug}`],
  })()
}

const isNumeric = (value: string) => /^\d/.test(value.trim())

function Cross() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 flex-none text-primary_red" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="10" cy="10" r="9" className="opacity-25" />
      <path d="M7 7l6 6M13 7l-6 6" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-primary_red" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  )
}

export default async function CaseStudyPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
  const study = await queryCaseStudy({ slug, locale, draft })

  if (!study) notFound()

  const prefix = locale === 'ar' ? '/ar' : ''
  const client = study.clientName || study.clientDescriptor
  const services = (study.services || []).filter((s): s is Page => typeof s === 'object' && s !== null)
  const results = study.results || []
  const highlights = results.filter((r) => isNumeric(r.value)).slice(0, 4)
  const points = study.challengePoints || []
  const steps = study.solutionSteps || []
  const chips = study.transformationChips || []
  const techUsed = study.technologyUsed || []
  const groups = study.capabilities || []
  const isSequence = study.transformationStyle === 'sequence'
  const meta = [
    { label: 'Client', value: client },
    { label: 'Service', value: study.serviceLabel },
    { label: 'Technology', value: study.technology },
    { label: 'Location', value: study.location },
  ].filter((m) => m.value)

  return (
    <article className="bg-white">
      {draft && <LivePreviewListener />}
      <Breadcrumbs
        items={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: prefix || '/' },
          { name: locale === 'ar' ? 'دراسات الحالة' : 'Case Studies', href: `${prefix}/case-studies` },
          { name: study.title },
        ]}
      />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #b3121f 0%, #8b0f1f 45%, #2d0e0e 100%)' }} />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-white/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-black/30 blur-[110px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="container relative z-10 mx-auto px-4 pb-32 pt-12 sm:px-6 md:pb-40 md:pt-16">
          <div className={`grid items-center gap-10 ${study.heroImage ? 'lg:grid-cols-[1.3fr_1fr]' : ''}`}>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Case Study{study.industry ? ` · ${study.industry}` : ''}
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-white md:text-4xl lg:text-[2.75rem]">{study.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{study.summary}</p>

              {meta.length > 0 && (
                <dl className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {meta.map((m) => (
                    <div key={m.label} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{m.label}</dt>
                      <dd className="mt-1 text-sm font-medium leading-snug text-white">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {study.heroImage && typeof study.heroImage === 'object' && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                <Media resource={study.heroImage} alt={study.title} fill priority size="600px" imgClassName="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────── At-a-glance numbers, overlapping the hero ───────── */}
      {highlights.length > 0 && (
        <section className="container relative z-20 mx-auto -mt-20 px-4 sm:px-6 md:-mt-24">
          <Reveal>
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_60px_-20px_rgba(139,15,31,0.35)] lg:grid-cols-4">
              {highlights.map((r, i) => (
                <div
                  key={r.id || i}
                  className={`px-5 py-6 text-center md:py-8 ${i > 0 ? 'lg:border-l lg:border-border' : ''} ${i % 2 === 1 ? 'border-l border-border lg:border-l' : ''} ${i > 1 ? 'border-t border-border lg:border-t-0' : ''}`}
                >
                  <div className="bg-gradient-to-br from-[#b3121f] to-[#df3341] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
                    <CountUp value={r.value} />
                  </div>
                  <div className="mx-auto mt-2 max-w-[14rem] text-sm font-medium leading-snug text-gray-600">{r.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ───────── The challenge: before ───────── */}
      <section className="container mx-auto px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary_red">The challenge</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">Where things stood before CODE3</h2>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-600">{study.challenge}</p>
          </Reveal>

          {points.length > 0 && (
            <Reveal delayMs={100}>
              <div className="rounded-2xl border border-border bg-gray-50/70 p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Before</span>
                  <span className="rounded-full bg-[#FDEBEC] px-3 py-1 text-xs font-semibold text-primary_red">{points.length} pain points</span>
                </div>
                <ul className="grid gap-3.5">
                  {points.map((p, i) => (
                    <li key={p.id || i} className="flex items-start gap-3 text-[15px] leading-snug text-gray-700">
                      <Cross />
                      <span>{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────── The solution: timeline ───────── */}
      <section className="bg-gray-50/70 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary_red">Our solution</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">How we turned it around</h2>
              <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-600">{study.solution}</p>
            </Reveal>

            {steps.length > 0 && (
              <ol className="relative grid gap-5">
                <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-primary_red/50 via-primary_red/20 to-transparent" />
                {steps.map((step, i) => (
                  <li key={step.id || i}>
                    <Reveal delayMs={Math.min(i * 60, 240)} className="relative pl-14">
                      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary_red text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(201,14,29,0.6)] ring-4 ring-gray-50">
                        {i + 1}
                      </span>
                      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                        {step.description && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{step.description}</p>}
                        {step.bullets && step.bullets.length > 0 && (
                          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                            {step.bullets.map((b, j) => (
                              <li key={b.id || j} className="flex items-start gap-2 text-sm leading-snug text-gray-700">
                                <Check />
                                <span>{b.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      {/* ───────── Results ───────── */}
      {results.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-24" style={{ background: 'linear-gradient(160deg, #1a0a0a 0%, #2d0e0e 100%)' }}>
          <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-primary_red/25 blur-[120px]" />
          <div className="container relative mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-red-300">Measurable results</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-4xl">What changed once it was in place</h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r, i) => (
                <Reveal key={r.id || i} delayMs={Math.min(i * 70, 280)}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:border-white/25 hover:bg-white/10">
                    <div
                      className={`bg-gradient-to-br from-white to-red-200 bg-clip-text font-extrabold leading-none tracking-tight text-transparent ${isNumeric(r.value) ? 'text-5xl' : 'text-3xl'}`}
                    >
                      <CountUp value={r.value} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-snug text-white">{r.label}</h3>
                    {r.description && <p className="mt-2 text-sm leading-relaxed text-white/60">{r.description}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Grouped capabilities (e.g. issues commonly resolved) ───────── */}
      {groups.length > 0 && (
        <section className="container mx-auto px-4 pt-16 sm:px-6 md:pt-24">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary_red">In scope</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
              {study.capabilitiesTitle || 'What this covers'}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g, i) => (
              <Reveal key={g.id || i} delayMs={Math.min(i * 60, 240)}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground">{g.title}</h3>
                  <ul className="mt-3 grid gap-2">
                    {(g.items || []).map((item, j) => (
                      <li key={item.id || j} className="flex items-start gap-2 text-sm leading-snug text-gray-700">
                        <Check />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          {study.capabilitiesNote && (
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">{study.capabilitiesNote}</p>
          )}
        </section>
      )}

      {/* ───────── Business impact ───────── */}
      {study.businessImpact && (
        <section className="container mx-auto px-4 py-16 sm:px-6 md:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary_red">Business impact</span>
            <p className="relative mt-5 whitespace-pre-line text-lg font-medium leading-relaxed text-foreground md:text-xl md:leading-relaxed">
              {study.businessImpact}
            </p>
          </Reveal>
        </section>
      )}

      {study.testimonialQuote && (
        <section className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className="mx-auto max-w-3xl rounded-2xl border border-border bg-gray-50/70 p-7 md:p-9">
            <p className="text-lg italic leading-relaxed text-foreground">&ldquo;{study.testimonialQuote}&rdquo;</p>
            {study.testimonialAuthor && <footer className="mt-4 text-sm font-medium text-gray-500">- {study.testimonialAuthor}</footer>}
          </Reveal>
        </section>
      )}

      {/* ───────── Technology used ───────── */}
      {techUsed.length > 0 && (
        <section className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className="mx-auto max-w-4xl">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary_red">{study.technologyHeading || 'Technology used'}</span>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {techUsed.map((t, i) => (
                <div key={t.id || i} className="flex gap-4 rounded-2xl border border-border bg-gray-50/70 p-6">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary_red text-lg font-bold text-white">
                    {t.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t.name}</h3>
                    {t.description && <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ───────── Reactive -> proactive ───────── */}
      {(study.transformationTitle || chips.length > 0) && (
        <section className="border-y border-border bg-[#FDEBEC]/50 py-16 md:py-20">
          <div className="container mx-auto px-4 text-center sm:px-6">
            <Reveal>
              {study.transformationTitle && (
                <h2 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{study.transformationTitle}</h2>
              )}
              {study.transformationText && (
                <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-gray-600">{study.transformationText}</p>
              )}
            </Reveal>

            {chips.length > 0 && (
              <Reveal delayMs={120}>
                <ul className="mx-auto mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-3">
                  {chips.map((c, i) => (
                    <li key={c.id || i} className="flex items-center gap-2">
                      <span className="rounded-full border border-primary_red/25 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">{c.text}</span>
                      {i < chips.length - 1 && (
                        <span aria-hidden className="text-lg font-bold text-primary_red/60">
                          {isSequence ? '→' : '+'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ───────── Services delivered + CTA ───────── */}
      <section className="container mx-auto px-4 py-16 sm:px-6 md:py-24">
        {services.length > 0 && (
          <Reveal className="mb-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">Services behind this project</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`${prefix}/service/${service.slug}`}
                    className="inline-block rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary_red/40 hover:text-primary_red"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 text-center md:px-12 md:py-16"
            style={{ background: 'linear-gradient(135deg, #b3121f 0%, #8b0f1f 55%, #2d0e0e 100%)' }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-[90px]" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-4xl">
              {study.ctaHeading || 'Facing a similar challenge?'}
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl leading-relaxed text-white/80">
              {study.ctaText || "Tell us about your environment and we'll recommend the right approach."}
            </p>
            <Link
              href={study.ctaUrl ? study.ctaUrl : `${prefix}/contact`}
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary_red shadow-lg transition-transform duration-200 hover:scale-[1.03]"
            >
              {study.ctaLabel || 'Book a Free Consultation'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
  const study = await queryCaseStudy({ slug, locale, draft })

  if (!study) return { title: 'Case Study | CODE3' }

  const title = study.meta?.title || `${study.title} | CODE3`
  const description = study.meta?.description || study.summary
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: mergeOpenGraph({ title, description, url: `/case-studies/${study.slug}` }),
  }
}
