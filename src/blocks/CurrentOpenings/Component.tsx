'use client'

import type { CurrentOpeningsBlock as CurrentOpeningsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React, { useMemo, useState } from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { Button } from '@/components/ui/button'
import { JobApplicationModal } from './JobApplicationModal'

type Job = NonNullable<CurrentOpeningsBlockProps['jobListings']>[number]

function toLines(text?: string | null): string[] {
  return (text || '').split('\n').map((line) => line.trim()).filter(Boolean)
}

function JobDetailsModal({ job, onClose, onApply }: { job: Job; onClose: () => void; onApply: () => void }) {
  const responsibilities = toLines(job.responsibilitiesText)
  const requirements = toLines(job.requirementsText)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative z-50 my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        <span className="font-medium text-xs uppercase tracking-wide text-primary_red">{job.department}</span>
        <h3 className="mt-1 text-xl font-semibold text-foreground">{job.title}</h3>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>{job.location}</span>
          <span>{job.type}</span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600">{job.description}</p>

        {responsibilities.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-foreground">Key Responsibilities</h4>
            <ul className="mt-2 space-y-1.5">
              {responsibilities.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {requirements.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-foreground">Requirements</h4>
            <ul className="mt-2 space-y-1.5">
              {requirements.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onApply} variant="default" className="mt-6 w-full">
          Apply Now
        </Button>
      </div>
    </div>
  )
}

export const CurrentOpeningsBlock: React.FC<CurrentOpeningsBlockProps & { className?: string }> = ({
  className,
  badge,
  title,
  subtitle,
  showFilter = true,
  departments = [],
  jobListings = [],
}) => {
  const [activeDept, setActiveDept] = useState('all')
  const [detailsJob, setDetailsJob] = useState<Job | null>(null)
  const [applyJobTitle, setApplyJobTitle] = useState<string | null>(null)

  const filteredJobs = useMemo(() => {
    if (activeDept === 'all') return jobListings || []
    return (jobListings || []).filter((job) => job.department === activeDept)
  }, [jobListings, activeDept])

  return (
    <section id="current-openings" className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-10">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
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
          {filteredJobs.map((job, index) => (
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
                  <div className="flex flex-none flex-col gap-2 self-start sm:flex-row">
                    <button
                      onClick={() => setDetailsJob(job)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary_red hover:text-primary_red"
                    >
                      View More Details
                    </button>
                    <Button
                      onClick={() => setApplyJobTitle(job.title)}
                      variant="default"
                      size="sm"
                      className="rounded-full"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {detailsJob && (
        <JobDetailsModal
          job={detailsJob}
          onClose={() => setDetailsJob(null)}
          onApply={() => {
            setApplyJobTitle(detailsJob.title)
            setDetailsJob(null)
          }}
        />
      )}

      {applyJobTitle && (
        <JobApplicationModal jobTitle={applyJobTitle} onClose={() => setApplyJobTitle(null)} />
      )}
    </section>
  )
}
