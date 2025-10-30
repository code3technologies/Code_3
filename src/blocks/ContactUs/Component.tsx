'use client'

import type { ContactUsBlock as ContactUsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'

type Props = ContactUsBlockProps & {
  className?: string
}

export const ContactUsBlock: React.FC<Props> = ({
  className,
  heading = 'CONTACT US',
  subtitle = "Let's Talk Solutions",
  description = "We're here to help you with your IT, ICT & ELV, AV, and Solutions needs. Choose the way that works best for you.",
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
    { value: 'UK', label: 'UK' },
    { value: 'US', label: 'US' },
    { value: 'CA', label: 'CA' },
  ],
  subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'sales', label: 'Sales Inquiry' },
    { value: 'partnership', label: 'Partnership' },
  ],
}) => {
  return (
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
            <h1 className="text-[4rem] text-[#C90E1D] lg:text-[6rem] font-bold leading-tight mb-6 z-[2]">
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
            <div className="absolute left-0 top-[20%] bg-gradient-to-b via-[#C90E1D] h-[60%] w-[1px]"></div>
            <form className="space-y-6 lg:max-w-[36rem]">
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
                    name="fullname"
                    placeholder={formFields.fullNamePlaceholder || 'Enter your full name'}
                    className="w-[94%] px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {formFields.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={formFields.emailPlaceholder || 'you@company.com'}
                    className="w-full px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Phone Number and Subject (Desktop: Side by side, Mobile: Stacked) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {formFields.phoneLabel}
                  </label>
                  <div className="flex lg:">
                    <select className="px-3 py-3 border-b bg-[#F7F7F7] text-gray-700 border-[#E0DDDD]">
                      {countryOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder={formFields.phonePlaceholder || '+1 (555) 000-000'}
                      className="flex-1 px-4 py-3 border-b outline-none bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {formFields.subjectLabel}
                  </label>
                  <select
                    id="subject"
                    name="subject"
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {formFields.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={formFields.messagePlaceholder || 'Leave us a message...'}
                  className="w-full px-4 py-3 outline-none border-b bg-[#F7F7F7] border-[#E0DDDD] text-gray-900 placeholder-gray-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-4 rounded-full transition-all duration-300 active:scale-95 hover:cursor-pointer"
              >
                {formFields.submitButtonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
