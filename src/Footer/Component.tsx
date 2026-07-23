import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ScrollToTopButton, ScrollToTopButtonMobile } from './ScrollToTopButton'

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M2 9h4v12H2zM4 2a2 2 0 100 4 2 2 0 000-4zM10 9v12M10 13a4 4 0 018 0v8',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M3 3h18v18H3z',
    extra: [
      { type: 'circle', cx: 12, cy: 12, r: 4 },
      { type: 'circle', cx: 17.5, cy: 6.5, r: 1 },
    ],
  },
  { label: 'X', href: '#', path: 'M4 4l16 16M20 4L4 20' },
]

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer

  const navItems = footerData?.navItems || []
  const description = footerData?.description
  const contactInfo = footerData?.contactInfo
  const bottomBar = footerData?.bottomBar
  const logo = footerData?.logo

  return (
    <footer className="relative overflow-hidden bg-[#0A0605] text-code3-slate-light">
      <div className="pointer-events-none absolute -bottom-[220px] -right-[140px] z-0 h-[520px] w-[520px] rounded-full border border-white/[0.08]" />

      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 pb-16 pt-20 max-[1024px]:px-5">
        <div className="grid grid-cols-1 gap-9 border-b border-white/10 pb-[60px] md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo href="/" logo={logo} width={140} height={44} alt="CODE3" />
            </div>
            <p className="font-inter mb-6 max-w-[280px] text-sm leading-relaxed">{description}</p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-code3-signal hover:text-code3-signal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                    <path d={s.path} />
                    {s.extra?.map((c, i) =>
                      c.type === 'circle' ? <circle key={i} cx={c.cx} cy={c.cy} r={c.r} /> : null,
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company nav (CMS-driven) */}
          {navItems.length > 0 && (
            <div>
              <h5 className="font-jetmono mb-5 text-xs uppercase tracking-[0.1em] text-white">
                Company
              </h5>
              <ul className="space-y-3">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink
                      className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal"
                      {...link}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick links */}
          <div>
            <h5 className="font-jetmono mb-5 text-xs uppercase tracking-[0.1em] text-white">
              Quick Links
            </h5>
            <ul className="space-y-3">
              <li>
                <a href="#top" className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal">
                  Home
                </a>
              </li>
              <li>
                <a href="#why" className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal">
                  Why Code3
                </a>
              </li>
              <li>
                <a href="#process" className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal">
                  Delivery Process
                </a>
              </li>
              <li>
                <a href="#faq" className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-jetmono mb-5 text-xs uppercase tracking-[0.1em] text-white">
              Contact
            </h5>
            <ul className="space-y-3">
              {contactInfo?.phone && (
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/[^+\d]/g, '')}`}
                    className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="font-inter text-sm text-code3-slate-light transition-colors hover:text-code3-signal"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.address?.building && (
                <li className="font-inter text-sm text-code3-slate-light">
                  {contactInfo.address.building}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3.5 pt-7 sm:flex-row">
          <span className="font-inter text-sm text-code3-slate-light">
            {bottomBar?.copyrightText}
          </span>
          <div className="flex items-center gap-5">
            <a href="#" className="font-inter text-sm text-code3-slate-light hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="font-inter text-sm text-code3-slate-light hover:text-white">
              Terms of Service
            </a>
            <ScrollToTopButton
              className="hidden hover:cursor-pointer md:flex items-center justify-center transition-all duration-300 active:scale-95 rounded-full bg-code3-signal text-code3-ink w-9 h-9 p-0"
              ariaLabel="Scroll to top"
            />
            <ScrollToTopButtonMobile
              className="flex md:hidden hover:cursor-pointer items-center justify-center transition-all duration-300 active:scale-95 rounded-full bg-code3-signal text-code3-ink w-9 h-9 p-0"
              ariaLabel="Scroll to top"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
