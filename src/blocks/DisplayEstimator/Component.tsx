'use client'

import type { DisplayEstimatorBlock as DisplayEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { MapPin, Users, Video } from 'lucide-react'

// Maps a "Number of Users" option index to a recommended screen-size tier
// index within sizeTiers (0-based, smallest to largest). Kept in code as a
// best-effort default since there's no explicit screen-size question anymore.
const USERS_TO_SIZE_TIER = [0, 1, 1, 2]

type Props = {
  className?: string
} & DisplayEstimatorBlockProps

export const DisplayEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  locationLabel,
  locationOptions = [],
  usersLabel,
  usersOptions = [],
  sizeTiers = [],
  vcLabel,
  vcOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeLocation = locationOptions || []
  const safeUsers = usersOptions || []
  const safeSizeTiers = sizeTiers || []
  const safeVc = vcOptions || []

  const [location, setLocation] = useState<number | null>(null)
  const [users, setUsers] = useState<number | null>(null)
  const [vc, setVc] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (safeLocation.length === 0 || safeUsers.length === 0 || safeSizeTiers.length === 0 || safeVc.length === 0) {
    return null
  }

  const totalSteps = 3
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
      content: <ChipQuestion label={usersLabel} options={safeUsers} value={users} onChange={(i) => select(setUsers, i)} />,
    },
    {
      icon: Video,
      content: <ChipQuestion label={vcLabel} options={safeVc} value={vc} onChange={(i) => select(setVc, i)} />,
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setLocation(null)
    setUsers(null)
    setVc(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const wantsVc = (safeVc[vc as number]?.text || '').toLowerCase().includes('yes')
    const tierIndex = Math.min(USERS_TO_SIZE_TIER[users as number] ?? 0, safeSizeTiers.length - 1)

    return {
      size: safeSizeTiers[tierIndex]?.text,
      locationText: safeLocation[location as number]?.text,
      usersText: safeUsers[users as number]?.text,
      wantsVc,
    }
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
                <EstimatorResultPanel eyebrow="Recommended Display Size" headline={result.size}>
                  For a {result.locationText?.toLowerCase()} with {result.usersText} people, this size keeps the screen
                  clearly visible from every seat.
                  {result.wantsVc && " We'll include an integrated camera and audio setup for seamless video conferencing."}
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
