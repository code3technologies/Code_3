import React from 'react'
import { cn } from '@/utilities/ui'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'font-sans inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary_red mb-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
