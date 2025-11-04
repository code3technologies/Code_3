'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  buttonText?: string
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Success!',
  message = 'Your message has been sent successfully.',
  buttonText = 'Close',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full bg-[linear-gradient(130deg,#C90E1D_0%,transparent_20%)] max-w-md mx-4 bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header with accent line */}
        <div className="relative pt-8 pb-6 px-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary_red/20 rounded-full blur-xl" />
              <div className="relative w-16 h-16 bg-primary_red rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-center text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer with action buttons */}
        <div className="px-8 py-6 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-center">
          <Button
            variant="default"
            size="alignCenter"
            onClick={onClose}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}