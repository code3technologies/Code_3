import { NextRequest, NextResponse } from 'next/server'

// Arabic pages live at /ar/* but are served by the exact same route files as
// their English counterparts (e.g. /ar/service/it-amc-dubai-uae -> service/[slug]).
//
// Locale is threaded through as a real `[locale]` route segment (not a request
// header) so pages can read it from `params` instead of calling `headers()` -
// `params` doesn't opt a route out of static/ISR rendering the way `headers()`
// does, which is what let every page on the site get stuck permanently dynamic.
// External URLs are unchanged: English stays unprefixed, Arabic keeps /ar/*.
//
// Live-preview requests (identified by Next's own draft-mode cookie, checked
// here directly rather than via the dynamic `draftMode()` API) are rewritten
// into a second, always-dynamic route tree under /preview-render/ instead of
// the public one, so ordinary visitors never share a route file with a
// dynamic-API call and stay eligible for static/ISR caching.
const PREVIEW_SEGMENT = 'preview-render'

// CODE3 no longer offers digital services. Their pages were deleted, so these
// URLs answer 410 Gone (removed on purpose) rather than 404, which tells
// Google to drop them from the index sooner. Covers the old short slugs and
// the -dubai-uae slugs, in English and Arabic.
const RETIRED_DIGITAL_SLUGS = [
  'seo',
  'mobile-app-development',
  'web-development',
  'ui-ux-design',
  'brand-identity-and-design',
]
const GONE_PATHS = new Set(
  RETIRED_DIGITAL_SLUGS.flatMap((slug) => [`/service/${slug}`, `/service/${slug}-dubai-uae`]),
)

const goneResponse = (isArabic: boolean) =>
  new NextResponse(
    isArabic
      ? '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>لم تعد هذه الخدمة متوفرة | CODE3</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;text-align:center"><h1>لم تعد هذه الخدمة متوفرة</h1><p>لم تعد CODE3 تقدم هذه الخدمة.</p><p><a href="/ar">الصفحة الرئيسية</a> · <a href="/ar/contact">تواصل معنا</a></p></body></html>'
      : '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Service no longer offered | CODE3</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;text-align:center"><h1>This service is no longer offered</h1><p>CODE3 no longer provides this service. Explore our IT, cybersecurity, cloud and AV solutions instead.</p><p><a href="/">Home</a> · <a href="/contact">Contact us</a></p></body></html>',
    { status: 410, headers: { 'content-type': 'text/html; charset=utf-8' } },
  )

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The preview tree is an internal rewrite target only, never a real
  // external URL - refuse direct hits outright.
  if (pathname === `/${PREVIEW_SEGMENT}` || pathname.startsWith(`/${PREVIEW_SEGMENT}/`)) {
    return new NextResponse(null, { status: 404 })
  }

  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/')
  const locale = isArabic ? 'ar' : 'en'
  const rest = isArabic ? pathname.replace(/^\/ar/, '') || '/' : pathname

  if (GONE_PATHS.has(rest.replace(/\/$/, ''))) return goneResponse(isArabic)

  const hasBypassCookie = request.cookies.has('__prerender_bypass')
  const base = hasBypassCookie ? `/${PREVIEW_SEGMENT}` : ''

  const url = request.nextUrl.clone()
  url.pathname = `${base}/${locale}${rest === '/' ? '' : rest}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|admin|_next|next/|favicon\\.ico|robots\\.txt|sitemap|.*\\..*).*)'],
}
