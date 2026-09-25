'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'
import { reportNewsletterSignup } from '@/utilities/reportConversion'

type Props = {
  // Where the form is placed - stored with the signup and sent to analytics.
  source: string
  // 'footer' sits on the red footer; 'card' is a standalone light card.
  variant?: 'footer' | 'card'
  locale?: 'en' | 'ar'
  className?: string
}

const COPY = {
  en: {
    heading: 'Get practical IT insights',
    text: 'Short, useful articles on IT, security and technology for UAE businesses. No spam.',
    label: 'Email address',
    placeholder: 'Your work email',
    button: 'Subscribe',
    sending: 'Subscribing...',
    success: "Thanks - you're subscribed.",
    error: 'Something went wrong. Please try again.',
    invalid: 'Please enter a valid email address.',
    note: 'We only use your email to send CODE3 insights. Ask to be removed any time at info@code3.ae.',
  },
  ar: {
    heading: 'احصل على مقالات عملية في تقنية المعلومات',
    text: 'مقالات قصيرة ومفيدة عن تقنية المعلومات والأمن السيبراني للشركات في الإمارات. بدون رسائل مزعجة.',
    label: 'البريد الإلكتروني',
    placeholder: 'بريدك الإلكتروني للعمل',
    button: 'اشترك',
    sending: 'جارٍ الاشتراك...',
    success: 'شكرًا لك، تم اشتراكك.',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    invalid: 'يرجى إدخال بريد إلكتروني صحيح.',
    note: 'نستخدم بريدك الإلكتروني فقط لإرسال مقالات CODE3. يمكنك طلب إزالته في أي وقت عبر info@code3.ae.',
  },
} as const

export function NewsletterSignup({ source, variant = 'card', locale: localeProp, className }: Props) {
  // Cached pages can't read the request locale on the server, so when none is
  // passed we pick Arabic up from the page's <html lang> after mount.
  const [detected, setDetected] = useState<'en' | 'ar'>('en')
  useEffect(() => {
    if (!localeProp) setDetected(document.documentElement.lang === 'ar' ? 'ar' : 'en')
  }, [localeProp])
  const locale = localeProp || detected
  const t = COPY[locale]
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const onFooter = variant === 'footer'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, source, locale, page: window.location.pathname }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage(t.success)
        reportNewsletterSignup(source)
        setEmail('')
        return
      }
      setStatus('error')
      setMessage(res.status === 400 ? t.invalid : t.error)
    } catch {
      setStatus('error')
      setMessage(t.error)
    }
  }

  return (
    <div
      className={cn(
        onFooter ? 'text-white' : 'rounded-2xl border border-border bg-gray-50/70 p-6 md:p-8',
        className,
      )}
    >
      <h3 className={cn('font-semibold', onFooter ? 'text-base' : 'text-xl text-foreground')}>{t.heading}</h3>
      <p className={cn('mt-1.5 text-sm leading-relaxed', onFooter ? 'text-white/75' : 'text-gray-600')}>{t.text}</p>

      {status === 'success' ? (
        <p role="status" className={cn('mt-4 text-sm font-semibold', onFooter ? 'text-white' : 'text-primary_red')}>
          {message}
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor={`nl-${source}`} className="sr-only">
              {t.label}
            </label>
            <input
              id={`nl-${source}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className={cn(
                'min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors',
                onFooter
                  ? 'border-white/30 bg-white text-gray-900 placeholder-gray-400 focus:border-white'
                  : 'border-border bg-white text-gray-900 placeholder-gray-400 focus:border-primary_red',
              )}
            />
            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                'rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                onFooter
                  ? 'bg-white text-primary_red hover:bg-white/90'
                  : 'bg-primary_red text-white hover:bg-primary_red/90',
              )}
            >
              {status === 'loading' ? t.sending : t.button}
            </button>
          </div>
          <p
            role="status"
            aria-live="polite"
            className={cn('mt-2 min-h-[1.25rem] text-xs', status === 'error' ? (onFooter ? 'text-white' : 'text-primary_red') : 'text-transparent')}
          >
            {status === 'error' ? message : '.'}
          </p>
          <p className={cn('text-xs leading-relaxed', onFooter ? 'text-white/60' : 'text-gray-500')}>{t.note}</p>
        </form>
      )}
    </div>
  )
}
