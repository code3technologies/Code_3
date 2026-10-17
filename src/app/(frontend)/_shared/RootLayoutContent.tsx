// Shared between app/(frontend)/[locale]/layout.tsx and
// app/(frontend)/preview-render/[locale]/layout.tsx - identical for ordinary
// visitors and live-preview sessions, so it's factored out once instead of
// duplicated across the two route trees. See src/middleware.ts for why those
// two trees exist.
import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import Script from 'next/script'
import { DynamicAdminBar } from '@/components/AdminBar/DynamicAdminBar'
import { DeferredGTM } from '@/components/DeferredGTM'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getSiteVerification } from '@/utilities/getSiteVerification'
import type { Locale } from '@/utilities/getLocale'
import { caMechano, notoSansArabic, openSauceSans } from '@/fonts'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { PhoneButton } from '@/components/PhoneButton'
import { SocialRailButtons } from '@/components/SocialRailButtons'
import { LocaleLinkGuard } from '@/components/LocaleLinkGuard'
import { TrackedContactLinks } from '@/components/TrackedContactLinks'
import { CartDrawer } from '@/components/DeviceCatalog/CartDrawer'
import { OrganizationSchema } from '@/components/StructuredData/OrganizationSchema'
import { getCachedGlobal } from '@/utilities/getGlobals'
import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WJKX5PV5'
const CLARITY_PROJECT_ID = 'xy1owi92ov'

export async function RootLayoutContent({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  // Same cache key/tag Footer/Component.tsx already fetches this global
  // with, so this is deduplicated against that call rather than a second
  // real round-trip.
  const footer = (await getCachedGlobal('footer', 1, locale)()) as {
    socialLinks?: Record<string, string | null | undefined>
  }

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        caMechano.variable,
        notoSansArabic.variable,
        openSauceSans.variable,
      )}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <OrganizationSchema />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Microsoft Clarity heatmaps + session recordings. lazyOnload (not
            afterInteractive) so it loads during browser idle time instead of
            competing with hydration for main-thread time on first load. */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Manual GTM injection (not @next/third-parties' <GoogleTagManager>) -
            that component hardcodes next/script's default "afterInteractive"
            strategy with no way to override it, so GTM's own ~155KB script
            (plus whatever it pulls in - GA4's ~177KB gtag.js and the Zoho
            SalesIQ widget, both configured as tags inside the GTM container)
            competed directly with hydration for main-thread time on every
            page load. lazyOnload (requestIdleCallback) helped but mobile CPU
            throttling rarely lets the browser go idle before LCP is measured,
            so DeferredGTM loads it on the visitor's first real interaction
            instead - see that component for the tradeoff this makes. */}
        <DeferredGTM gtmId={GTM_ID} />
        <Providers>
          <LocaleLinkGuard />
          <TrackedContactLinks />
          {/* No server-side draftMode() check here on purpose - reading it would
              force every page under this layout to render dynamically, which is
              exactly what this route structure exists to avoid. AdminBar fetches
              its own preview state client-side from /api/draft-status instead. */}
          <DynamicAdminBar />
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
          <PhoneButton />
          <WhatsAppButton />
          <SocialRailButtons socialLinks={footer?.socialLinks} />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  verification: getSiteVerification(),
}
