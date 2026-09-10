'use client'

import type { BGMEstimatorBlock as BGMEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Grid2x2, MapPin, Maximize2, SlidersHorizontal, Volume2 } from 'lucide-react'

// Best-effort recommended system type, matched the same way as the page's own
// "Types of Background Music Systems" categories: multiple locations takes
// priority (the most advanced tier), then zone count drives the underlying
// architecture, defaulting to a single-zone setup.
function bgmLabel(zonesText?: string | null, multiLocationText?: string | null): string {
  const zones = (zonesText || '').toLowerCase()
  const multiLocation = (multiLocationText || '').toLowerCase()

  if (multiLocation.includes('yes')) return 'Multi-Location Audio'
  if (zones.includes('7+')) return 'Network/IP-Based Audio'
  if (zones.includes('2') || zones.includes('4')) return 'Multi-Zone Audio'
  return 'Single-Zone Audio'
}

function speakerNote(speakerText?: string | null): string {
  const s = (speakerText || '').toLowerCase()
  if (s.includes('indoor') && s.includes('outdoor')) {
    return "We'll assess the right speaker approach for combined indoor and outdoor coverage."
  }
  if (s.includes('ceiling')) return "We'll design around discreet, ceiling-mounted speakers."
  if (s.includes('wall')) return "We'll design around wall-mounted speakers."
  return "We'll help determine the best speaker placement for your space."
}

function volumeNote(volumeText?: string | null): string {
  // Exact match, not .includes() - "Not Sure" contains the substring "no" and
  // would otherwise be misread as a "No" answer.
  const v = (volumeText || '').trim().toLowerCase()
  if (v === 'yes') return 'Each area will have independent volume control.'
  if (v === 'no') return 'A single centralized control will keep things simple.'
  return "We'll help determine whether independent zone control makes sense for your setup."
}

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & BGMEstimatorBlockProps

export const BGMEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  spaceLabel,
  spaceOptions = [],
  areaLabel,
  areaOptions = [],
  zonesLabel,
  zonesOptions = [],
  speakerLabel,
  speakerOptions = [],
  volumeLabel,
  volumeOptions = [],
  multiLocationLabel,
  multiLocationOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeSpace = spaceOptions || []
  const safeArea = areaOptions || []
  const safeZones = zonesOptions || []
  const safeSpeaker = speakerOptions || []
  const safeVolume = volumeOptions || []
  const safeMultiLocation = multiLocationOptions || []

  const [space, setSpace] = useState<number | null>(null)
  const [area, setArea] = useState<number | null>(null)
  const [zones, setZones] = useState<number | null>(null)
  const [speaker, setSpeaker] = useState<number | null>(null)
  const [volume, setVolume] = useState<number | null>(null)
  const [multiLocation, setMultiLocation] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeSpace.length === 0 ||
    safeArea.length === 0 ||
    safeZones.length === 0 ||
    safeSpeaker.length === 0 ||
    safeVolume.length === 0 ||
    safeMultiLocation.length === 0
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
    { icon: Building2, content: <ChipQuestion label={spaceLabel} options={safeSpace} value={space} onChange={(i) => select(setSpace, i)} /> },
    { icon: Maximize2, content: <ChipQuestion label={areaLabel} options={safeArea} value={area} onChange={(i) => select(setArea, i)} /> },
    { icon: Grid2x2, content: <ChipQuestion label={zonesLabel} options={safeZones} value={zones} onChange={(i) => select(setZones, i)} /> },
    {
      icon: Volume2,
      content: <ChipQuestion label={speakerLabel} options={safeSpeaker} value={speaker} onChange={(i) => select(setSpeaker, i)} />,
    },
    {
      icon: SlidersHorizontal,
      content: <ChipQuestion label={volumeLabel} options={safeVolume} value={volume} onChange={(i) => select(setVolume, i)} />,
    },
    {
      icon: MapPin,
      content: (
        <ChipQuestion
          label={multiLocationLabel}
          options={safeMultiLocation}
          value={multiLocation}
          onChange={(i) => select(setMultiLocation, i)}
        />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setSpace(null)
    setArea(null)
    setZones(null)
    setSpeaker(null)
    setVolume(null)
    setMultiLocation(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const spaceText = safeSpace[space as number]?.text
    const areaText = safeArea[area as number]?.text
    const zonesText = safeZones[zones as number]?.text
    const speakerText = safeSpeaker[speaker as number]?.text
    const volumeText = safeVolume[volume as number]?.text
    const multiLocationText = safeMultiLocation[multiLocation as number]?.text

    const label = bgmLabel(zonesText, multiLocationText)

    return {
      label,
      spaceText,
      areaText,
      zonesText,
      speakerNote: speakerNote(speakerText),
      volumeNote: volumeNote(volumeText),
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
                <EstimatorResultPanel eyebrow="Recommended Audio System" headline={result.label}>
                  For {article(result.spaceText)} {result.spaceText?.toLowerCase()} ({result.areaText?.toLowerCase()}) with{' '}
                  {result.zonesText?.toLowerCase()} zone(s), we recommend {result.label}. {result.speakerNote} {result.volumeNote}
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
