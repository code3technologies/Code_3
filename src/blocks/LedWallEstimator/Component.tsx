'use client'

import type { LedWallEstimatorBlock as LedWallEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { MapPin, LayoutGrid, Ruler, Film, Network } from 'lucide-react'

function ledRecommendation(environmentText?: string | null, viewingDistanceText?: string | null): string {
  const environment = (environmentText || '').toLowerCase()
  const distance = (viewingDistanceText || '').toLowerCase()

  if (environment.includes('outdoor')) return 'Outdoor-Rated LED Wall'
  if (distance.includes('close range')) return 'Fine-Pitch Indoor LED Wall'
  if (distance.includes('large space')) return 'Large-Format Indoor LED Wall'
  return 'Standard Indoor LED Wall'
}

type Props = {
  className?: string
} & LedWallEstimatorBlockProps

export const LedWallEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  environmentLabel,
  environmentOptions = [],
  applicationLabel,
  applicationOptions = [],
  viewingDistanceLabel,
  viewingDistanceOptions = [],
  contentTypeLabel,
  contentTypeOptions = [],
  existingLabel,
  existingOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeEnvironment = environmentOptions || []
  const safeApplication = applicationOptions || []
  const safeViewingDistance = viewingDistanceOptions || []
  const safeContentType = contentTypeOptions || []
  const safeExisting = existingOptions || []

  const [environment, setEnvironment] = useState<number | null>(null)
  const [application, setApplication] = useState<number | null>(null)
  const [viewingDistance, setViewingDistance] = useState<number | null>(null)
  const [contentType, setContentType] = useState<number | null>(null)
  const [existing, setExisting] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeEnvironment.length === 0 ||
    safeApplication.length === 0 ||
    safeViewingDistance.length === 0 ||
    safeContentType.length === 0 ||
    safeExisting.length === 0
  ) {
    return null
  }

  const totalSteps = 5
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
      content: (
        <ChipQuestion
          label={environmentLabel}
          options={safeEnvironment}
          value={environment}
          onChange={(i) => select(setEnvironment, i)}
        />
      ),
    },
    {
      icon: LayoutGrid,
      content: (
        <ChipQuestion
          label={applicationLabel}
          options={safeApplication}
          value={application}
          onChange={(i) => select(setApplication, i)}
        />
      ),
    },
    {
      icon: Ruler,
      content: (
        <ChipQuestion
          label={viewingDistanceLabel}
          options={safeViewingDistance}
          value={viewingDistance}
          onChange={(i) => select(setViewingDistance, i)}
        />
      ),
    },
    {
      icon: Film,
      content: (
        <ChipQuestion
          label={contentTypeLabel}
          options={safeContentType}
          value={contentType}
          onChange={(i) => select(setContentType, i)}
        />
      ),
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
    setEnvironment(null)
    setApplication(null)
    setViewingDistance(null)
    setContentType(null)
    setExisting(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const environmentText = safeEnvironment[environment as number]?.text
    const applicationText = safeApplication[application as number]?.text
    const viewingDistanceText = safeViewingDistance[viewingDistance as number]?.text

    const label = ledRecommendation(environmentText, viewingDistanceText)

    return { label, environmentText, applicationText, viewingDistanceText }
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
                <EstimatorResultPanel eyebrow="Suggested LED Wall Type" headline={result.label}>
                  For a {result.applicationText?.toLowerCase()} application with a{' '}
                  {result.viewingDistanceText?.toLowerCase()} viewing distance, this is a reasonable starting point — CODE3
                  confirms the final pixel pitch, brightness and structure after a site assessment.
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
