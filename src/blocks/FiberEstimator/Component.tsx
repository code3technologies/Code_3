'use client'

import type { FiberEstimatorBlock as FiberEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { ClipboardList, Ruler, Wrench, Network } from 'lucide-react'

// Best-effort fiber-type guidance based on distance alone, mirroring the
// page's own "Single-Mode vs Multimode Fiber" guidance: shorter links favor
// multimode, longer backbone/building-to-building links favor single-mode.
function fiberTypeLabel(distanceText?: string | null): string {
  const distance = (distanceText || '').toLowerCase()

  if (distance.includes('not sure')) return 'Fiber Type to Be Confirmed'
  if (distance.includes('under 100m') || distance.includes('100') && distance.includes('500m')) {
    return 'Multimode Fiber (OM3/OM4)'
  }
  return 'Single-Mode Fiber (OS2)'
}

type Props = {
  className?: string
} & FiberEstimatorBlockProps

export const FiberEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  projectTypeLabel,
  projectTypeOptions = [],
  distanceLabel,
  distanceOptions = [],
  needLabel,
  needOptions = [],
  existingLabel,
  existingOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeProjectType = projectTypeOptions || []
  const safeDistance = distanceOptions || []
  const safeNeed = needOptions || []
  const safeExisting = existingOptions || []

  const [projectType, setProjectType] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [need, setNeed] = useState<number | null>(null)
  const [existing, setExisting] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (safeProjectType.length === 0 || safeDistance.length === 0 || safeNeed.length === 0 || safeExisting.length === 0) {
    return null
  }

  const totalSteps = 4
  const isLast = step === totalSteps - 1
  const advance = () => {
    if (isLast) setSubmitted(true)
    else setStep((s) => s + 1)
  }
  const select = (setter: (i: number) => void, i: number) => {
    setter(i)
    advance()
  }

  const steps = [
    {
      icon: ClipboardList,
      content: (
        <ChipQuestion
          label={projectTypeLabel}
          options={safeProjectType}
          value={projectType}
          onChange={(i) => select(setProjectType, i)}
        />
      ),
    },
    {
      icon: Ruler,
      content: <ChipQuestion label={distanceLabel} options={safeDistance} value={distance} onChange={(i) => select(setDistance, i)} />,
    },
    {
      icon: Wrench,
      content: <ChipQuestion label={needLabel} options={safeNeed} value={need} onChange={(i) => select(setNeed, i)} />,
    },
    {
      icon: Network,
      content: (
        <ChipQuestion label={existingLabel} options={safeExisting} value={existing} onChange={(i) => select(setExisting, i)} />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setProjectType(null)
    setDistance(null)
    setNeed(null)
    setExisting(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const projectTypeText = safeProjectType[projectType as number]?.text
    const distanceText = safeDistance[distance as number]?.text
    const needText = safeNeed[need as number]?.text

    const label = fiberTypeLabel(distanceText)

    return { label, projectTypeText, distanceText, needText }
  })()

  return (
    <section ref={sectionRef} className={cn('bg-white py-7 md:py-9 scroll-mt-32', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-4">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100}>
          <EstimatorCard>
            {result ? (
              <div className={estimatorBodyClassName}>
                <EstimatorResultPanel eyebrow="Suggested Fiber Type" headline={result.label}>
                  For a {result.projectTypeText?.toLowerCase()} project needing {result.needText?.toLowerCase()}, this is a
                  reasonable starting point — CODE3 confirms the final fiber type and architecture after a technical assessment.
                </EstimatorResultPanel>
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame icon={steps[step].icon} current={step} total={totalSteps}>
                <div key={step} className="animate-step-in">
                  {steps[step].content}
                  <WizardBackLink show={step > 0} onBack={handleBack} />
                </div>
              </EstimatorWizardFrame>
            )}

            <EstimatorFooter disclaimer={disclaimer} ctaText={ctaText} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          </EstimatorCard>
        </Reveal>
      </div>
    </section>
  )
}
