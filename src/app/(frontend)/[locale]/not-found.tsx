import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Search } from '@/search/Component'

const popularLinks = [
  { label: 'IT AMC Services', href: '/service/it-amc-dubai-uae' },
  { label: 'CCTV Surveillance', href: '/cctv-surveillance' },
  { label: 'Cyber Security', href: '/service/cyber-security-dubai-uae' },
  { label: 'Access Control & Biometric Attendance', href: '/service/access-control-and-bio-metric-attendance-system-dubai-uae' },
  { label: 'Video Conferencing Solutions', href: '/service/video-conferencing-solutions-dubai-uae' },
  { label: 'Blog', href: '/posts' },
]

export default function NotFound() {
  return (
    <div className="bg-foreground text-background">
      <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-10 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary_red">
            Error 404
          </p>
          <h1 className="text-5xl font-semibold md:text-6xl">This page took a wrong turn</h1>
          <p className="max-w-xl text-base text-background/70 md:text-lg">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Try searching for what
            you need, or jump straight to one of our most-visited pages below.
          </p>
        </div>

        <div className="w-full max-w-lg">
          <Search />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-background/20 px-4 py-2 text-sm text-background/80 transition-colors hover:border-primary_red hover:text-primary_red"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button asChild variant="default">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
