'use client'
import { usePathname } from 'next/navigation'

export function LocaleToggle({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/')
  const enPath = isArabic ? pathname.replace(/^\/ar/, '') || '/' : pathname
  const arPath = isArabic ? pathname : `/ar${pathname === '/' ? '' : pathname}`

  return (
    <div
      className={`inline-flex items-center rounded-full border border-foreground bg-background p-0.5 text-xs font-semibold sm:text-sm ${className}`}
    >
      {/* Plain <a> tags (not next/link) so switching locale always forces a full
          page navigation. Middleware rewrites both /ar and non-/ar paths to the
          same underlying route, so Next's client-side soft navigation can reuse
          the previous locale's cached RSC payload and appear "stuck" until a
          hard reload — this sidesteps that entirely. */}
      <a
        href={enPath}
        data-locale-link="en"
        aria-current={!isArabic ? 'page' : undefined}
        aria-label="Switch to English"
        className={`rounded-full px-3 py-1 transition-all duration-300 ${
          !isArabic ? 'bg-primary_red text-white' : 'text-foreground hover:text-primary_red'
        }`}
      >
        EN
      </a>
      <a
        href={arPath}
        aria-current={isArabic ? 'page' : undefined}
        aria-label="التبديل إلى العربية"
        className={`rounded-full px-3 py-1 transition-all duration-300 ${
          isArabic ? 'bg-primary_red text-white' : 'text-foreground hover:text-primary_red'
        }`}
      >
        العربية
      </a>
    </div>
  )
}
