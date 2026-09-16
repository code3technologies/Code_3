'use client'

import type { AuditoriumEstimatorBlock as AuditoriumEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Users, ClipboardList, Monitor, Volume2, ListPlus } from 'lucide-react'

type Props = {
  className?: string
} & AuditoriumEstimatorBlockProps

export const AuditoriumEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  venueTypeLabel,
  venueTypeOptions = [],
  audienceSizeLabel,
  audienceSizeOptions = [],
  primaryRequirementLabel,
  primaryRequirementOptions = [],
  visualLabel,
  visualOptions = [],
  audioLabel,
  audioOptions = [],
  additionalLabel,
  additionalOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeVenueType = venueTypeOptions || []
  const safeAudienceSize = audienceSizeOptions || []
  const safePrimaryRequirement = primaryRequirementOptions || []
  const safeVisual = visualOptions || []
  const safeAudio = audioOptions || []
  const safeAdditional = additionalOptions || []

  const [venueType, setVenueType] = useState<number | null>(null)
  const [audienceSize, setAudienceSize] = useState<number | null>(null)
  const [primaryRequirement, setPrimaryRequirement] = useState<number | null>(null)
  const [visual, setVisual] = useState<number | null>(null)
  const [audio, setAudio] = useState<number | null>(null)
  const [additional, setAdditional] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeVenueType.length === 0 ||
    safeAudienceSize.length === 0 ||
    safePrimaryRequirement.length === 0 ||
    safeVisual.length === 0 ||
    safeAudio.length === 0 ||
    safeAdditional.length === 0
  ) {
    return null
  }

  const totalSteps = 6
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
      icon: Building2,
      content: (
        <ChipQuestion label={venueTypeLabel} options={safeVenueType} value={venueType} onChange={(i) => select(setVenueType, i)} />
      ),
    },
    {
      icon: Users,
      content: (
        <ChipQuestion
          label={audienceSizeLabel}
          options={safeAudienceSize}
          value={audienceSize}
          onChange={(i) => select(setAudienceSize, i)}
        />
      ),
    },
    {
      icon: ClipboardList,
      content: (
        <ChipQuestion
          label={primaryRequirementLabel}
          options={safePrimaryRequirement}
          value={primaryRequirement}
          onChange={(i) => select(setPrimaryRequirement, i)}
        />
      ),
    },
    {
      icon: Monitor,
      content: <ChipQuestion label={visualLabel} options={safeVisual} value={visual} onChange={(i) => select(setVisual, i)} />,
    },
    {
      icon: Volume2,
      content: <ChipQuestion label={audioLabel} options={safeAudio} value={audio} onChange={(i) => select(setAudio, i)} />,
    },
    {
      icon: ListPlus,
      content: (
        <ChipQuestion label={additionalLabel} options={safeAdditional} value={additional} onChange={(i) => select(setAdditional, i)} />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setVenueType(null)
    setAudienceSize(null)
    setPrimaryRequirement(null)
    setVisual(null)
    setAudio(null)
    setAdditional(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const venueTypeText = safeVenueType[venueType as number]?.text
    const audienceSizeText = safeAudienceSize[audienceSize as number]?.text
    const primaryRequirementText = safePrimaryRequirement[primaryRequirement as number]?.text
    const visualText = safeVisual[visual as number]?.text
    const audioText = safeAudio[audio as number]?.text
    const additionalText = safeAdditional[additional as number]?.text

    return { venueTypeText, audienceSizeText, primaryRequirementText, visualText, audioText, additionalText }
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
                <EstimatorResultPanel eyebrow="Recommended Auditorium AV Scope" headline={`${result.audienceSizeText} ${result.venueTypeText} Auditorium`}>
                  For a {result.audienceSizeText?.toLowerCase()} {result.venueTypeText?.toLowerCase()} auditorium focused on{' '}
                  {result.primaryRequirementText?.toLowerCase()}, a {result.visualText?.toLowerCase()} paired with{' '}
                  {result.audioText?.toLowerCase()}-focused audio is a reasonable starting point — with {result.additionalText?.toLowerCase()}{' '}
                  added to the scope.
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
