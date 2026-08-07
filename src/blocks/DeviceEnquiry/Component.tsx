'use client'

import type { DeviceEnquiryBlock as DeviceEnquiryBlockProps } from 'src/payload-types'
import React, { useState } from 'react'
import { DeviceEnquiryForm } from '@/components/DeviceCatalog/DeviceEnquiryForm'

type Props = { id?: string } & DeviceEnquiryBlockProps

export const DeviceEnquiryBlock: React.FC<Props> = ({ id, heading, deviceLabel }) => {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      id={id ? `block-${id}` : undefined}
      className="bg-white py-6 md:py-8 lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent lg:py-0 lg:pointer-events-none"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:flex lg:flex-col lg:items-end">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-5 shadow-sm lg:pointer-events-auto lg:mx-0 lg:mt-8 lg:w-[360px]">
          {submitted ? (
            <div className="py-2">
              <p className="text-sm font-semibold text-foreground">Thanks for reaching out!</p>
              <p className="mt-1 text-sm text-gray-600">Our team will get back to you shortly.</p>
            </div>
          ) : (
            <>
              <h3 className="text-base font-semibold text-foreground">{heading}</h3>
              <div className="mt-3">
                <DeviceEnquiryForm deviceNames={[deviceLabel]} onSuccess={() => setSubmitted(true)} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
