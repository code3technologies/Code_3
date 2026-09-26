import React from 'react'
import type { Locale } from '@/utilities/getLocale'
import { RootLayoutContent, rootMetadata } from '../_shared/RootLayoutContent'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

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
