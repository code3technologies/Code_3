'use client'

import type { ItOutsourcingEstimatorBlock as ItOutsourcingEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Users, MapPin, Server, Layers } from 'lucide-react'

function outsourcingModel(currentModelText?: string | null): string {
  const current = (currentModelText || '').toLowerCase()

  if (current.includes('no internal it')) return 'Fully Outsourced IT'
  if (current.includes('one it employee')) return 'Co-Managed IT'
  if (current.includes('existing outsourced')) return 'Specialist IT Outsourcing'
  if (current.includes('it team')) return 'IT Resource Outsourcing'
  return 'Fully Outsourced IT'
}

type Props = {
  className?: string
} & ItOutsourcingEstimatorBlockProps

export const ItOutsourcingEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  businessSizeLabel,
  businessSizeOptions = [],
  locationsLabel,
  locationsOptions = [],
  currentModelLabel,
  currentModelOptions = [],
  engagementLabel,
  engagementOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBusinessSize = businessSizeOptions || []
  const safeLocations = locationsOptions || []
  const safeCurrentModel = currentModelOptions || []
  const safeEngagement = engagementOptions || []

  const [businessSize, setBusinessSize] = useState<number | null>(null)
  const [locations, setLocations] = useState<number | null>(null)
  const [currentModel, setCurrentModel] = useState<number | null>(null)
  const [engagement, setEngagement] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeBusinessSize.length === 0 ||
    safeLocations.length === 0 ||
    safeCurrentModel.length === 0 ||
    safeEngagement.length === 0
  ) {
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
      icon: Users,
      content: (
        <ChipQuestion
          label={businessSizeLabel}
          options={safeBusinessSize}
          value={businessSize}
          onChange={(i) => select(setBusinessSize, i)}
        />
      ),
    },
    {
      icon: MapPin,
      content: (
        <ChipQuestion label={locationsLabel} options={safeLocations} value={locations} onChange={(i) => select(setLocations, i)} />
      ),
    },
    {
      icon: Server,
      content: (
        <ChipQuestion
          label={currentModelLabel}
          options={safeCurrentModel}
          value={currentModel}
          onChange={(i) => select(setCurrentModel, i)}
        />
      ),
    },
    {
      icon: Layers,
      content: (
        <ChipQuestion
          label={engagementLabel}
          options={safeEngagement}
          value={engagement}
          onChange={(i) => select(setEngagement, i)}
        />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setBusinessSize(null)
    setLocations(null)
    setCurrentModel(null)
    setEngagement(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const businessSizeText = safeBusinessSize[businessSize as number]?.text
    const locationsText = safeLocations[locations as number]?.text
    const currentModelText = safeCurrentModel[currentModel as number]?.text

    const label = outsourcingModel(currentModelText)

    return { label, businessSizeText, locationsText, currentModelText }
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
                <EstimatorResultPanel eyebrow="Suggested Outsourcing Model" headline={result.label}>
                  For a business with {result.businessSizeText?.toLowerCase()} across {result.locationsText?.toLowerCase()},
                  currently at &ldquo;{result.currentModelText?.toLowerCase()}&rdquo;, this is a reasonable starting point —
                  CODE3 confirms the final scope and engagement model after a short consultation.
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
