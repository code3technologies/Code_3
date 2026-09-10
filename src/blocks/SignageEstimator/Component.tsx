'use client'

import type { SignageEstimatorBlock as SignageEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { LayoutTemplate, MapPin, Monitor, Settings2, Sun } from 'lucide-react'

// Maps a "Where will it be used?" option index to a recommended screen-size
// tier index within sizeTiers (0-based, smallest to largest). Kept in code
// as a best-effort default since there's no explicit screen-size question.
// Order matches the default locationOptions: Corporate Office, Retail
// Store, Hotel, Restaurant, Healthcare, Education, Reception/Lobby, Outdoor.
const LOCATION_TO_SIZE_TIER = [0, 1, 2, 1, 0, 1, 0, 3]

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & SignageEstimatorBlockProps

export const SignageEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  locationLabel,
  locationOptions = [],
  screensLabel,
  screensOptions = [],
  environmentLabel,
  environmentOptions = [],
  sizeTiers = [],
  contentTypeLabel,
  contentTypeOptions = [],
  cmsLabel,
  cmsOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeLocation = locationOptions || []
  const safeScreens = screensOptions || []
  const safeEnvironment = environmentOptions || []
  const safeSizeTiers = sizeTiers || []
  const safeContentType = contentTypeOptions || []
  const safeCms = cmsOptions || []

  const [location, setLocation] = useState<number | null>(null)
  const [screens, setScreens] = useState<number | null>(null)
  const [environment, setEnvironment] = useState<number | null>(null)
  const [contentType, setContentType] = useState<number | null>(null)
  const [cms, setCms] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeLocation.length === 0 ||
    safeScreens.length === 0 ||
    safeEnvironment.length === 0 ||
    safeSizeTiers.length === 0 ||
    safeContentType.length === 0 ||
    safeCms.length === 0
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
      icon: Monitor,
      content: <ChipQuestion label={screensLabel} options={safeScreens} value={screens} onChange={(i) => select(setScreens, i)} />,
    },
    {
      icon: Sun,
      content: (
        <ChipQuestion label={environmentLabel} options={safeEnvironment} value={environment} onChange={(i) => select(setEnvironment, i)} />
      ),
    },
    {
      icon: Settings2,
      content: <ChipQuestion label={cmsLabel} options={safeCms} value={cms} onChange={(i) => select(setCms, i)} />,
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
    setScreens(null)
    setEnvironment(null)
    setContentType(null)
    setCms(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const wantsCms = (safeCms[cms as number]?.text || '').toLowerCase().includes('yes')
    const locationText = safeLocation[location as number]?.text
    const environmentText = safeEnvironment[environment as number]?.text
    const contentTypeText = safeContentType[contentType as number]?.text
    const screensText = safeScreens[screens as number]?.text

    const isOutdoor = (environmentText || '').toLowerCase().includes('outdoor')
    const tierIndex = isOutdoor
      ? safeSizeTiers.length - 1
      : Math.min(LOCATION_TO_SIZE_TIER[location as number] ?? 0, safeSizeTiers.length - 1)
    const sizeText = safeSizeTiers[tierIndex]?.text

    return { sizeText, locationText, environmentText, contentTypeText, screensText, wantsCms }
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
                <EstimatorResultPanel eyebrow="Recommended Screen Size" headline={result.sizeText}>
                  For {article(result.environmentText)} {result.environmentText?.toLowerCase()}{' '}
                  {result.locationText?.toLowerCase()} running {result.contentTypeText?.toLowerCase()} content across{' '}
                  {result.screensText?.toLowerCase()}, a {result.sizeText} display is a strong fit.{' '}
                  {result.wantsCms
                    ? "We'll include a cloud-based content management system so you can update and schedule content remotely across every screen."
                    : "Since a CMS isn't required, content can be updated directly per screen — you can always add centralized management later as you scale."}
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
