import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { ScrollToTopButton, ScrollToTopButtonMobile } from './ScrollToTopButton'
import Link from 'next/link'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer

  const navItems = footerData?.navItems || []
  const description = footerData?.description
  const contactInfo = footerData?.contactInfo
  const bottomBar = footerData?.bottomBar
  const logo = footerData?.logo

  return (
    <footer className="bg-black text-white relative">
      {/* Main Footer Content */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center mb-6 hover:cursor-pointer">
              <Logo href="/" logo={logo} width={274} height={89} alt="Company Logo" />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-16 max-w-sm">
              {description}
            </p>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-5 md:gap-y-3 max-w-[15rem] sm:max-w-sm text-sm text-gray-700 mb-8">
              {navItems.map(({ link }, i) => (
                <React.Fragment key={i}>
                  <CMSLink
                    className="text-gray-300 hover:text-white transition-colors"
                    {...link}
                  />
                  {i < navItems.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-12">
            <div className="">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Contact Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span>(</span>
                  <a
                    href={`tel:${contactInfo?.phone}`}
                    className="text-gray-200 hover:text-brand-red transition-colors text-lg font-semibold"
                  >
                    {contactInfo?.phone}
                  </a>
                  <span>)</span>
                </div>
              </div>
            </div>

            <div className="">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Location
              </h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>{contactInfo?.address?.companyName}</p>
                <p>{contactInfo?.address?.building}</p>
                <p>{contactInfo?.address?.poBox}</p>
              </div>
            </div>

            <div className="">
              <h4 className="text-gray-600 uppercase tracking-wide text-xs mb-2">
                {contactInfo?.workingHours?.days}
              </h4>
              <p className="text-gray-300 text-lg lg:text-xl">
                {contactInfo?.workingHours?.time}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="md:col-start-2 lg:col-start-auto lg:mt-auto lg:ml-18">
            <div className="space-y-3 text-sm text-gray-300">
              <div className="pt-4">
                <h4 className="text-gray-600 uppercase tracking-wide text-xs mb-2">Email</h4>
                <a
                  href={`mailto:${contactInfo?.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {contactInfo?.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="grid gap-8 md:gap-4 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ScrollToTopButton />

          <div className="hidden md:block text-gray-300 mt-auto text-sm">
            {bottomBar?.copyrightText}
          </div>
        </div>

        <Link href="/services">
          <div className="w-full relative overflow-hidden active:scale-[0.995] transition-all">
            {bottomBar?.exploreServicesImage ? (
              <Media
                resource={bottomBar.exploreServicesImage}
                imgClassName="w-full h-[80px] lg:h-[120px] rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-26 rounded-xl bg-red-800"></div>
            )}

            <div className="absolute inset-0 flex items-center justify-between gap-5 px-5 sm:px-10 xl:px-14">
              <span>{bottomBar?.exploreServicesText}</span>
              <div className="rotate-45">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 16L7 2M7 2L1 8M7 2L13 8" stroke="#ECEEEC" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <div className="md:hidden flex justify-between">
          <div className="text-gray-300 mt-auto text-sm">{bottomBar?.copyrightText}</div>
          <ScrollToTopButtonMobile />
        </div>
      </div>
    </footer>
  )
}
