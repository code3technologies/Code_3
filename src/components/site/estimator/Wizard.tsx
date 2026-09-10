import { cn } from '@/utilities/ui'
import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// The sidebar reuses the exact gradient from the site's own "IT Infra
// Services" mega-menu rail, so the wizard frame is filled with a pattern
// already established elsewhere on the site rather than an invented one.
const SIDEBAR_GRADIENT = 'linear-gradient(160deg, #b3121f 0%, #d7213c 45%, #6e0d17 100%)'

export function EstimatorWizardFrame({
  icon: Icon,
  current,
  total,
  children,
}: {
  icon: LucideIcon
  current: number
  total: number
  children: ReactNode
}) {
  const pct = ((current + 1) / total) * 100
  return (
    <div className="flex flex-col sm:flex-row">
      {/* Mobile: a plain top progress bar instead of the sidebar. */}
      <div className="border-b border-gray-100 p-6 sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>
            Step {current + 1} of {total}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary_red transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Desktop: the branded sidebar. */}
      <div
        className="hidden w-64 flex-none flex-col justify-between p-8 text-white sm:flex md:w-72"
        style={{ background: SIDEBAR_GRADIENT }}
      >
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
            <Icon className="h-7 w-7" />
          </span>
          <div className="mt-6 text-sm font-semibold uppercase tracking-wider text-white/70">
            Step {current + 1} of {total}
          </div>
          <div className="mt-1 text-2xl font-bold">{Math.round(pct)}%</div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  )
}

export function WizardBackLink({ show, onBack }: { show: boolean; onBack: () => void }) {
  if (!show) return null
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-3 text-base font-semibold text-gray-500 transition-all active:scale-95 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  )
}

export function WizardNav({
  showBack,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  showBack: boolean
  onBack: () => void
  onNext: () => void
  nextLabel: string
  nextDisabled: boolean
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex flex-none items-center gap-1.5 rounded-full px-2 py-3 text-base font-semibold text-gray-500 transition-all active:scale-95 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          'group inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-full bg-primary_red px-7 py-3 text-base font-semibold text-white transition-all active:scale-95 hover:bg-secondary_red',
          nextDisabled && 'cursor-not-allowed opacity-40 hover:bg-primary_red active:scale-100',
        )}
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
