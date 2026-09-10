'use client'

import type { CCTVEstimatorBlock as CCTVEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Camera, Eye, Grid2x2, MapPin, Sparkles } from 'lucide-react'

// Best-effort recommended system type, matched the same way as the page's
// own "Types of CCTV Systems" categories: AI analytics takes priority (the
// most advanced tier) since it's a distinct product line, then camera count
// drives centralized NVR-based management at scale, then coverage area
// drives the indoor/outdoor/PTZ split, defaulting to a general IP system.
function cctvLabel(camerasText?: string | null, coverageText?: string | null, aiText?: string | null): string {
  const cameras = (camerasText || '').toLowerCase()
  const coverage = (coverageText || '').toLowerCase()
  // Exact match, not .includes() - "Not Sure" contains the substring "no"
  // and would otherwise be misread as a "No" answer.
  const ai = (aiText || '').trim().toLowerCase()

  if (ai === 'yes') return 'AI-Powered CCTV'
  if (cameras.includes('17') || cameras.includes('32')) return 'NVR-Based Surveillance'
  if (coverage.includes('perimeter')) return 'PTZ Cameras'
  if (coverage.includes('outdoor') || coverage.includes('parking')) return 'Outdoor CCTV'
  if (coverage.includes('indoor') || coverage.includes('entrance') || coverage.includes('all areas')) return 'Indoor CCTV'
  return 'IP CCTV Systems'
}

function remoteViewingNote(remoteViewingText?: string | null): string {
  const r = (remoteViewingText || '').trim().toLowerCase()
  if (r === 'yes') return "We'll include remote viewing so you can monitor your site from anywhere."
  if (r === 'no') return "We'll focus on local viewing and recording for your site."
  return "We'll help you decide whether remote viewing makes sense for your setup."
}

function aiNote(aiText?: string | null): string {
  const a = (aiText || '').trim().toLowerCase()
  if (a === 'no') return "Since analytics isn't a priority, we'll focus on reliable, standard coverage and recording."
  if (a === 'yes') return ''
  return "We'll help you determine whether AI analytics adds value for your site."
}

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & CCTVEstimatorBlockProps

export const CCTVEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  propertyLabel,
  propertyOptions = [],
  areaLabel,
  areaOptions = [],
  camerasLabel,
  camerasOptions = [],
  coverageLabel,
  coverageOptions = [],
  remoteViewingLabel,
  remoteViewingOptions = [],
  aiLabel,
  aiOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeProperty = propertyOptions || []
  const safeArea = areaOptions || []
  const safeCameras = camerasOptions || []
  const safeCoverage = coverageOptions || []
  const safeRemoteViewing = remoteViewingOptions || []
  const safeAi = aiOptions || []

  const [property, setProperty] = useState<number | null>(null)
  const [area, setArea] = useState<number | null>(null)
  const [cameras, setCameras] = useState<number | null>(null)
  const [coverage, setCoverage] = useState<number | null>(null)
  const [remoteViewing, setRemoteViewing] = useState<number | null>(null)
  const [ai, setAi] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeProperty.length === 0 ||
    safeArea.length === 0 ||
    safeCameras.length === 0 ||
    safeCoverage.length === 0 ||
    safeRemoteViewing.length === 0 ||
    safeAi.length === 0
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
      content: <ChipQuestion label={propertyLabel} options={safeProperty} value={property} onChange={(i) => select(setProperty, i)} />,
    },
    { icon: MapPin, content: <ChipQuestion label={areaLabel} options={safeArea} value={area} onChange={(i) => select(setArea, i)} /> },
    {
      icon: Camera,
      content: <ChipQuestion label={camerasLabel} options={safeCameras} value={cameras} onChange={(i) => select(setCameras, i)} />,
    },
    {
      icon: Grid2x2,
      content: <ChipQuestion label={coverageLabel} options={safeCoverage} value={coverage} onChange={(i) => select(setCoverage, i)} />,
    },
    {
      icon: Eye,
      content: (
        <ChipQuestion
          label={remoteViewingLabel}
          options={safeRemoteViewing}
          value={remoteViewing}
          onChange={(i) => select(setRemoteViewing, i)}
        />
      ),
    },
    { icon: Sparkles, content: <ChipQuestion label={aiLabel} options={safeAi} value={ai} onChange={(i) => select(setAi, i)} /> },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setProperty(null)
    setArea(null)
    setCameras(null)
    setCoverage(null)
    setRemoteViewing(null)
    setAi(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const propertyText = safeProperty[property as number]?.text
    const areaText = safeArea[area as number]?.text
    const camerasText = safeCameras[cameras as number]?.text
    const coverageText = safeCoverage[coverage as number]?.text
    const remoteViewingText = safeRemoteViewing[remoteViewing as number]?.text
    const aiText = safeAi[ai as number]?.text

    const label = cctvLabel(camerasText, coverageText, aiText)

    return {
      label,
      propertyText,
      areaText,
      camerasText,
      coverageText,
      remoteViewingNote: remoteViewingNote(remoteViewingText),
      aiNote: aiNote(aiText),
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
                <EstimatorResultPanel eyebrow="Recommended CCTV System" headline={result.label}>
                  For {article(result.propertyText)} {result.propertyText?.toLowerCase()} ({result.areaText?.toLowerCase()}) needing{' '}
                  {result.camerasText?.toLowerCase()} cameras covering {result.coverageText?.toLowerCase()}, we recommend{' '}
                  {result.label}. {result.remoteViewingNote} {result.aiNote}
                </EstimatorResultPanel>
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame icon={steps[step].icon} current={step} total={totalSteps}>
                <div key={step}>
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
