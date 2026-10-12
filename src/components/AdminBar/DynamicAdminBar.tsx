'use client'
import dynamic from 'next/dynamic'

// AdminBar statically imports @payloadcms/admin-bar and its own stylesheet
// even though it self-gates to `null` for the first 2 seconds and only ever
// renders meaningfully for authenticated Payload admins - effectively 0% of
// real visitors. Deferring it keeps that code out of the initial bundle for
// everyone else. RootLayoutContent.tsx is a Server Component, so `ssr: false`
// has to live in this small client wrapper rather than at the call site.
export const DynamicAdminBar = dynamic(() => import('./index').then((m) => m.AdminBar), {
  ssr: false,
})
