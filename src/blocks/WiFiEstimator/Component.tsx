'use client'

import type { WiFiEstimatorBlock as WiFiEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Check } from 'lucide-react'
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
import { Layers, ListChecks, Maximize2, MonitorSmartphone, Users, Wifi } from 'lucide-react'

const has = (arr: string[], kw: string) => arr.some((v) => v.toLowerCase().includes(kw))
const idxHigh = (text: string | undefined, highs: string[]) =>
  !!text && highs.some((h) => text.toLowerCase().includes(h))

type Props = {
  className?: string
} & WiFiEstimatorBlockProps

export const WiFiEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  sizeLabel,
  sizeOptions = [],
  floorsLabel,
  floorsOptions = [],
  areaLabel,
  areaOptions = [],
  devicesLabel,
  devicesOptions = [],
  existingLabel,
  existingOptions = [],
  reqLabel,
  reqOptions = [],
  submitLabel,
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const single = [
    { label: sizeLabel, options: sizeOptions || [], icon: Users },
    { label: floorsLabel, options: floorsOptions || [], icon: Layers },
    { label: areaLabel, options: areaOptions || [], icon: Maximize2 },
    { label: devicesLabel, options: devicesOptions || [], icon: MonitorSmartphone },
    { label: existingLabel, options: existingOptions || [], icon: Wifi },
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
    const size = t(0)
    const floors = t(1)
    const devices = t(3)
    const existing = t(4)
    const reqs = reqSel.map((i) => safeReq[i]?.text || '').filter(Boolean)

    const multiLocation = has(reqs, 'multi-location') || has(reqs, 'multi location') || idxHigh(size, ['250+', '251'])
    const multiFloor = has(reqs, 'multi-floor') || has(reqs, 'multi floor') || idxHigh(floors, ['4', '5', '6', '7+'])
    const highDensity = has(reqs, 'high-density') || has(reqs, 'high density') || idxHigh(devices, ['200', '250', '500'])
    const isUpgrade = !!existing && existing.toLowerCase().includes('upgrade')

    let label: string
    if (multiLocation) label = 'Multi-Site Managed Wi-Fi'
    else if (multiFloor) label = 'Multi-Floor Managed Wi-Fi'
    else if (highDensity) label = 'High-Density Business Wi-Fi'
    else if (isUpgrade) label = 'Wi-Fi Upgrade & Optimisation'
    else label = 'Single-Site Business Wi-Fi'

    const includes: string[] = []
    includes.push('A site survey to place access points, not a fixed count from a drawing')
    includes.push(
      isUpgrade
        ? 'An assessment of the current access points and cabling, reusing what still fits'
        : 'A fresh wireless design across the whole site',
    )
    if (has(reqs, 'staff')) includes.push('A managed staff network with seamless roaming')
    if (has(reqs, 'guest')) includes.push('A separate, isolated guest network')
    if (highDensity) includes.push('Extra access point density and tuning for busy areas')
    if (multiFloor) includes.push('Coverage planned floor by floor with controlled overlap')
    if (multiLocation) includes.push('One network and one management console across every site')
    includes.push('Central management and monitoring')

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
                <EstimatorResultPanel eyebrow="Recommended Wi-Fi Setup" headline={result.label}>
                  Based on your answers, we would design a {result.label.toLowerCase()}.
                  <ul className="mx-auto mt-4 inline-block space-y-1.5 text-left">
                    {result.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 block">Confirmed with a site survey before anything is quoted.</span>
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
                        nextLabel={submitLabel || 'Get My Wi-Fi Recommendation'}
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
