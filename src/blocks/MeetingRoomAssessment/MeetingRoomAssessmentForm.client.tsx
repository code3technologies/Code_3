'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { reportContactConversion } from '@/utilities/reportConversion'
import { Button } from '@/components/ui/button'
import { CalendarClock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utilities/ui'

const PLATFORM_OPTIONS = [
  'Zoom',
  'Microsoft Teams',
  'Google Meet',
  'Cisco Webex',
  'Not sure / need a recommendation',
]

type FormValues = {
  fullName: string
  businessEmail: string
  phone: string
  participants: string
  preferredPlatform: string
}

export function MeetingRoomAssessmentForm({
  title,
  description,
  submitLabel = 'Get My Free Room Assessment',
  className,
}: {
  title?: string | null
  description?: string | null
  submitLabel?: string | null
  className?: string
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      businessEmail: '',
      phone: '',
      participants: '',
      preferredPlatform: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = useCallback(async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const formReq = await fetch(
        `${getClientSideURL()}/api/forms?where[title][equals]=Meeting Room Assessment`,
        { headers: { 'Content-Type': 'application/json' } },
      )
      const formData = await formReq.json()
      const formId = formData?.docs?.[0]?.id

      if (!formId) {
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      const req = await fetch(`${getClientSideURL()}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: [
            { field: 'fullName', value: data.fullName },
            { field: 'businessEmail', value: data.businessEmail },
            { field: 'phone', value: data.phone },
            { field: 'participants', value: data.participants },
            { field: 'preferredPlatform', value: data.preferredPlatform },
            { field: 'subject', value: 'Meeting Room Assessment Request' },
            {
              field: 'message',
              value: `Participants: ${data.participants}\nPreferred Platform: ${data.preferredPlatform}`,
            },
          ],
        }),
      })

      if (!req.ok) {
        const res = await req.json().catch(() => null)
        setError(res?.errors?.[0]?.message || 'Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      reportContactConversion('meeting_room_assessment')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }, [])

  // Glass styling is scoped to `lg:` because this form only floats over the
  // dark hero on desktop — on mobile it renders as a normal light section,
  // matching the sibling Quick Enquiry form this block replaced.
  const fieldClassName = cn(
    'w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary_red',
    'lg:border-white/20 lg:bg-white/10 lg:text-white lg:placeholder:text-white/50 lg:focus:border-white/60',
  )
  const cardClass = cn(
    'rounded-2xl border border-border bg-white shadow-md',
    'lg:border-white/15 lg:bg-white/[0.07] lg:shadow-2xl lg:backdrop-blur-md',
  )

  if (submitted) {
    return (
      <div className={cn(cardClass, 'p-6 text-center', className)}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary_red/10 lg:bg-white/15">
          <CheckCircle2 className="h-6 w-6 text-primary_red lg:text-white" />
        </div>
        <h3 className="text-base font-bold text-foreground lg:text-white">Thanks — we&apos;ve got your details!</h3>
        <p className="mt-1 text-sm text-gray-600 lg:text-white/70">
          Our AV team will review your requirements and get back to you with a room recommendation shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            reset()
          }}
          className="mt-3 text-sm font-semibold text-primary_red hover:underline lg:text-white"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <div className={cn(cardClass, 'p-5 md:p-6', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary_red/10 lg:bg-white/15">
        <CalendarClock className="h-5 w-5 text-primary_red lg:text-white" />
      </div>
      {title && <h3 className="text-lg font-bold leading-snug text-foreground lg:text-white md:text-xl">{title}</h3>}
      {description && <p className="mt-1.5 text-sm leading-relaxed text-gray-500 lg:text-white/70">{description}</p>}

      <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register('fullName', { required: true })}
            className={fieldClassName}
          />
          {errors.fullName && <p className="mt-1 text-xs text-primary_red lg:text-red-300">Full name is required.</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Business Email"
            {...register('businessEmail', { required: true, pattern: /^\S+@\S+$/i })}
            className={fieldClassName}
          />
          {errors.businessEmail && <p className="mt-1 text-xs text-primary_red lg:text-red-300">A valid business email is required.</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register('phone', { required: true, pattern: /^[0-9+\s]+$/, minLength: 8 })}
            className={fieldClassName}
          />
          {errors.phone && <p className="mt-1 text-xs text-primary_red lg:text-red-300">A valid phone number is required.</p>}
        </div>

        <div>
          <input
            type="number"
            min={1}
            placeholder="Number of Participants"
            {...register('participants', { required: true })}
            className={fieldClassName}
          />
          {errors.participants && <p className="mt-1 text-xs text-primary_red lg:text-red-300">Please enter the number of participants.</p>}
        </div>

        <div>
          <select
            defaultValue=""
            {...register('preferredPlatform', { required: true })}
            className={cn(fieldClassName, 'text-gray-900 lg:text-white lg:[&>option]:text-gray-900')}
          >
            <option value="" disabled>
              Preferred Platform
            </option>
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          {errors.preferredPlatform && <p className="mt-1 text-xs text-primary_red lg:text-red-300">Please select a preferred platform.</p>}
        </div>

        {error && <p className="text-xs text-primary_red lg:text-red-300">{error}</p>}

        <Button type="submit" variant="default" disabled={isLoading} className="w-full disabled:opacity-50">
          {isLoading ? 'Sending...' : submitLabel}
        </Button>
      </form>
    </div>
  )
}
