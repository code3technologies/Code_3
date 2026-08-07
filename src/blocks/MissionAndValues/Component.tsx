import type { MissionAndValuesBlock as MissionAndValuesBlockProps, Media as MediaType } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'

type Props = {
  className?: string
} & MissionAndValuesBlockProps

type CardData = { icon?: string | MediaType | null; title?: string | null; content?: string | null } | undefined | null

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 flex-none">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 flex-none">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22V3" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 flex-none">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

const toneStyles = {
  positive: { card: 'border-green-200 bg-green-50/60', badge: 'bg-green-500', Icon: CheckIcon },
  negative: { card: 'border-red-200 bg-[#FDEBEC]', badge: 'bg-primary_red', Icon: FlagIcon },
} as const

function ToneCard({
  card,
  tone,
  icon: IconOverride,
}: {
  card: CardData
  tone: 'positive' | 'negative'
  icon?: React.FC
}) {
  if (!card) return null
  const styles = toneStyles[tone]
  const Icon = IconOverride || styles.Icon
  return (
    <div className={cn('rounded-2xl border-2 p-6 md:p-7', styles.card)}>
      <div className="mb-4 flex items-center gap-3">
        <span className={cn('flex h-10 w-10 flex-none items-center justify-center rounded-full text-white', styles.badge)}>
          <Icon />
        </span>
        <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
      </div>
      {card.content && <p className="text-sm leading-relaxed text-gray-700">{card.content}</p>}
    </div>
  )
}

type ValueData = NonNullable<MissionAndValuesBlockProps['values']>[number]

function ValueCard({ value }: { value: ValueData }) {
  const items = (value.itemsText || '').split('\n').map((line) => line.trim()).filter(Boolean)
  return (
    <div className="flex flex-col rounded-2xl border border-white/15 bg-foreground p-6 text-center">
      <span className="mx-auto mb-3 flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 border-white/40">
        <ServiceIcon preset={value.iconPreset || 'check'} className="h-5 w-5 text-white" />
      </span>
      <h3 className="text-base font-semibold text-white">{value.title}</h3>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2 text-left">
          {items.map((text, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-snug text-white/80">
              <CheckIcon />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const MissionAndValuesBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  missionCard,
  visionCard,
  valuesBadge,
  valuesTitle,
  values,
}) => {
  return (
    <>
      <section className={cn('bg-white py-8 md:py-10', className)}>
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            {badge && <Eyebrow>{badge}</Eyebrow>}
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            {subtitle && <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>}
          </Reveal>

          <Reveal delayMs={100} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ToneCard card={missionCard} tone="negative" icon={TargetIcon} />
            <ToneCard card={visionCard} tone="negative" />
          </Reveal>
        </div>
      </section>

      {values && values.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {(valuesBadge || valuesTitle) && (
              <Reveal className="mb-8 max-w-2xl">
                {valuesBadge && (
                  <span className="text-base font-semibold uppercase tracking-wider text-primary_red md:text-lg">
                    {valuesBadge}
                  </span>
                )}
                {valuesTitle && (
                  <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-foreground">{valuesTitle}</h3>
                )}
              </Reveal>
            )}
            <Reveal delayMs={100} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <ValueCard key={value.id || index} value={value} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}
