'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { reportContactConversion } from '@/utilities/reportConversion'
import { Button } from '@/components/ui/button'
import { ServiceIcon } from '@/components/site/icons'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const LOCATION_OPTIONS = [...EMIRATES, 'Other']

const BRANCH_OPTIONS = ['1', '2', '3', '4', '5', '6-10', '11-20', '20+']

type PeripheralKey =
  | 'users'
  | 'desktop'
  | 'laptop'
  | 'physicalServer'
  | 'networkPrinter'
  | 'copierScanner'
  | 'firewall'
  | 'router'
  | 'pbx'
  | 'phones'
  | 'biometricDevice'
  | 'cctv'
  | 'nasDrive'
  | 'virtualServer'
  | 'switchDevice'
  | 'accessPoints'
  | 'sanStorage'
  | 'audioVideoConferencing'
  | 'faxMachine'
  | 'intercomSystem'
  | 'ups'

const PERIPHERALS: { key: PeripheralKey; label: string; icon: string }[] = [
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'desktop', label: 'Desktop', icon: 'monitor' },
  { key: 'laptop', label: 'Laptop', icon: 'layout' },
  { key: 'physicalServer', label: 'Physical Server', icon: 'server' },
  { key: 'networkPrinter', label: 'Network Printer', icon: 'printer' },
  { key: 'copierScanner', label: 'Copier & Scanner', icon: 'document' },
  { key: 'firewall', label: 'Firewall', icon: 'shield' },
  { key: 'router', label: 'Router', icon: 'network' },
  { key: 'pbx', label: 'PBX', icon: 'headset' },
  { key: 'phones', label: 'Phones', icon: 'phone' },
  { key: 'biometricDevice', label: 'Biometric Device', icon: 'lock' },
  { key: 'cctv', label: 'CCTV', icon: 'camera' },
  { key: 'nasDrive', label: 'NAS Drive', icon: 'database' },
  { key: 'virtualServer', label: 'Virtual Server', icon: 'cloud' },
  { key: 'switchDevice', label: 'Switch', icon: 'wifi' },
  { key: 'accessPoints', label: 'Access Points', icon: 'wifi' },
  { key: 'sanStorage', label: 'SAN Storage', icon: 'box' },
  { key: 'audioVideoConferencing', label: 'Audio Video Conferencing', icon: 'tv' },
  { key: 'faxMachine', label: 'Fax Machine', icon: 'document' },
  { key: 'intercomSystem', label: 'Intercom System', icon: 'mic' },
  { key: 'ups', label: 'UPS', icon: 'settings' },
]

const QUANTITY_OPTIONS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '15', '20', '25', '30', '40', '50', '75', '100', '150', '200', '250', '300', '400', '500+',
]

type FormValues = {
  fullname: string
  companyName: string
  mobile: string
  companyEmail: string
  branches: string
} & Record<PeripheralKey, string>

const defaultPeripheralValues = PERIPHERALS.reduce(
  (acc, p) => ({ ...acc, [p.key]: '0' }),
  {} as Record<PeripheralKey, string>,
)

export function QuoteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullname: '',
      companyName: '',
      mobile: '',
      companyEmail: '',
      branches: '1',
      ...defaultPeripheralValues,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [otherLocationText, setOtherLocationText] = useState('')
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLocationOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isLocationOpen])

  const toggleLocation = (option: string) => {
    setSelectedLocations((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    )
    setLocationError(null)
  }

  const locationSummary =
    selectedLocations.length === 0
      ? 'Select location(s)'
      : selectedLocations.map((l) => (l === 'Other' && otherLocationText ? otherLocationText : l)).join(', ')

  const onSubmit = useCallback(async (data: FormValues) => {
    if (selectedLocations.length === 0) {
      setLocationError('Please select at least one location.')
      return
    }
    if (selectedLocations.includes('Other') && !otherLocationText.trim()) {
      setLocationError('Please type your location.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formReq = await fetch(`${getClientSideURL()}/api/forms?where[title][equals]=Quote Form`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const formData = await formReq.json()
      const formId = formData?.docs?.[0]?.id

      if (!formId) {
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      const peripheralsSummary = PERIPHERALS.map((p) => `${p.label}: ${data[p.key] || '0'}`).join('\n')
      const locationValue = selectedLocations
        .map((l) => (l === 'Other' ? otherLocationText.trim() : l))
        .join(', ')

      const req = await fetch(`${getClientSideURL()}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: [
            { field: 'fullname', value: data.fullname },
            { field: 'companyName', value: data.companyName },
            { field: 'phone', value: data.mobile },
            { field: 'email', value: data.companyEmail },
            { field: 'location', value: locationValue },
            { field: 'branches', value: data.branches },
            { field: 'subject', value: 'IT AMC Quote Request' },
            {
              field: 'message',
              value: `Company: ${data.companyName}\nLocation: ${locationValue}\nBranches: ${data.branches}\n\nIT Environment:\n${peripheralsSummary}`,
            },
            ...PERIPHERALS.map((p) => ({ field: p.key, value: data[p.key] || '0' })),
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
      reportContactConversion('quote_request')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }, [selectedLocations, otherLocationText])

  const fieldClassName =
    'w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary_red'

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-primary_red/15 bg-gradient-to-b from-primary_red/[0.05] to-white p-10 text-center shadow-[0_20px_45px_-20px_rgba(0,0,0,0.2)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary_red/10">
          <CheckCircle2 className="h-7 w-7 text-primary_red" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Thanks — we&apos;ve got your details!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Our team will review your IT environment and get back to you with a tailored AMC quote shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
      {/* Contact details */}
      <div className="mb-8 rounded-2xl border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_45px_-20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-primary_red to-red-700 px-6 py-4 md:px-8">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white text-xs font-bold text-primary_red">
            1
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Your Details</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:p-8">
          <div>
            <input
              type="text"
              placeholder="Full name"
              {...register('fullname', { required: true })}
              className={fieldClassName}
            />
            {errors.fullname && <p className="mt-1 text-xs text-primary_red">Full name is required.</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Company name"
              {...register('companyName', { required: true })}
              className={fieldClassName}
            />
            {errors.companyName && <p className="mt-1 text-xs text-primary_red">Company name is required.</p>}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Mobile number"
              {...register('mobile', { required: true, pattern: /^[0-9+\s]+$/, minLength: 8 })}
              className={fieldClassName}
            />
            {errors.mobile && <p className="mt-1 text-xs text-primary_red">A valid mobile number is required.</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Company email address"
              {...register('companyEmail', { required: true, pattern: /^\S+@\S+$/i })}
              className={fieldClassName}
            />
            {errors.companyEmail && <p className="mt-1 text-xs text-primary_red">A valid email is required.</p>}
          </div>

          <div ref={locationRef} className="relative">
            <button
              type="button"
              onClick={() => setIsLocationOpen((o) => !o)}
              className={`${fieldClassName} flex items-center justify-between text-left ${selectedLocations.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}
            >
              <span className="truncate">{locationSummary}</span>
              <ChevronDown className="h-4 w-4 flex-none text-gray-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-border bg-white p-2 shadow-lg">
                {LOCATION_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(option)}
                      onChange={() => toggleLocation(option)}
                      className="h-4 w-4 rounded border-border text-primary_red focus:ring-primary_red"
                    />
                    {option}
                  </label>
                ))}
                {selectedLocations.includes('Other') && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type your location"
                    value={otherLocationText}
                    onChange={(e) => setOtherLocationText(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary_red"
                  />
                )}
              </div>
            )}
            {locationError && <p className="mt-1 text-xs text-primary_red">{locationError}</p>}
          </div>

          <div>
            <select {...register('branches', { required: true })} className={fieldClassName}>
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b} {b === '1' ? 'Branch' : 'Branches'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Peripherals table */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_45px_-20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary_red to-red-700 px-6 py-4 md:px-8">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white text-xs font-bold text-primary_red">
            2
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Your IT Environment</h2>
        </div>
        <div className="grid grid-cols-[1fr_140px] border-b border-border bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
          <div className="px-5 py-3 md:px-8">Peripherals</div>
          <div className="border-l border-border px-5 py-3 text-center">Quantity</div>
        </div>
        {PERIPHERALS.map((p, index) => (
          <div
            key={p.key}
            className={
              index % 2 === 1
                ? 'grid grid-cols-[1fr_140px] items-center bg-gray-50/60 transition-colors hover:bg-primary_red/[0.03]'
                : 'grid grid-cols-[1fr_140px] items-center bg-white transition-colors hover:bg-primary_red/[0.03]'
            }
          >
            <div className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 md:px-8">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary_red/10">
                <ServiceIcon preset={p.icon} className="h-4 w-4 text-primary_red" />
              </span>
              {p.label}
            </div>
            <div className="border-l border-border/60 px-3 py-2.5 text-center">
              <select
                {...register(p.key)}
                className="w-full rounded-md border border-border bg-white px-2 py-1.5 text-center text-sm font-medium text-gray-900 outline-none transition-colors focus:border-primary_red"
              >
                {QUANTITY_OPTIONS.map((qty) => (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-primary_red">{error}</p>}

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary_red/15 bg-gradient-to-b from-primary_red/[0.05] to-primary_red/[0.02] px-6 py-8 text-center">
        <p className="text-sm text-gray-600">No commitment. Our team typically responds within 24 hours.</p>
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold shadow-[0_10px_25px_-8px_rgba(201,14,29,0.5)] disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Get My Quote'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}
