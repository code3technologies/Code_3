'use client'

import type { Microsoft365EstimatorBlock as Microsoft365EstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Users, Server, Target, Globe } from 'lucide-react'

function suggestedPath(currentSetupText?: string | null): string {
  const current = (currentSetupText || '').toLowerCase()

  if (current.includes('no microsoft 365 yet')) return 'Microsoft 365 Setup & Deployment'
  if (current.includes('migrating from another')) return 'Microsoft 365 Migration'
  if (current.includes('needs security or admin')) return 'Microsoft 365 Security & Administration'
  if (current.includes('not fully configured')) return 'Microsoft 365 Optimization & Configuration Review'
  return 'Microsoft 365 Assessment'
}

type Props = {
  className?: string
} & Microsoft365EstimatorBlockProps

export const Microsoft365EstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  businessSizeLabel,
  businessSizeOptions = [],
  currentSetupLabel,
  currentSetupOptions = [],
  priorityLabel,
  priorityOptions = [],
  workStyleLabel,
  workStyleOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBusinessSize = businessSizeOptions || []
  const safeCurrentSetup = currentSetupOptions || []
  const safePriority = priorityOptions || []
  const safeWorkStyle = workStyleOptions || []

  const [businessSize, setBusinessSize] = useState<number | null>(null)
  const [currentSetup, setCurrentSetup] = useState<number | null>(null)
  const [priority, setPriority] = useState<number | null>(null)
  const [workStyle, setWorkStyle] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeBusinessSize.length === 0 ||
    safeCurrentSetup.length === 0 ||
    safePriority.length === 0 ||
    safeWorkStyle.length === 0
  ) {
    return null
  }

  const totalSteps = 4
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
      icon: Users,
      content: (
        <ChipQuestion
          label={businessSizeLabel}
          options={safeBusinessSize}
          value={businessSize}
          onChange={(i) => select(setBusinessSize, i)}
        />
      ),
    },
    {
      icon: Server,
      content: (
        <ChipQuestion
          label={currentSetupLabel}
          options={safeCurrentSetup}
          value={currentSetup}
          onChange={(i) => select(setCurrentSetup, i)}
        />
      ),
    },
    {
      icon: Target,
      content: (
        <ChipQuestion label={priorityLabel} options={safePriority} value={priority} onChange={(i) => select(setPriority, i)} />
      ),
    },
    {
      icon: Globe,
      content: (
        <ChipQuestion
          label={workStyleLabel}
          options={safeWorkStyle}
          value={workStyle}
          onChange={(i) => select(setWorkStyle, i)}
        />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setBusinessSize(null)
    setCurrentSetup(null)
    setPriority(null)
    setWorkStyle(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const businessSizeText = safeBusinessSize[businessSize as number]?.text
    const currentSetupText = safeCurrentSetup[currentSetup as number]?.text
    const priorityText = safePriority[priority as number]?.text

    const label = suggestedPath(currentSetupText)

    return { label, businessSizeText, currentSetupText, priorityText }
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
                <EstimatorResultPanel eyebrow="Suggested Starting Point" headline={result.label}>
                  For a team of {result.businessSizeText?.toLowerCase()}, currently &ldquo;
                  {result.currentSetupText?.toLowerCase()}&rdquo; with a focus on {result.priorityText?.toLowerCase()}, this is
                  a reasonable starting point — CODE3 confirms the exact scope after a short consultation.
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
