import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

const parentServices = [
  { label: 'Managed IT Service', href: '/service/managed-it-service-dubai-uae' },
  { label: 'Audio Visual (AV) Solutions', href: '/service/audio-visual-av-solutions-dubai-uae' },
  { label: 'Cyber Security', href: '/service/cyber-security-dubai-uae' },
  { label: 'Security & Surveillance Solutions', href: '/service/security--surveillance-solutions-dubai-uae' },
  { label: 'Cloud and Microsoft Solutions', href: '/service/cloud-and-microsoft-solutions-dubai-uae' },
  { label: 'IT Infrastructure Service', href: '/service/it-infrastructure-service-dubai-uae' },
  { label: 'Network Infrastructure', href: '/service/network-infrastructure-dubai-uae' },
  { label: 'Backup and Business Continuity', href: '/service/backup-and-business-continuity-dubai-uae' },
  { label: 'Unified Communication', href: '/service/unified-communication-dubai-uae' },
  { label: 'Hardware and Software Services', href: '/service/hardware-and-software-services-dubai-uae' },
  { label: 'Professional Services', href: '/service/professional-services-dubai-uae' },
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
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Jump straight to one
            of our services below, or head back home.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {parentServices.map((link) => (
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
          <Button asChild variant="outline" className="text-foreground">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
