'use client'

import type { CurrentOpeningsBlock as CurrentOpeningsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React, { useMemo, useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & CurrentOpeningsBlockProps

export const CurrentOpeningsBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  showFilter = true,
  departments = [],
  jobListings = [],
}) => {
  const [activeDept, setActiveDept] = useState('all')

  const filteredJobs = useMemo(() => {
    if (activeDept === 'all') return jobListings || []
    return (jobListings || []).filter((job) => job.department === activeDept)
  }, [jobListings, activeDept])

  return (
    <section id="current-openings" className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-10">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {showFilter && departments && departments.length > 0 && (
          <Reveal delayMs={80} className="flex flex-wrap gap-2.5 mb-10">
            <button
              onClick={() => setActiveDept('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200',
                activeDept === 'all'
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-gray-600 border-border hover:border-gray-400',
              )}
            >
              All
            </button>
            {departments.map((dept, index) => (
              <button
                key={dept.id || index}
                onClick={() => setActiveDept(dept.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200',
                  activeDept === dept.value
                    ? 'bg-foreground text-white border-foreground'
                    : 'bg-white text-gray-600 border-border hover:border-gray-400',
                )}
              >
                {dept.label}
              </button>
            ))}
          </Reveal>
        )}

        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 && (
            <p className="text-sm text-gray-500">No open roles in this department right now.</p>
          )}
          {filteredJobs.map((job, index) => {
            const href = job.viewJobLink || `mailto:info@code3.ae?subject=${encodeURIComponent(`Application: ${job.title}`)}`
            return (
              <Reveal key={job.id || index} delayMs={Math.min(index, 5) * 60}>
                <div className="rounded-2xl border border-border p-6 transition-colors hover:border-gray-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <span className="font-medium text-xs uppercase tracking-wide text-primary_red">
                        {job.department}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#F5F5F6] text-gray-600">
                          {job.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{job.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <a
                      href={href}
                      className="inline-flex flex-none items-center gap-1.5 self-start rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary_red hover:text-primary_red"
                    >
                      {job.viewJobText || 'View Job'}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
