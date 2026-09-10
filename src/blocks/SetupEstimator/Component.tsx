'use client'

import type { SetupEstimatorBlock as SetupEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import { EstimatorCard, EstimatorFooter, StartOverButton, estimatorBodyClassName } from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink, WizardNav } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import {
  Briefcase,
  Building2,
  Camera,
  Check,
  CheckSquare2,
  CircleDot,
  Cloud,
  KeyRound,
  Mail,
  Monitor,
  Network,
  Presentation,
  Settings2,
  ShieldCheck,
  Square,
  Users,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per question, matched by keyword.
function getQuestionIcon(label?: string | null): LucideIcon {
  const l = (label || '').toLowerCase()
  if (l.includes('employee') || l.includes('staff') || l.includes('team')) return Users
  if (l.includes('floor')) return Building2
  if (l.includes('type')) return Briefcase
  if (l.includes('setup') || l.includes('need')) return Settings2
  return CircleDot
}

// Best-effort icon per checklist item, matched by keyword.
function getItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('wi-fi') || t.includes('wifi')) return Wifi
  if (t.includes('network')) return Network
  if (t.includes('computer')) return Monitor
  if (t.includes('server room')) return Building2
  if (t.includes('server') || t.includes('cloud')) return Cloud
  if (t.includes('cctv') || t.includes('camera')) return Camera
  if (t.includes('access control') || t.includes('restricted')) return KeyRound
  if (t.includes('warehouse')) return Building2
  if (t.includes('meeting')) return Presentation
  if (t.includes('365') || t.includes('microsoft')) return Mail
  if (t.includes('security') || t.includes('cyber')) return ShieldCheck
  return CheckSquare2
}

type Props = {
  className?: string
} & SetupEstimatorBlockProps

export const SetupEstimatorBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  questions = [],
  submitLabel,
  sizeTiers = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeQuestions = questions || []
  const safeTiers = sizeTiers || []

  // single questions: answers[qIndex] = selected option index
  // multi questions: answers[qIndex] = array of selected option indices
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({})
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (safeQuestions.length === 0 || safeTiers.length === 0) return null

  const isAnswered = (qIndex: number, type?: string | null) => {
    const val = answers[qIndex]
    if (type === 'multi') return Array.isArray(val) && val.length > 0
    return typeof val === 'number'
  }

  const isLast = step === safeQuestions.length - 1
  const advance = () => {
    if (isLast) setSubmitted(true)
    else setStep((s) => s + 1)
  }

  const selectSingle = (qIndex: number, oIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))
    advance()
  }
  const toggleMulti = (qIndex: number, oIndex: number) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qIndex]) ? (prev[qIndex] as number[]) : []
      const next = current.includes(oIndex) ? current.filter((v) => v !== oIndex) : [...current, oIndex]
      return { ...prev, [qIndex]: next }
    })
  }

  const question = safeQuestions[step]
  const isMulti = question.selectionType === 'multi'
  const QuestionIcon = getQuestionIcon(question.label)

  const handleMultiNext = () => {
    if (!isAnswered(step, question.selectionType)) return
    advance()
  }
  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setAnswers({})
    setStep(0)
    setSubmitted(false)
  }

  const result = (() => {
    if (!submitted) return null
    const score = safeQuestions.reduce((sum, q, i) => {
      if (q.selectionType !== 'single') return sum
      const v = answers[i]
      return sum + (typeof v === 'number' ? v : 0)
    }, 0)
    const tier = safeTiers.find((t) => score >= t.minScore && score <= t.maxScore) || safeTiers[safeTiers.length - 1]

    const selectedItems = safeQuestions.flatMap((q, i) => {
      if (q.selectionType !== 'multi') return []
      const picked = Array.isArray(answers[i]) ? (answers[i] as number[]) : []
      return picked.map((oIndex) => q.options?.[oIndex]?.text).filter(Boolean) as string[]
    })

    return { tier, selectedItems }
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
                <EstimatorResultPanel eyebrow="Recommended Scope" headline={result.tier.tierName}>
                  <p>{result.tier.description}</p>
                  {result.selectedItems.length > 0 && (
                    <div className="mt-4 border-t border-black/5 pt-4 text-left">
                      <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Your setup will include
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {result.selectedItems.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-black/10"
                          >
                            <Check className="h-3 w-3 flex-none text-primary_red" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </EstimatorResultPanel>
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame icon={QuestionIcon} current={step} total={safeQuestions.length}>
                <div key={step} className="animate-step-in">
                  <label className="mb-6 block text-xl font-semibold text-foreground md:text-2xl">
                    {question.label}
                    {isMulti && <span className="ml-1.5 text-base font-normal text-gray-400">(select all that apply)</span>}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(question.options || []).map((option, oIndex) => {
                      const isSelected = isMulti
                        ? Array.isArray(answers[step]) && (answers[step] as number[]).includes(oIndex)
                        : answers[step] === oIndex
                      const ItemIcon = isMulti ? getItemIcon(option.text) : null
                      return (
                        <button
                          key={option.id || oIndex}
                          type="button"
                          onClick={() => (isMulti ? toggleMulti(step, oIndex) : selectSingle(step, oIndex))}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-5 py-3 text-base font-medium transition-all duration-150 active:scale-95',
                            isSelected
                              ? 'border-primary_red bg-primary_red text-white shadow-sm shadow-primary_red/20'
                              : 'border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-primary_red/50 hover:bg-[#FDEBEC] hover:text-primary_red hover:shadow-sm',
                          )}
                        >
                          {isMulti ? (
                            isSelected ? (
                              <CheckSquare2 className="h-4 w-4 flex-none" />
                            ) : (
                              <Square className="h-4 w-4 flex-none" />
                            )
                          ) : (
                            isSelected && <Check className="h-4 w-4 flex-none" />
                          )}
                          {ItemIcon && !isSelected && <ItemIcon className="h-4 w-4 flex-none text-primary_red/70" />}
                          {option.text}
                        </button>
                      )
                    })}
                  </div>

                  {isMulti ? (
                    <WizardNav
                      showBack={step > 0}
                      onBack={handleBack}
                      onNext={handleMultiNext}
                      nextLabel={isLast ? submitLabel || 'Submit' : 'Next'}
                      nextDisabled={!isAnswered(step, question.selectionType)}
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
