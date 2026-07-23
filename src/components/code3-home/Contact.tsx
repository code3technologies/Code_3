'use client'

import React, { useState } from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import { getClientSideURL } from '@/utilities/getURL'

const SERVICE_OPTIONS = [
  'Managed IT Services',
  'Cybersecurity Solutions',
  'Cloud & Microsoft Solutions',
  'Network Infrastructure',
  'AV & ELV Solutions',
  'Something else',
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

export interface ContactProps {
  eyebrow?: string
  title?: string
  description?: string
  phone?: string
  email?: string
  location?: string
  hours?: string
}

export function Contact({
  eyebrow = 'GET IN TOUCH',
  title = 'Ready to transform your business with technology?',
  description = 'Partner with CODE3 to build secure, scalable, and future-ready technology environments. Tell us about your project and our team will respond within one business day.',
  phone = '+971 50 504 2547',
  email = 'info@code3.ae',
  location = 'Office 209, Al Mozna Building, Dubai, UAE',
  hours = 'Monday – Saturday, 8:00 AM – 6:00 PM',
}: ContactProps = {}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const fullName = String(data.get('fullname') || '')
    const company = String(data.get('company') || '')
    const email = String(data.get('email') || '')
    const phone = String(data.get('phone') || '')
    const service = String(data.get('service') || '')
    const message = String(data.get('message') || '')

    const combinedMessage = [
      company && `Company: ${company}`,
      service && `Service of interest: ${service}`,
      message,
    ]
      .filter(Boolean)
      .join('\n')

    setStatus('submitting')
    setErrorMessage('')

    try {
      const formReq = await fetch(
        `${getClientSideURL()}/api/forms?where[title][equals]=Contact Form`,
        { headers: { 'Content-Type': 'application/json' }, method: 'GET' },
      )
      if (!formReq.ok) throw new Error('Could not reach the contact form.')
      const formData = await formReq.json()
      const formId = formData?.docs?.[0]?.id
      if (!formId) throw new Error('Contact form is not configured yet.')

      const submissionData = [
        { field: 'full-name', value: fullName },
        { field: 'email', value: email },
        { field: 'phone', value: phone },
        { field: 'message', value: combinedMessage },
      ]

      const req = await fetch(`${getClientSideURL()}/api/enquiries`, {
        body: JSON.stringify({ form: formId, submissionData }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (req.status >= 400) {
        const res = await req.json().catch(() => null)
        throw new Error(res?.errors?.[0]?.message || res?.message || 'Something went wrong.')
      }

      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-code3-ink py-[120px] text-white max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -right-[140px] -top-[180px] z-0 h-[520px] w-[520px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(139,15,31,0.10), transparent 68%)' }}
      />
      <div className="pointer-events-none absolute -bottom-[110px] left-[6%] z-0 h-[300px] w-[300px] rounded-full border border-white/[0.08]" />
      <div className="relative z-[1] mx-auto grid max-w-[1240px] grid-cols-1 gap-[70px] px-8 lg:grid-cols-[0.9fr_1.1fr] max-[760px]:px-5">
        <Reveal>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk mb-[18px] text-[clamp(26px,3vw,38px)] font-semibold text-white">
            {title}
          </h2>
          <p className="font-inter mb-9 text-[15.5px] leading-[1.7] text-code3-slate-light">
            {description}
          </p>

          <ContactDetail label="Phone" value={phone} href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
            <PhoneIcon />
          </ContactDetail>
          <ContactDetail label="Email" value={email} href={`mailto:${email}`}>
            <MailIcon />
          </ContactDetail>
          <ContactDetail label="Location" value={location}>
            <PinIcon />
          </ContactDetail>
          <ContactDetail label="Hours" value={hours}>
            <ClockIcon />
          </ContactDetail>
        </Reveal>

        <Reveal delayMs={100}>
          <form
            onSubmit={onSubmit}
            className="rounded-[20px] border border-white/10 bg-code3-ink2 p-9 max-[760px]:p-6"
          >
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input name="fullname" type="text" required placeholder="Your name" />
              </Field>
              <Field label="Company">
                <input name="company" type="text" placeholder="Company name" />
              </Field>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email">
                <input name="email" type="email" required placeholder="you@company.com" />
              </Field>
              <Field label="Phone">
                <input name="phone" type="tel" placeholder="+971" />
              </Field>
            </div>
            <Field label="Service of interest">
              <select name="service" defaultValue={SERVICE_OPTIONS[0]}>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message">
              <textarea name="message" required placeholder="Tell us about your project..." />
            </Field>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="font-inter mt-1.5 flex w-full items-center justify-center gap-2.5 rounded-full bg-code3-amber px-[26px] py-3.5 text-[15px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send Message'}
              {status !== 'submitting' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
            {status === 'success' && (
              <p className="font-inter mt-3.5 text-[13px] text-code3-signal">
                Thanks — we&apos;ll be in touch within one business day.
              </p>
            )}
            {status === 'error' && (
              <p className="font-inter mt-3.5 text-[13px] text-code3-coral">{errorMessage}</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-2 [&_input]:bg-code3-ink [&_select]:bg-code3-ink [&_textarea]:bg-code3-ink [&_input]:border [&_select]:border [&_textarea]:border [&_input]:border-white/10 [&_select]:border-white/10 [&_textarea]:border-white/10 [&_input]:rounded-[10px] [&_select]:rounded-[10px] [&_textarea]:rounded-[10px] [&_input]:px-3.5 [&_select]:px-3.5 [&_textarea]:px-3.5 [&_input]:py-3 [&_select]:py-3 [&_textarea]:py-3 [&_input]:text-[14.5px] [&_select]:text-[14.5px] [&_textarea]:text-[14.5px] [&_input]:text-white [&_select]:text-white [&_textarea]:text-white [&_input]:font-inter [&_textarea]:font-inter [&_textarea]:min-h-[100px] [&_textarea]:resize-y [&_input:focus]:outline-none [&_select:focus]:outline-none [&_textarea:focus]:outline-none [&_input:focus]:border-code3-signal [&_select:focus]:border-code3-signal [&_textarea:focus]:border-code3-signal">
      <label className="font-jetmono text-[12.5px] text-code3-slate-light">{label}</label>
      {children}
    </div>
  )
}

function ContactDetail({
  label,
  value,
  href,
  children,
}: {
  label: string
  value: string
  href?: string
  children: React.ReactNode
}) {
  const content = (
    <div>
      <div className="font-jetmono text-xs uppercase tracking-[0.08em] text-code3-slate-light">
        {label}
      </div>
      <div className="font-inter mt-1 text-[15px] text-white">{value}</div>
    </div>
  )
  return (
    <div className="mb-[22px] flex gap-4">
      <span className="mt-0.5 h-5 w-5 flex-none text-code3-signal">{children}</span>
      {href ? (
        <a href={href} className="hover:text-code3-signal">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}
