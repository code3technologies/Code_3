'use client'

import type { NetworkEstimatorBlock as NetworkEstimatorBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ChipQuestion } from '@/components/site/estimator/ChipQuestion'
import { EstimatorResultPanel } from '@/components/site/estimator/ResultPanel'
import {
  EstimatorCard,
  EstimatorFooter,
  StartOverButton,
  estimatorBodyClassName,
} from '@/components/site/estimator/Shell'
import { EstimatorWizardFrame, WizardBackLink } from '@/components/site/estimator/Wizard'
import { useScrollOnResult } from '@/components/site/estimator/useScrollOnResult'
import { Building2, Globe, Layers, Lock, MonitorSmartphone, Network, Server, ShieldCheck, Users, Wifi } from 'lucide-react'

const isYes = (t?: string | null) => (t || '').trim().toLowerCase() === 'yes'
const isMany = (t?: string | null) => {
  const s = (t || '').trim()
  return s.length > 0 && !/^1$/.test(s) && !/^0$/.test(s)
}

type Props = {
  className?: string
} & NetworkEstimatorBlockProps

export const NetworkEstimatorBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  usersLabel,
  usersOptions = [],
  officesLabel,
  officesOptions = [],
  floorsLabel,
  floorsOptions = [],
  devicesLabel,
  devicesOptions = [],
  internetLabel,
  internetOptions = [],
  wifiLabel,
  wifiOptions = [],
  existingLabel,
  existingOptions = [],
  serverLabel,
  serverOptions = [],
  vpnLabel,
  vpnOptions = [],
  securityLabel,
  securityOptions = [],
  disclaimer,
  ctaLabel,
  ctaUrl,
}) => {
  const q = [
    { label: usersLabel, options: usersOptions || [], icon: Users },
    { label: officesLabel, options: officesOptions || [], icon: Building2 },
    { label: floorsLabel, options: floorsOptions || [], icon: Layers },
    { label: devicesLabel, options: devicesOptions || [], icon: MonitorSmartphone },
    { label: internetLabel, options: internetOptions || [], icon: Globe },
    { label: wifiLabel, options: wifiOptions || [], icon: Wifi },
    { label: existingLabel, options: existingOptions || [], icon: Network },
    { label: serverLabel, options: serverOptions || [], icon: Server },
    { label: vpnLabel, options: vpnOptions || [], icon: Lock },
    { label: securityLabel, options: securityOptions || [], icon: ShieldCheck },
  ]

  const [answers, setAnswers] = useState<(number | null)[]>(Array(q.length).fill(null))
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useScrollOnResult<HTMLElement>(submitted)

  if (q.some((item) => item.options.length === 0)) return null

  const totalSteps = q.length
  const isLast = step === totalSteps - 1

  const select = (i: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = i
      return next
    })
    if (isLast) setSubmitted(true)
    else setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleStartOver = () => {
    setAnswers(Array(q.length).fill(null))
    setStep(0)
    setSubmitted(false)
  }

  const text = (idx: number) => {
    const a = answers[idx]
    return a === null ? undefined : q[idx].options[a]?.text
  }

  const result = (() => {
    if (!submitted) return null

    const users = text(0)
    const offices = text(1)
    const internet = text(4)
    const wifi = text(5)
    const existing = text(6)
    const server = text(7)
    const vpn = text(8)
    const security = (text(9) || '').toLowerCase()

    const multiSite = isMany(offices)
    const sdwan = /sd-?wan|3\+/.test((internet || '').toLowerCase())

    let label: string
    if (multiSite) label = sdwan ? 'SD-WAN Multi-Site Network' : 'Multi-Site WAN Network'
    else if (isYes(existing)) label = 'Network Upgrade & Optimisation'
    else label = 'Single-Site LAN Network'

    const includes: string[] = []
    includes.push(multiSite ? 'switching and routing at every site' : 'core and edge switching')
    if (isYes(wifi)) includes.push('enterprise Wi-Fi')
    if (isMany(internet)) includes.push('a resilient internet edge with failover')
    if (isYes(vpn)) includes.push('site-to-site and remote-access VPN')
    if (isYes(server)) includes.push('core switching sized for your server room')
    includes.push(
      security.includes('regulated') || security.includes('high')
        ? 'next-generation firewalls with strict segmentation'
        : 'firewall and VLAN segmentation',
    )

    const existingNote = isYes(existing)
      ? 'We would start by assessing what you already have and keeping whatever still fits.'
      : 'As a new build, everything is sized with room to grow.'

    return { label, users, offices, includes, existingNote }
  })()

  return (
    <section ref={sectionRef} className={cn('bg-white py-7 md:py-9 scroll-mt-32', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mb-4 max-w-2xl">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-3 leading-relaxed text-gray-600">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100}>
          <EstimatorCard>
            {result ? (
              <div className={estimatorBodyClassName}>
                <EstimatorResultPanel eyebrow="Recommended Network" headline={result.label}>
                  For around {result.users?.toLowerCase()} users across {result.offices?.toLowerCase()}{' '}
                  {isMany(result.offices) ? 'locations' : 'location'}, we would design a{' '}
                  {result.label.toLowerCase()}.
                  <ul className="mx-auto mt-4 inline-block space-y-1.5 text-left">
                    {result.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/70" />
                        <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 block">{result.existingNote}</span>
                </EstimatorResultPanel>
                <StartOverButton onClick={handleStartOver} />
              </div>
            ) : (
              <EstimatorWizardFrame icon={q[step].icon} current={step} total={totalSteps}>
                <div key={step}>
                  <ChipQuestion
                    label={q[step].label}
                    options={q[step].options}
                    value={answers[step]}
                    onChange={select}
                  />
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
