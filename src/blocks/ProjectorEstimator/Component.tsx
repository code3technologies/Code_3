'use client'

import type { ProjectorEstimatorBlock as ProjectorEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { MapPin, Maximize2, Projector, Sun, Tv, Users } from 'lucide-react'

// Best-effort recommended projector type, matched the same way as the
// page's own "Projector Solutions for Every Space" types: an explicit
// short-throw preference is honored first, then large spaces/crowds,
// then high ambient light, defaulting to a general business projector.
function projectorLabel(
  spaceText?: string | null,
  roomSizeText?: string | null,
  peopleText?: string | null,
  lightText?: string | null,
  projectionText?: string | null,
): string {
  const space = (spaceText || '').toLowerCase()
  const roomSize = (roomSizeText || '').toLowerCase()
  const people = (peopleText || '').toLowerCase()
  const light = (lightText || '').toLowerCase()
  const projection = (projectionText || '').toLowerCase()

  if (projection.includes('short throw')) return 'Short-Throw Projector'
  if (roomSize.includes('large') || people.includes('50+') || space.includes('auditorium') || space.includes('event space')) {
    return 'Large Venue Projector'
  }
  if (light.includes('high')) return 'High-Brightness Projector'
  return 'Business Projector'
}

// Picks "a" or "an" based on the leading sound of the given text.
function article(text?: string | null): string {
  return /^[aeiou]/i.test((text || '').trim()) ? 'an' : 'a'
}

type Props = {
  className?: string
} & ProjectorEstimatorBlockProps

export const ProjectorEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  spaceLabel,
  spaceOptions = [],
  roomSizeLabel,
  roomSizeOptions = [],
  peopleLabel,
  peopleOptions = [],
  lightLabel,
  lightOptions = [],
  projectionLabel,
  projectionOptions = [],
  screenLabel,
  screenOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeSpace = spaceOptions || []
  const safeRoomSize = roomSizeOptions || []
  const safePeople = peopleOptions || []
  const safeLight = lightOptions || []
  const safeProjection = projectionOptions || []
  const safeScreen = screenOptions || []

  const [space, setSpace] = useState<number | null>(null)
  const [roomSize, setRoomSize] = useState<number | null>(null)
  const [people, setPeople] = useState<number | null>(null)
  const [light, setLight] = useState<number | null>(null)
  const [projection, setProjection] = useState<number | null>(null)
  const [screen, setScreen] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeSpace.length === 0 ||
    safeRoomSize.length === 0 ||
    safePeople.length === 0 ||
    safeLight.length === 0 ||
    safeProjection.length === 0 ||
    safeScreen.length === 0
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
    { icon: MapPin, content: <ChipQuestion label={spaceLabel} options={safeSpace} value={space} onChange={(i) => select(setSpace, i)} /> },
    {
      icon: Maximize2,
      content: <ChipQuestion label={roomSizeLabel} options={safeRoomSize} value={roomSize} onChange={(i) => select(setRoomSize, i)} />,
    },
    {
      icon: Users,
      content: <ChipQuestion label={peopleLabel} options={safePeople} value={people} onChange={(i) => select(setPeople, i)} />,
    },
    { icon: Sun, content: <ChipQuestion label={lightLabel} options={safeLight} value={light} onChange={(i) => select(setLight, i)} /> },
    {
      icon: Projector,
      content: (
        <ChipQuestion label={projectionLabel} options={safeProjection} value={projection} onChange={(i) => select(setProjection, i)} />
      ),
    },
    { icon: Tv, content: <ChipQuestion label={screenLabel} options={safeScreen} value={screen} onChange={(i) => select(setScreen, i)} /> },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setSpace(null)
    setRoomSize(null)
    setPeople(null)
    setLight(null)
    setProjection(null)
    setScreen(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const spaceText = safeSpace[space as number]?.text
    const roomSizeText = safeRoomSize[roomSize as number]?.text
    const peopleText = safePeople[people as number]?.text
    const lightText = safeLight[light as number]?.text
    const projectionText = safeProjection[projection as number]?.text
    const screenText = safeScreen[screen as number]?.text

    const label = projectorLabel(spaceText, roomSizeText, peopleText, lightText, projectionText)
    const needsScreen = (screenText || '').toLowerCase().includes('need recommendation')

    return { label, spaceText, peopleText, lightText, needsScreen }
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
                <EstimatorResultPanel eyebrow="Recommended Projector" headline={result.label}>
                  For {article(result.spaceText)} {result.spaceText?.toLowerCase()} with {result.peopleText?.toLowerCase()}{' '}
                  people and {result.lightText?.toLowerCase()} ambient light, a {result.label.toLowerCase()} is a strong fit.{' '}
                  {result.needsScreen
                    ? "We'll also recommend the right screen size for your room."
                    : "We'll match the projector to your existing screen setup."}
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
