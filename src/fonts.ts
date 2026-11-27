import localFont from 'next/font/local'
import { Noto_Sans_Arabic } from 'next/font/google'

export const caMechano = localFont({
  src: '../public/fonts/camechano-condensed.woff2',
  variable: '--font-ca-mechano',
  display: 'swap',
})

// The site's default body/heading font. Previously loaded via a hand-written
// @font-face in globals.css, which has no size-adjusted fallback - the browser
// rendered with a generic sans-serif first, then swapped to Open Sauce Sans
// once its .ttf files downloaded, reflowing every piece of text on the page
// simultaneously (a large, measured CLS regression). next/font/local
// auto-generates a metrics-matched fallback face so the swap is visually inert.
export const openSauceSans = localFont({
  src: [
    { path: '../public/fonts/open-sauce/OpenSauceSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/open-sauce/OpenSauceSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/open-sauce/OpenSauceSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/open-sauce/OpenSauceSans-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/open-sauce/OpenSauceSans-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sauce',
  display: 'swap',
})

export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
  // Not preloaded: English pages never use it, and preloading it there
  // competed with the hero for bandwidth on mobile. Arabic pages still fetch
  // it as soon as Arabic text renders.
  preload: false,
})