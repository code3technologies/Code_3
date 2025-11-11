'use client'

import type { ContactUsBlock as ContactUsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { SuccessModal } from './SuccessModale'
import { Button } from '@/components/ui/button'

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
    phonePlaceholder: '+1 (555) 000-0000',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    messagePlaceholder: 'Leave us a message...',
    privacyText: 'You agree to our friendly privacy policy.',
    privacyLink: '#',
    submitButtonText: 'Send message',
  },
  countryOptions = [
    { value: 'UAE', label: 'UAE' },
    { value: 'UK', label: 'UK' },
    { value: 'IND', label: 'IND' },
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
    } catch (err) {
      console.warn(err)
      setIsLoading(false)
      setError({
        message: err instanceof Error ? err.message : 'Something went wrong.',
      })
    }
  }, [])
  return (
    <>
      <section
        className={cn(
          'flex items-center max-w-[2000px] mx-auto bg-[linear-gradient(50deg,black,#C90E1D,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent)]',
          className,
        )}
      >
        <div className="w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-0 overflow-hidden">
            {/* Left Side - Header (Mobile: Top, Desktop: Left) */}
            <div className="flex flex-col justify-center py-[2rem] px-[2rem] xl:pl-[8rem]">
              {/* Large Contact Us Heading */}
              <h1 className="text-[4rem] text-primary_red lg:text-[6rem] font-bold leading-tight mb-6 z-[2]">
                {heading.split(' ').map((word, index) => (
                  <React.Fragment key={index}>
                    {word}
                    {index === 0 && <br />}
                  </React.Fragment>
                ))}
              </h1>

              {/* Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-4">{subtitle}</h2>

              {/* Description */}
              <p className="text-black text-base sm:text-lg leading-relaxed max-w-sm">
                {description}
              </p>
            </div>

            {/* Right Side - Form (Mobile: Bottom, Desktop: Right) */}
            <div className="bg-[#F7F7F7] py-[3rem] px-[2rem] md:px-[3rem] relative">
              <div className="absolute left-0 top-[20%] bg-gradient-to-b from-transparent via-primary_red to-transparent h-[60%] w-[1px]"></div>
              <FormProvider {...formMethods}>
                {error && (
                  <div className="text-primary_red mb-4">
                    {error.status || '500'}: {error.message || 'Something went wrong.'}
                  </div>
                )}
                {isLoading && !hasSubmitted && <p className="mb-4">Loading, please wait...</p>}
                {!hasSubmitted && (
                  <form className="space-y-6 lg:max-w-[36rem]" onSubmit={handleSubmit(onSubmit)}>
                    {/* Row 1: Full Name and Email (Desktop: Side by side, Mobile: Stacked) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullname"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {formFields.fullNameLabel}
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          {...register('fullname', { required: 'Full name is required' })}
                          placeholder={formFields.fullNamePlaceholder || 'Enter your full name'}
                          className="w-[94%] px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                        />
                        {errors.fullname && (
                          <div className="mt-2 text-primary_red text-sm">
                            {errors.fullname.message as string}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
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
                          className="w-full px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                        />
                        {errors.email && (
                          <div className="mt-2 text-primary_red text-sm">
                            {errors.email.message as string}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone Number and Subject (Desktop: Side by side, Mobile: Stacked) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {formFields.phoneLabel}
                        </label>
                        <div className="flex lg:">
                          <select
                            {...register('country')}
                            className="px-3 py-3 border-b bg-[#F7F7F7] text-gray-700 border-[#E0DDDD]"
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
                            {...register('phone', { required: 'Phone number is required' })}
                            placeholder={formFields.phonePlaceholder || '+1 (555) 000-000'}
                            className="flex-1 px-4 py-3 border-b outline-none bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                          />
                        </div>
                        {errors.phone && (
                          <div className="mt-2 text-primary_red text-sm">
                            {errors.phone.message as string}
                          </div>
                        )}
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {formFields.subjectLabel}
                        </label>
                        <select
                          id="subject"
                          {...register('subject')}
                          className="w-full px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 transition-colors appearance-none cursor-pointer"
                        >
                          {subjectOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Message (Full Width) */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {formFields.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        {...register('message', { required: 'Message is required' })}
                        rows={6}
                        placeholder={formFields.messagePlaceholder || 'Leave us a message...'}
                        className="w-full px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors resize-none"
                      ></textarea>
                      {errors.message && (
                        <div className="mt-2 text-primary_red text-sm">
                          {errors.message.message as string}
                        </div>
                      )}
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        {...register('privacy', { required: 'You must agree to the privacy policy' })}
                        className="mt-1 h-4 w-4 text-primary_red border-gray-300 rounded"
                      />
                      <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                        {formFields.privacyText?.split('privacy policy')[0] ||
                          'You agree to our friendly '}
                        <a href={formFields.privacyLink || '#'} className="text-black underline">
                          privacy policy
                        </a>
                        {formFields.privacyText?.split('privacy policy')[1] || '.'}
                      </label>
                    </div>
                    {errors.privacy && (
                      <div className="mt-2 text-primary_red text-sm">
                        {errors.privacy.message as string}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      variant="default"
                      type="submit"
                      size="alignCenter"
                      disabled={isLoading}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : formFields.submitButtonText}
                    </Button>
                  </form>
                )}
              </FormProvider>
            </div>
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

