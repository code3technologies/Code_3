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

  const hasBypassCookie = request.cookies.has('__prerender_bypass')
  const base = hasBypassCookie ? `/${PREVIEW_SEGMENT}` : ''

  const url = request.nextUrl.clone()
  url.pathname = `${base}/${locale}${rest === '/' ? '' : rest}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|admin|_next|next/|favicon\\.ico|robots\\.txt|sitemap|.*\\..*).*)'],
}
