'use client'

import type { Microsoft365MigrationEstimatorBlock as Microsoft365MigrationEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Users, Server, Target, Route } from 'lucide-react'

function suggestedPath(sourceText?: string | null): string {
  const source = (sourceText || '').toLowerCase()

  if (source.includes('on-premises')) return 'On-Premises to Microsoft 365 Migration'
  if (source.includes('google workspace')) return 'Google Workspace to Microsoft 365 Migration'
  if (source.includes('another microsoft 365 tenant')) return 'Microsoft 365 Tenant-to-Tenant Migration'
  return 'Microsoft 365 Migration Assessment'
}

type Props = {
  className?: string
} & Microsoft365MigrationEstimatorBlockProps

export const Microsoft365MigrationEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  businessSizeLabel,
  businessSizeOptions = [],
  sourceLabel,
  sourceOptions = [],
  priorityLabel,
  priorityOptions = [],
  approachLabel,
  approachOptions = [],
  disclaimer,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBusinessSize = businessSizeOptions || []
  const safeSource = sourceOptions || []
  const safePriority = priorityOptions || []
  const safeApproach = approachOptions || []

  const [businessSize, setBusinessSize] = useState<number | null>(null)
  const [source, setSource] = useState<number | null>(null)
  const [priority, setPriority] = useState<number | null>(null)
  const [approach, setApproach] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (
    safeBusinessSize.length === 0 ||
    safeSource.length === 0 ||
    safePriority.length === 0 ||
    safeApproach.length === 0
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
        <ChipQuestion label={sourceLabel} options={safeSource} value={source} onChange={(i) => select(setSource, i)} />
      ),
    },
    {
      icon: Target,
      content: (
        <ChipQuestion label={priorityLabel} options={safePriority} value={priority} onChange={(i) => select(setPriority, i)} />
      ),
    },
    {
      icon: Route,
      content: (
        <ChipQuestion label={approachLabel} options={safeApproach} value={approach} onChange={(i) => select(setApproach, i)} />
      ),
    },
  ]

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setBusinessSize(null)
    setSource(null)
    setPriority(null)
    setApproach(null)
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null

    const businessSizeText = safeBusinessSize[businessSize as number]?.text
    const sourceText = safeSource[source as number]?.text
    const priorityText = safePriority[priority as number]?.text

    const label = suggestedPath(sourceText)

    return { label, businessSizeText, sourceText, priorityText }
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
                <EstimatorResultPanel eyebrow="Suggested Migration Path" headline={result.label}>
                  For a team of {result.businessSizeText?.toLowerCase()}, migrating from &ldquo;
                  {result.sourceText?.toLowerCase()}&rdquo; with a focus on {result.priorityText?.toLowerCase()}, this is a
                  reasonable starting point — CODE3 confirms the exact scope after a short consultation.
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
