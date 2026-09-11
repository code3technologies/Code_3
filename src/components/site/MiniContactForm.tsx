'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { reportContactConversion } from '@/utilities/reportConversion'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

const COMPANY_SIZE_OPTIONS = ['0-9', '10-24', '25-49', '50-100', '100+'] as const

type FormValues = {
  fullname: string
  email: string
  phone: string
  message: string
  companySize: string
}

export function MiniContactForm({
  className,
  title = 'Quick Enquiry',
  description,
  showCompanySize = false,
  submitLabel = 'Send Enquiry',
  messagePlaceholder = 'How can we help?',
  onDark = false,
}: {
  className?: string
  title?: string
  description?: string | null
  /** Adds a required "Company Size" dropdown, used to qualify leads. */
  showCompanySize?: boolean
  submitLabel?: string
  messagePlaceholder?: string
  /** Glass styling for use over a dark hero background. */
  onDark?: boolean
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { fullname: '', email: '', phone: '', message: '', companySize: '' },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = useCallback(async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const formReq = await fetch(
        `${getClientSideURL()}/api/forms?where[title][equals]=Contact Form`,
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
            { field: 'fullname', value: data.fullname },
            { field: 'email', value: data.email },
            { field: 'phone', value: data.phone },
            { field: 'subject', value: title || 'Website Enquiry' },
            { field: 'message', value: data.message },
            ...(showCompanySize ? [{ field: 'companySize', value: data.companySize }] : []),
          ],
        }),
      })

      if (!req.ok) {
        const res = await req.json().catch(() => null)
        setError(res?.errors?.[0]?.message || 'Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      setHasSubmitted(true)
      setIsLoading(false)
      reportContactConversion('mini_contact_form')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }, [])

  // Glass styling is scoped to `lg:` because the form only floats over the
  // dark hero on desktop — on mobile it renders as a normal light section.
  const fieldClassName = cn(
    'w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary_red',
    onDark &&
      'lg:border-white/20 lg:bg-white/10 lg:text-white lg:placeholder:text-white/50 lg:focus:border-white/60',
  )
  const errorTextClass = cn('text-primary_red', onDark && 'lg:text-red-300')
  const cardClass = cn(
    'rounded-2xl border border-border bg-white shadow-sm',
    onDark && 'lg:border-white/15 lg:bg-white/[0.07] lg:shadow-2xl lg:backdrop-blur-md',
  )

  if (hasSubmitted) {
    return (
      <div className={cn(cardClass, 'p-6', className)}>
        <p className={cn('text-sm font-medium text-foreground', onDark && 'lg:text-white')}>Thanks for reaching out!</p>
        <p className={cn('mt-1 text-sm text-gray-600', onDark && 'lg:text-white/70')}>
          Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setHasSubmitted(false)
            reset()
          }}
          className={cn('mt-3 text-sm font-semibold text-primary_red hover:underline', onDark && 'lg:text-white')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className={cn(cardClass, 'p-5', className)}>
      <h3 className={cn('text-base font-semibold text-foreground', onDark && 'lg:text-white')}>{title}</h3>
      {description && (
        <p className={cn('mt-1 text-sm text-gray-500', onDark && 'lg:text-white/70')}>{description}</p>
      )}

      <form className="mt-3 space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Full name"
            {...register('fullname', { required: true })}
            className={fieldClassName}
          />
          {errors.fullname && <p className={cn("mt-1 text-xs", errorTextClass)}>Full name is required.</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            className={fieldClassName}
          />
          {errors.email && <p className={cn("mt-1 text-xs", errorTextClass)}>A valid email is required.</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone number"
            {...register('phone', {
              required: true,
              pattern: /^[0-9+\s]+$/,
              minLength: 8,
            })}
            className={fieldClassName}
          />
          {errors.phone && <p className={cn("mt-1 text-xs", errorTextClass)}>A valid phone number is required.</p>}
        </div>

        {showCompanySize && (
          <div>
            <select
              defaultValue=""
              {...register('companySize', { required: true })}
              className={cn(fieldClassName, 'text-gray-900', onDark && 'lg:text-white [&>option]:text-gray-900')}
            >
              <option value="" disabled>
                Company size
              </option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
            {errors.companySize && <p className={cn("mt-1 text-xs", errorTextClass)}>Please select your company size.</p>}
          </div>
        )}

        <div>
          <textarea
            placeholder={messagePlaceholder}
            rows={2}
            {...register('message', { required: true })}
            className={cn(fieldClassName, 'resize-none')}
          />
          {errors.message && <p className={cn("mt-1 text-xs", errorTextClass)}>Please add a short message.</p>}
        </div>

        {error && <p className={cn("text-xs", errorTextClass)}>{error}</p>}

        <Button type="submit" variant="default" disabled={isLoading} className="w-full disabled:opacity-50">
          {isLoading ? 'Sending...' : submitLabel}
        </Button>
      </form>
    </div>
  )
}
