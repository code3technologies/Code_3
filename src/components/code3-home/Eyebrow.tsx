import React from 'react'
import { cn } from '@/utilities/ui'

export function Eyebrow({
  children,
  onDark = false,
  color = 'signal',
  className,
}: {
  children: React.ReactNode
  onDark?: boolean
  color?: 'signal' | 'coral'
  className?: string
}) {
  const dotColor = color === 'coral' ? 'bg-code3-coral' : 'bg-code3-signal'
  const textColor = onDark
    ? color === 'coral'
      ? 'text-code3-coral'
      : 'text-code3-signal'
    : 'text-code3-signal-dim'

  return (
    <div
      className={cn(
        'font-jetmono inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] mb-4',
        textColor,
        className,
      )}
    >
      <span className="inline-flex gap-1">
        <span className={cn('h-[5px] w-[5px] rounded-full', dotColor)} />
        <span className={cn('h-[5px] w-[5px] rounded-full', dotColor)} />
        <span className={cn('h-[5px] w-[5px] rounded-full', dotColor)} />
      </span>
      {children}
    </div>
  )
}
