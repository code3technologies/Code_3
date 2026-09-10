'use client'

import type { CastingEstimatorBlock as CastingEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Laptop, MapPin, Tv, Users, Video } from 'lucide-react'

// Best-effort recommended casting label from the selected device platform.
function deviceLabel(text?: string | null): string {
  const t = (text || '').toLowerCase()
  if (t.includes('windows')) return 'Windows Wireless Casting'
  if (t.includes('mac')) return 'Mac Wireless Casting'
  if (t.includes('iphone') || t.includes('ipad') || t.includes('ios')) return 'iOS Wireless Casting'
  if (t.includes('android')) return 'Android Wireless Casting'
  return 'Cross-Platform Wireless Casting'
}

type Props = {
  className?: string
} & CastingEstimatorBlockProps

export const CastingEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  locationLabel,
  locationOptions = [],
  participantsLabel,
  participantsOptions = [],
  currentDisplayLabel,
  currentDisplayOptions = [],
  devicesLabel,
  devicesOptions = [],
  vcLabel,
  vcOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeLocation = locationOptions || []
  const safeParticipants = participantsOptions || []
  const safeCurrentDisplay = currentDisplayOptions || []
  const safeDevices = devicesOptions || []
  const safeVc = vcOptions || []

  const [location, setLocation] = useState<number | null>(null)
  const [participants, setParticipants] = useState<number | null>(null)
  const [currentDisplay, setCurrentDisplay] = useState<number | null>(null)
  const [devices, setDevices] = useState<number | null>(null)
  const [vc, setVc] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeLocation.length === 0 ||
    safeParticipants.length === 0 ||
    safeCurrentDisplay.length === 0 ||
    safeDevices.length === 0 ||
    safeVc.length === 0
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
      content: <ChipQuestion label={locationLabel} options={safeLocation} value={location} onChange={(i) => select(setLocation, i)} />,
    },
    {
      icon: Users,
      content: (
        <ChipQuestion
          label={participantsLabel}
          options={safeParticipants}
          value={participants}
          onChange={(i) => select(setParticipants, i)}
        />
      ),
    },
    {
      icon: Tv,
      content: (
        <ChipQuestion
          label={currentDisplayLabel}
          options={safeCurrentDisplay}
          value={currentDisplay}
          onChange={(i) => select(setCurrentDisplay, i)}
        />
      ),
    },
    {
      icon: Laptop,
      content: <ChipQuestion label={devicesLabel} options={safeDevices} value={devices} onChange={(i) => select(setDevices, i)} />,
    },
    {
      icon: Video,
      content: <ChipQuestion label={vcLabel} options={safeVc} value={vc} onChange={(i) => select(setVc, i)} />,
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setLocation(null)
    setParticipants(null)
    setCurrentDisplay(null)
    setDevices(null)
    setVc(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const locationText = safeLocation[location as number]?.text
    const participantsText = safeParticipants[participants as number]?.text
    const currentDisplayText = safeCurrentDisplay[currentDisplay as number]?.text
    const devicesText = safeDevices[devices as number]?.text
    // Exact match, not .includes() - "Not Sure" contains the substring "no"
    // and would otherwise be misread as a "No" answer.
    const vcText = (safeVc[vc as number]?.text || '').trim().toLowerCase()

    const label = deviceLabel(devicesText)

    let vcNote = "We'll help you determine whether conferencing-ready casting makes sense for your setup."
    if (vcText === 'yes') {
      vcNote = "We'll include conferencing-ready casting so remote participants can join every session."
    } else if (vcText === 'no') {
      vcNote = "Since video conferencing isn't required, we'll focus on fast, reliable local screen sharing."
    }

    return { label, locationText, participantsText, currentDisplayText, devicesText, vcNote }
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
                <EstimatorResultPanel eyebrow="Recommended Casting Setup" headline={result.label}>
                  For a {result.locationText?.toLowerCase()} with {result.participantsText?.toLowerCase()} participants
                  using a {result.currentDisplayText?.toLowerCase()}, this setup is a strong fit. {result.vcNote}
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
