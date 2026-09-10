'use client'

import type { DowntimeEstimatorBlock as DowntimeEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { NumberField } from '@/components/site/estimator/NumberField'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink, WizardNav } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Camera, Flag, Laptop, MapPin, Presentation, Server } from 'lucide-react'

// Buckets a raw count into a 0-3 complexity contribution. Kept in code (not
// CMS-configurable) since it's a formula, not content — only the resulting
// tier ranges/labels are admin-editable.
function bucket(value: number, steps: number[]): number {
  for (let i = 0; i < steps.length; i++) {
    if (value <= steps[i]) return i
  }
  return steps.length
}

export const DowntimeEstimatorBlock: React.FC<
  {
    className?: string
  } & DowntimeEstimatorBlockProps
> = ({
  className,
  badge,
  title,
  subtitle,
  workstationsLabel,
  serversLabel,
  floorsLabel,
  floorsOptions = [],
  cctvLabel,
  meetingRoomsLabel,
  currentLocationLabel,
  currentLocationOptions = [],
  newLocationLabel,
  newLocationOptions = [],
  submitLabel,
  complexityTiers = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const [workstations, setWorkstations] = useState<number | ''>('')
  const [servers, setServers] = useState<number | ''>('')
  const [floors, setFloors] = useState<number | null>(null)
  const [cctv, setCctv] = useState<number | ''>('')
  const [meetingRooms, setMeetingRooms] = useState<number | ''>('')
  const [currentLocation, setCurrentLocation] = useState<number | null>(null)
  const [newLocation, setNewLocation] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  const safeFloors = floorsOptions || []
  const safeCurrent = currentLocationOptions || []
  const safeNew = newLocationOptions || []
  const safeTiers = complexityTiers || []
  if (safeTiers.length === 0) return null

  const totalSteps = 7
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
      kind: 'number' as const,
      icon: Laptop,
      answered: workstations !== '',
      content: <NumberField label={workstationsLabel} placeholder="e.g. 20" value={workstations} onChange={setWorkstations} />,
    },
    {
      kind: 'number' as const,
      icon: Server,
      answered: servers !== '',
      content: <NumberField label={serversLabel} placeholder="e.g. 2" value={servers} onChange={setServers} />,
    },
    {
      kind: 'chip' as const,
      icon: Building2,
      content: <ChipQuestion label={floorsLabel} options={safeFloors} value={floors} onChange={(i) => select(setFloors, i)} />,
    },
    {
      kind: 'number' as const,
      icon: Camera,
      answered: cctv !== '',
      content: <NumberField label={cctvLabel} placeholder="e.g. 4" value={cctv} onChange={setCctv} />,
    },
    {
      kind: 'number' as const,
      icon: Presentation,
      answered: meetingRooms !== '',
      content: <NumberField label={meetingRoomsLabel} placeholder="e.g. 2" value={meetingRooms} onChange={setMeetingRooms} />,
    },
    {
      kind: 'chip' as const,
      icon: MapPin,
      content: (
        <ChipQuestion
          label={currentLocationLabel}
          options={safeCurrent}
          value={currentLocation}
          onChange={(i) => select(setCurrentLocation, i)}
        />
      ),
    },
    {
      kind: 'chip' as const,
      icon: Flag,
      content: (
        <ChipQuestion label={newLocationLabel} options={safeNew} value={newLocation} onChange={(i) => select(setNewLocation, i)} />
      ),
    },
  ]
  const current = steps[step]

  const handleNumberNext = () => {
    if (current.kind === 'number' && !current.answered) return
    advance()
  }
  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setWorkstations('')
    setServers('')
    setFloors(null)
    setCctv('')
    setMeetingRooms('')
    setCurrentLocation(null)
    setNewLocation(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null
    const score =
      bucket(Number(workstations), [10, 25, 50]) +
      bucket(Number(servers), [1, 3]) +
      (floors ?? 0) +
      bucket(Number(cctv), [0, 5]) +
      bucket(Number(meetingRooms), [0, 3]) +
      (currentLocation !== null && newLocation !== null && currentLocation !== newLocation ? 2 : 0)

    return safeTiers.find((t) => score >= t.minScore && score <= t.maxScore) || safeTiers[safeTiers.length - 1]
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
                <EstimatorResultPanel eyebrow="Estimated Move Complexity" headline={result.label} />
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame icon={current.icon} current={step} total={totalSteps}>
                <div key={step} className="animate-step-in">
                  {current.content}
                  {current.kind === 'number' ? (
                    <WizardNav
                      showBack={step > 0}
                      onBack={handleBack}
                      onNext={handleNumberNext}
                      nextLabel={isLast ? submitLabel || 'Submit' : 'Next'}
                      nextDisabled={!current.answered}
                    />
                  ) : (
                    <WizardBackLink show={step > 0} onBack={handleBack} />
                  )}
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
