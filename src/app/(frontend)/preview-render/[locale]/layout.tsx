// Preview counterpart of app/(frontend)/[locale]/layout.tsx - see
// src/middleware.ts and src/app/(frontend)/_shared/RootLayoutContent.tsx.
import React from 'react'
import type { Locale } from '@/utilities/getLocale'
import { RootLayoutContent, rootMetadata } from '../../_shared/RootLayoutContent'

export const dynamic = 'force-dynamic'

type Args = {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}

export default async function RootLayout({ children, params: paramsPromise }: Args) {
  const { locale: rawLocale } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  return <RootLayoutContent locale={locale}>{children}</RootLayoutContent>
}

export const metadata = rootMetadata
