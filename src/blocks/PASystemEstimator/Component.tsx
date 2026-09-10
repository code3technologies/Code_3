'use client'

import type { PASystemEstimatorBlock as PASystemEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Grid2x2, ListChecks, Maximize2, Plug } from 'lucide-react'

// Best-effort recommended PA system type, matched the same way as the
// page's own "Public Address Systems for Every Requirement" types: an
// emergency need always takes priority (life-safety), then an explicit
// network/IP integration preference, then the other stated needs (with
// zone count implying zoning even if not explicitly chosen), defaulting
// to a general commercial system.
function paSystemLabel(needText?: string | null, integrationText?: string | null, zonesText?: string | null): string {
  const need = (needText || '').toLowerCase()
  const integration = (integrationText || '').toLowerCase()
  const zones = (zonesText || '').toLowerCase()

  if (need.includes('emergency')) return 'Voice Evacuation System'
  if (integration.includes('network') || integration.includes('ip')) return 'IP-Based PA System'
  if (need.includes('background music')) return 'Background Music System'
  if (need.includes('zoned paging') || zones.includes('6–10') || zones.includes('10+')) return 'Zoned PA System'
  if (need.includes('general announcements')) return 'Paging System'
  return 'Commercial PA System'
}

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & PASystemEstimatorBlockProps

export const PASystemEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  facilityLabel,
  facilityOptions = [],
  areaLabel,
  areaOptions = [],
  zonesLabel,
  zonesOptions = [],
  needLabel,
  needOptions = [],
  integrationLabel,
  integrationOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeFacility = facilityOptions || []
  const safeArea = areaOptions || []
  const safeZones = zonesOptions || []
  const safeNeed = needOptions || []
  const safeIntegration = integrationOptions || []

  const [facility, setFacility] = useState<number | null>(null)
  const [area, setArea] = useState<number | null>(null)
  const [zones, setZones] = useState<number | null>(null)
  const [need, setNeed] = useState<number | null>(null)
  const [integration, setIntegration] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeFacility.length === 0 ||
    safeArea.length === 0 ||
    safeZones.length === 0 ||
    safeNeed.length === 0 ||
    safeIntegration.length === 0
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
      content: (
        <ChipQuestion label={facilityLabel} options={safeFacility} value={facility} onChange={(i) => select(setFacility, i)} />
      ),
    },
    {
      icon: Maximize2,
      content: <ChipQuestion label={areaLabel} options={safeArea} value={area} onChange={(i) => select(setArea, i)} />,
    },
    {
      icon: Grid2x2,
      content: <ChipQuestion label={zonesLabel} options={safeZones} value={zones} onChange={(i) => select(setZones, i)} />,
    },
    {
      icon: ListChecks,
      content: <ChipQuestion label={needLabel} options={safeNeed} value={need} onChange={(i) => select(setNeed, i)} />,
    },
    {
      icon: Plug,
      content: (
        <ChipQuestion label={integrationLabel} options={safeIntegration} value={integration} onChange={(i) => select(setIntegration, i)} />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setFacility(null)
    setArea(null)
    setZones(null)
    setNeed(null)
    setIntegration(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const facilityText = safeFacility[facility as number]?.text
    const areaText = safeArea[area as number]?.text
    const zonesText = safeZones[zones as number]?.text
    const needText = safeNeed[need as number]?.text
    const integrationText = safeIntegration[integration as number]?.text

    const label = paSystemLabel(needText, integrationText, zonesText)

    let integrationNote = "We'll assess the best integration approach for your facility."
    const integrationLower = (integrationText || '').toLowerCase()
    if (integrationLower.includes('fire')) {
      integrationNote = "We'll ensure full integration with your fire and safety systems."
    } else if (integrationLower.includes('existing av')) {
      integrationNote = "We'll integrate with your existing AV setup."
    } else if (integrationLower.includes('network') || integrationLower.includes('ip')) {
      integrationNote = "We'll deploy this over your IP network for centralized control."
    }

    return { label, facilityText, areaText, zonesText, needText, integrationNote }
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
                <EstimatorResultPanel eyebrow="Recommended PA System" headline={result.label}>
                  For {article(result.facilityText)} {result.facilityText?.toLowerCase()} ({result.areaText?.toLowerCase()}) with{' '}
                  {result.zonesText?.toLowerCase()} zone(s) needing {result.needText?.toLowerCase()}, a{' '}
                  {result.label.toLowerCase()} is a strong fit. {result.integrationNote}
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
