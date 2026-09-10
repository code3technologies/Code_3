'use client'

import type { VideoWallEstimatorBlock as VideoWallEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { LayoutTemplate, MapPin, Monitor, Ruler } from 'lucide-react'

// Best-effort recommended technology, matched the same way as the page's
// own "Video Wall Technologies for Every Environment" guidance: close
// viewing favors Fine-Pitch LED, control/command/security rooms favor
// LCD, everything else favors Direct View LED for large-format impact.
function techLabel(distanceText?: string | null, locationText?: string | null): string {
  const distance = (distanceText || '').toLowerCase()
  const location = (locationText || '').toLowerCase()

  if (distance.includes('close')) return 'Fine-Pitch LED'
  if (location.includes('control room') || location.includes('command center') || location.includes('security room')) {
    return 'LCD Video Wall'
  }
  return 'Direct View LED'
}

type Props = {
  className?: string
} & VideoWallEstimatorBlockProps

export const VideoWallEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  locationLabel,
  locationOptions = [],
  displaysLabel,
  displaysOptions = [],
  contentTypeLabel,
  contentTypeOptions = [],
  distanceLabel,
  distanceOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeLocation = locationOptions || []
  const safeDisplays = displaysOptions || []
  const safeContentType = contentTypeOptions || []
  const safeDistance = distanceOptions || []

  const [location, setLocation] = useState<number | null>(null)
  const [displays, setDisplays] = useState<number | null>(null)
  const [contentType, setContentType] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (safeLocation.length === 0 || safeDisplays.length === 0 || safeContentType.length === 0 || safeDistance.length === 0) {
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
      icon: MapPin,
      content: <ChipQuestion label={locationLabel} options={safeLocation} value={location} onChange={(i) => select(setLocation, i)} />,
    },
    {
      icon: Monitor,
      content: <ChipQuestion label={displaysLabel} options={safeDisplays} value={displays} onChange={(i) => select(setDisplays, i)} />,
    },
    {
      icon: Ruler,
      content: <ChipQuestion label={distanceLabel} options={safeDistance} value={distance} onChange={(i) => select(setDistance, i)} />,
    },
    {
      icon: LayoutTemplate,
      content: (
        <ChipQuestion
          label={contentTypeLabel}
          options={safeContentType}
          value={contentType}
          onChange={(i) => select(setContentType, i)}
        />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setLocation(null)
    setDisplays(null)
    setContentType(null)
    setDistance(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const locationText = safeLocation[location as number]?.text
    const displaysText = safeDisplays[displays as number]?.text
    const contentTypeText = safeContentType[contentType as number]?.text
    const distanceText = safeDistance[distance as number]?.text

    const label = techLabel(distanceText, locationText)

    return { label, locationText, displaysText, contentTypeText }
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
                <EstimatorResultPanel eyebrow="Recommended Technology" headline={result.label}>
                  For a {result.locationText?.toLowerCase()} showing {result.contentTypeText?.toLowerCase()} across{' '}
                  {result.displaysText?.toLowerCase()} displays, a {result.label} setup is a strong fit.
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

            <EstimatorFooter disclaimer={disclaimer} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          </EstimatorCard>
        </Reveal>
      </div>
    </section>
  )
}
