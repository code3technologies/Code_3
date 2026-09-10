import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export function EstimatorResultPanel({
  eyebrow,
  headline,
  children,
}: {
  eyebrow?: ReactNode
  headline?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="animate-result-pop rounded-2xl bg-primary_red p-8 text-center sm:p-12">
      <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white/40">
        <Check className="h-5 w-5 text-white" strokeWidth={3} />
      </span>
      {eyebrow && <div className="text-sm font-bold uppercase tracking-wider text-white/70">{eyebrow}</div>}
      {headline && <div className="mt-2 text-3xl font-bold text-white md:text-4xl">{headline}</div>}
      {children && <div className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85">{children}</div>}
    </div>
  )
}
