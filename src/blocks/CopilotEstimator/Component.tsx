'use client'

import type { CopilotEstimatorBlock as CopilotEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Users, Server, Target, Rocket } from 'lucide-react'

function suggestedPath(environmentText?: string | null): string {
  const env = (environmentText || '').toLowerCase()

  if (env.includes('not on microsoft 365 yet')) return 'Microsoft 365 Foundation First, Then Copilot Setup'
  if (env.includes('hybrid') || env.includes('on-premises')) return 'Copilot Readiness Assessment for Hybrid Environments'
  if (env.includes('not sure about licensing')) return 'Copilot Licensing & Readiness Review'
  if (env.includes('eligible microsoft 365 plan')) return 'Copilot Pilot Deployment'
  return 'Copilot Readiness Assessment'
}

type Props = {
  className?: string
} & CopilotEstimatorBlockProps

export const CopilotEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  businessSizeLabel,
  businessSizeOptions = [],
  environmentLabel,
  environmentOptions = [],
  priorityLabel,
  priorityOptions = [],
  rolloutLabel,
  rolloutOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBusinessSize = businessSizeOptions || []
  const safeEnvironment = environmentOptions || []
  const safePriority = priorityOptions || []
  const safeRollout = rolloutOptions || []

  const [businessSize, setBusinessSize] = useState<number | null>(null)
  const [environment, setEnvironment] = useState<number | null>(null)
  const [priority, setPriority] = useState<number | null>(null)
  const [rollout, setRollout] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeBusinessSize.length === 0 ||
    safeEnvironment.length === 0 ||
    safePriority.length === 0 ||
    safeRollout.length === 0
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
          label={environmentLabel}
          options={safeEnvironment}
          value={environment}
          onChange={(i) => select(setEnvironment, i)}
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
      icon: Rocket,
      content: (
        <ChipQuestion label={rolloutLabel} options={safeRollout} value={rollout} onChange={(i) => select(setRollout, i)} />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setBusinessSize(null)
    setEnvironment(null)
    setPriority(null)
    setRollout(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const businessSizeText = safeBusinessSize[businessSize as number]?.text
    const environmentText = safeEnvironment[environment as number]?.text
    const priorityText = safePriority[priority as number]?.text

    const label = suggestedPath(environmentText)

    return { label, businessSizeText, environmentText, priorityText }
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
                  {result.environmentText?.toLowerCase()}&rdquo; with a focus on {result.priorityText?.toLowerCase()}, this is
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
