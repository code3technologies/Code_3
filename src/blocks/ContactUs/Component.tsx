'use client'

import type { ContactUsBlock as ContactUsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { SuccessModal } from './SuccessModale'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = ContactUsBlockProps & {
  className?: string
}

export const ContactUsBlock: React.FC<Props> = ({
  className,
  heading,
  subtitle,
  description,
  formFields = {
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'Enter your full name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com',
    phoneLabel: 'Phone number',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    messagePlaceholder: 'Leave us a message...',
    privacyText: 'You agree to our friendly privacy policy.',
    privacyLink: '#',
    submitButtonText: 'Send message',
  },
  countryOptions = [
    { value: '+971', label: 'UAE' },
    { value: '+91', label: 'IND' },
  ],
  subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'sales', label: 'Sales Inquiry' },
    { value: 'partnership', label: 'Partnership' },
  ],
}) => {
  const formMethods = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      country: countryOptions?.[0]?.value || 'UAE',
      phone: '',
      subject: subjectOptions?.[0]?.value || 'general',
      message: '',
      privacy: false,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()

  const onSubmit = useCallback(async (data: Record<string, unknown>) => {
    const dataToSend = Object.entries(data).map(([name, value]) => ({
      field: name,
      value,
    }))

    setIsLoading(true)

    try {
      // First, fetch the form by title to get its ID
      const formReq = await fetch(
        `${getClientSideURL()}/api/forms?where[title][equals]=Contact Form`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      )

      if (!formReq.ok) {
        setIsLoading(false)
        setError({
          message: 'Could not find contact form. Please ensure the form exists in the CMS.',
          status: formReq.status.toString(),
        })
        return
      }

      const formData = await formReq.json()
      const formId = formData?.docs?.[0]?.id

      if (!formId) {
        setIsLoading(false)
        setError({
          message:
            'Contact form not found. Please ensure a form with title "Contact Form" exists in the CMS.',
        })
        return
      }

      // Now submit with the actual form ID
      const req = await fetch(`${getClientSideURL()}/api/enquiries`, {
        body: JSON.stringify({
          form: formId,
          submissionData: dataToSend,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const res = await req.json()

      if (req.status >= 400) {
        setIsLoading(false)
        setError({
          message: res.errors?.[0]?.message || res.message || 'Internal Server Error',
          status: req.status.toString(),
        })
        return
      }

      setIsLoading(false)
      setShowSuccessModal(true)
      setHasSubmitted(true)

      // Push success event to Google Tag Manager dataLayer
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'form_submission_success',
          form_type: 'contact_form',
          page_url: window.location.href,
        })
      }
    } catch (err) {
      console.warn(err)
      setIsLoading(false)
      setError({
        message: err instanceof Error ? err.message : 'Something went wrong.',
      })
    }
  }, [])

  const fieldClassName =
    'w-full px-4 py-3 rounded-lg outline-none border border-border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:border-primary_red'

  return (
    <>
      <section className={cn('bg-white py-16 md:py-24', className)}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: heading */}
            <Reveal>
              {heading && <Eyebrow>{heading}</Eyebrow>}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                {subtitle}
              </h1>
              {description && (
                <p className="mt-4 max-w-md text-gray-600 leading-relaxed">{description}</p>
              )}
            </Reveal>

            {/* Right: form */}
            <Reveal delayMs={100}>
              <FormProvider {...formMethods}>
                {error && (
                  <div className="mb-4 rounded-lg border border-primary_red/20 bg-[#FDEBEC] px-4 py-3 text-sm text-primary_red">
                    {error.status || '500'}: {error.message || 'Something went wrong.'}
                  </div>
                )}
                {isLoading && !hasSubmitted && (
                  <p className="mb-4 text-sm text-gray-500">Loading, please wait...</p>
                )}
                {!hasSubmitted && (
                  <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                          {formFields.fullNameLabel}
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          {...register('fullname', { required: 'Full name is required' })}
                          placeholder={formFields.fullNamePlaceholder || 'Enter your full name'}
                          className={fieldClassName}
                        />
                        {errors.fullname && (
                          <div className="mt-2 text-primary_red text-sm">{errors.fullname.message as string}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          {formFields.emailLabel}
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          placeholder={formFields.emailPlaceholder || 'you@company.com'}
                          className={fieldClassName}
                        />
                        {errors.email && (
                          <div className="mt-2 text-primary_red text-sm">{errors.email.message as string}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          {formFields.phoneLabel}
                        </label>
                        <div className="flex gap-2">
                          <select
                            {...register('country')}
                            className="rounded-lg border border-border bg-white px-3 py-3 text-gray-700 outline-none focus:border-primary_red"
                          >
                            {countryOptions?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            id="phone"
                            maxLength={12}
                            {...register('phone', {
                              required: 'Phone number is required',
                              pattern: {
                                value: /^[0-9]+$/,
                                message: 'Phone number must contain only digits',
                              },
                              minLength: {
                                value: 8,
                                message: 'Phone number must be at least 8 digits',
                              },
                              maxLength: {
                                value: 12,
                                message: 'Phone number cannot exceed 12 digits',
                              },
                            })}
                            placeholder={formFields.phonePlaceholder || '555 000 000'}
                            onKeyDown={(e) => {
                              if (
                                e.key === 'Backspace' ||
                                e.key === 'Delete' ||
                                e.key === 'Tab' ||
                                e.key === 'Escape' ||
                                e.key === 'Enter' ||
                                e.key === 'ArrowLeft' ||
                                e.key === 'ArrowRight' ||
                                e.key === 'ArrowUp' ||
                                e.key === 'ArrowDown'
                              )
                                return
                              if (!/[0-9]/.test(e.key)) e.preventDefault()
                            }}
                            onPaste={(e) => {
                              const pastedData = e.clipboardData.getData('text')
                              if (!/^[0-9]+$/.test(pastedData)) {
                                e.preventDefault()
                              }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={cn(fieldClassName, 'flex-1')}
                          />
                        </div>
                        {errors.phone && (
                          <div className="mt-2 text-primary_red text-sm">{errors.phone.message as string}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          {formFields.subjectLabel}
                        </label>
                        <select id="subject" {...register('subject')} className={cn(fieldClassName, 'cursor-pointer')}>
                          {subjectOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {formFields.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        {...register('message', { required: 'Message is required' })}
                        rows={5}
                        placeholder={formFields.messagePlaceholder || 'Leave us a message...'}
                        className={cn(fieldClassName, 'resize-none')}
                      ></textarea>
                      {errors.message && (
                        <div className="mt-2 text-primary_red text-sm">{errors.message.message as string}</div>
                      )}
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        {...register('privacy', {
                          required: 'You must agree to the privacy policy',
                        })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary_red"
                      />
                      <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                        {formFields.privacyText?.split('privacy policy')[0] || 'You agree to our friendly '}
                        <a href={formFields.privacyLink || '#'} className="text-foreground underline">
                          privacy policy
                        </a>
                        {formFields.privacyText?.split('privacy policy')[1] || '.'}
                      </label>
                    </div>
                    {errors.privacy && (
                      <div className="mt-2 text-primary_red text-sm">{errors.privacy.message as string}</div>
                    )}

                    <Button
                      variant="default"
                      type="submit"
                      disabled={isLoading}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : formFields.submitButtonText}
                    </Button>
                  </form>
                )}
              </FormProvider>
            </Reveal>
          </div>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setHasSubmitted(false)
          formMethods.reset()
        }}
        title="Message Sent Successfully!"
        message="Thank you for reaching out. We'll get back to you as soon as possible."
        buttonText="Done"
      />
    </>
  )
}
