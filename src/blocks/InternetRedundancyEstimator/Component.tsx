'use client'

import type { InternetRedundancyEstimatorBlock as InternetRedundancyEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Check, Globe, ListChecks, MapPin, Router, Users } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import {
  EstimatorCard,
  EstimatorFooter,
  StartOverButton,
  estimatorBodyClassName,
} from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink, WizardNav } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'

const has = (arr: string[], kw: string) => arr.some((v) => v.toLowerCase().includes(kw))

type Props = {
  className?: string
} & InternetRedundancyEstimatorBlockProps

export const InternetRedundancyEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  connectionsLabel,
  connectionsOptions = [],
  setupLabel,
  setupOptions = [],
  sizeLabel,
  sizeOptions = [],
  locationsLabel,
  locationsOptions = [],
  reqLabel,
  reqOptions = [],
  submitLabel,
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const single = [
    { label: connectionsLabel, options: connectionsOptions || [], icon: Globe },
    { label: setupLabel, options: setupOptions || [], icon: Router },
    { label: sizeLabel, options: sizeOptions || [], icon: Users },
    { label: locationsLabel, options: locationsOptions || [], icon: MapPin },
  ]
  const safeReq = reqOptions || []
  const totalSteps = single.length + 1

  const [answers, setAnswers] = useState<(number | null)[]>(Array(single.length).fill(null))
  const [reqSel, setReqSel] = useState<number[]>([])
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (single.some((s) => s.options.length === 0) || safeReq.length === 0) return null

  const onSingle = (i: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = i
      return next
    })
    setStep((s) => s + 1)
  }
  const toggleReq = (i: number) =>
    setReqSel((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setAnswers(Array(single.length).fill(null))
    setReqSel([])
    setStep(0)
    setSubmitted(false)
  }

  const t = (i: number) => (answers[i] === null ? undefined : single[i].options[answers[i] as number]?.text)

  const result = (() => {
    if (!submitted) return null
    const connections = t(0)
    const locations = t(3)
    const reqs = reqSel.map((i) => safeReq[i]?.text || '').filter(Boolean)

    const multiSite = has(reqs, 'multi-site') || has(reqs, 'multi site') || (locations || '').includes('6')
    const onlyOne = (connections || '').trim() === '1'

    let label: string
    if (onlyOne) label = 'Single-Connection Setup: Add Redundancy First'
    else if (multiSite) label = 'Multi-Site Multi-WAN Architecture'
    else if ((connections || '').includes('4')) label = 'Enterprise Multi-WAN Architecture'
    else if ((connections || '').trim() === '3') label = 'Triple-WAN Architecture'
    else label = 'Dual-WAN Architecture'

    const includes: string[] = []
    includes.push('A site survey and traffic review before anything is specified')
    if (onlyOne) includes.push('A second internet connection, needed before load balancing or failover is possible')
    if (has(reqs, 'load balanc')) includes.push('Traffic distributed across your connections for everyday performance')
    if (has(reqs, 'failover') || has(reqs, 'redundan'))
      includes.push("Automatic failover so a dropped connection doesn't take the site offline")
    if (has(reqs, 'vpn')) includes.push('Site-to-site or remote-access VPN kept up on a healthy link')
    if (has(reqs, 'voip')) includes.push('Voice traffic prioritised or protected from a degraded connection')
    if (has(reqs, 'video')) includes.push('A stable path reserved for video calls')
    if (has(reqs, 'cloud')) includes.push('Efficient routing to Microsoft 365, Azure, AWS and other cloud platforms')
    if (multiSite) includes.push('One consistent architecture and management console across every site')
    includes.push('Central visibility of link health and usage')

    return { label, includes }
  })()

  return (
    <section ref={sectionRef} className={cn('bg-white py-7 md:py-9 scroll-mt-32', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mb-4 max-w-2xl">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-3 leading-relaxed text-gray-600">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100}>
          <EstimatorCard>
            {result ? (
              <div className={estimatorBodyClassName}>
                <EstimatorResultPanel eyebrow="Recommended Multi-WAN Architecture" headline={result.label}>
                  Based on your answers, we would design a {result.label.toLowerCase()}.
                  <ul className="mx-auto mt-4 inline-block space-y-1.5 text-left">
                    {result.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 block">Confirmed with a site assessment before anything is quoted.</span>
                </EstimatorResultPanel>
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame
                icon={step < single.length ? single[step].icon : ListChecks}
                current={step}
                total={totalSteps}
              >
                <div key={step} className="animate-step-in">
                  {step < single.length ? (
                    <>
                      <ChipQuestion
                        label={single[step].label}
                        options={single[step].options}
                        value={answers[step]}
                        onChange={onSingle}
                      />
                      <WizardBackLink show={step > 0} onBack={handleBack} />
                    </>
                  ) : (
                    <>
                      <label className="mb-6 block text-xl font-semibold text-foreground md:text-2xl">
                        {reqLabel}
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {safeReq.map((opt, i) => {
                          const on = reqSel.includes(i)
                          return (
                            <button
                              key={opt.id || i}
                              type="button"
                              onClick={() => toggleReq(i)}
                              className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-5 py-3 text-base font-medium transition-all duration-150 active:scale-95',
                                on
                                  ? 'border-primary_red bg-primary_red text-white shadow-sm shadow-primary_red/20'
                                  : 'border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-primary_red/50 hover:bg-[#FDEBEC] hover:text-primary_red',
                              )}
                            >
                              {on && <Check className="h-4 w-4" />}
                              {opt.text}
                            </button>
                          )
                        })}
                      </div>
                      <WizardNav
                        showBack
                        onBack={handleBack}
                        onNext={() => setSubmitted(true)}
                        nextLabel={submitLabel || 'Get My Network Recommendation'}
                        nextDisabled={reqSel.length === 0}
                      />
                    </>
                  )}
                </div>
              </EstimatorWizardFrame>
            )}

            <EstimatorFooter disclaimer={disclaimer} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          </EstimatorCard>
        </Reveal>
      </div>
    </section>
  )
}
