'use client'

import type { AICameraEstimatorBlock as AICameraEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Camera, MapPin, Maximize2, Sparkles } from 'lucide-react'

// Best-effort recommended AI camera type, matched the same way as the page's
// own "Which AI Camera Is Right for You?" categories: vehicle-related needs
// (an explicit Vehicle Detection interest, or parking coverage) take
// priority since ANPR is a distinct product line, then coverage drives the
// rest directly - each coverage option maps to exactly the camera type its
// own description matches (perimeter/entrance/outdoor -> bullet, restricted
// -> flexible turret, multiple areas -> remotely-controlled PTZ, indoor and
// everything else -> dome).
function aiCameraLabel(coverageText?: string | null, featureText?: string | null): string {
  const coverage = (coverageText || '').toLowerCase()
  const feature = (featureText || '').toLowerCase()

  if (feature.includes('vehicle detection') || coverage.includes('parking')) return 'AI ANPR Cameras'
  if (coverage.includes('multiple areas')) return 'AI PTZ Cameras'
  if (coverage.includes('perimeter') || coverage.includes('entrance') || coverage.includes('outdoor')) return 'AI Bullet Cameras'
  if (coverage.includes('restricted')) return 'AI Turret Cameras'
  return 'AI Dome Cameras'
}

function featureNote(featureText?: string | null): string {
  const t = (featureText || '').trim().toLowerCase()
  if (!t) return ''
  if (t === 'other') return "We'll help you determine which AI detection features best suit your site."
  return `We'll configure ${featureText?.toLowerCase()} as a priority for your system.`
}

function existingCctvNote(existingCctvText?: string | null): string {
  // Exact match, not .includes() - keeps this resilient if wording is
  // ever edited to something like "Not Sure" down the line.
  const t = (existingCctvText || '').trim().toLowerCase()
  if (t.includes('upgrade')) return "We'll assess your existing CCTV and recommend the right upgrade path to AI-powered detection."
  if (t.includes('integrate')) return "We'll integrate new AI cameras alongside your existing CCTV system."
  if (t === 'no') return "We'll design a complete new AI camera system for your site."
  return "We'll assess your current setup and recommend the best path forward."
}

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & AICameraEstimatorBlockProps

export const AICameraEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  propertyLabel,
  propertyOptions = [],
  areaLabel,
  areaOptions = [],
  coverageLabel,
  coverageOptions = [],
  featureLabel,
  featureOptions = [],
  existingCctvLabel,
  existingCctvOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeProperty = propertyOptions || []
  const safeArea = areaOptions || []
  const safeCoverage = coverageOptions || []
  const safeFeature = featureOptions || []
  const safeExistingCctv = existingCctvOptions || []

  const [property, setProperty] = useState<number | null>(null)
  const [area, setArea] = useState<number | null>(null)
  const [coverage, setCoverage] = useState<number | null>(null)
  const [feature, setFeature] = useState<number | null>(null)
  const [existingCctv, setExistingCctv] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeProperty.length === 0 ||
    safeArea.length === 0 ||
    safeCoverage.length === 0 ||
    safeFeature.length === 0 ||
    safeExistingCctv.length === 0
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
      icon: Building2,
      content: <ChipQuestion label={propertyLabel} options={safeProperty} value={property} onChange={(i) => select(setProperty, i)} />,
    },
    {
      icon: Maximize2,
      content: <ChipQuestion label={areaLabel} options={safeArea} value={area} onChange={(i) => select(setArea, i)} />,
    },
    {
      icon: MapPin,
      content: <ChipQuestion label={coverageLabel} options={safeCoverage} value={coverage} onChange={(i) => select(setCoverage, i)} />,
    },
    {
      icon: Sparkles,
      content: <ChipQuestion label={featureLabel} options={safeFeature} value={feature} onChange={(i) => select(setFeature, i)} />,
    },
    {
      icon: Camera,
      content: (
        <ChipQuestion
          label={existingCctvLabel}
          options={safeExistingCctv}
          value={existingCctv}
          onChange={(i) => select(setExistingCctv, i)}
        />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setProperty(null)
    setArea(null)
    setCoverage(null)
    setFeature(null)
    setExistingCctv(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const propertyText = safeProperty[property as number]?.text
    const areaText = safeArea[area as number]?.text
    const coverageText = safeCoverage[coverage as number]?.text
    const featureText = safeFeature[feature as number]?.text
    const existingCctvText = safeExistingCctv[existingCctv as number]?.text

    const label = aiCameraLabel(coverageText, featureText)

    return {
      label,
      propertyText,
      areaText,
      coverageText,
      featureNote: featureNote(featureText),
      existingCctvNote: existingCctvNote(existingCctvText),
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
                <EstimatorResultPanel eyebrow="Recommended AI Camera System" headline={result.label}>
                  For {article(result.propertyText)} {result.propertyText?.toLowerCase()} ({result.areaText?.toLowerCase()}) needing
                  coverage for {result.coverageText?.toLowerCase()}, we recommend {result.label}. {result.featureNote}{' '}
                  {result.existingCctvNote}
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
