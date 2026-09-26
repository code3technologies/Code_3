import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel's Deployment Protection blocks Next's own server-side image-optimization
    // fetch on protected preview deployments (it's an unauthenticated internal request,
    // same as any other route). Disabling optimization there makes the browser fetch
    // images directly instead, which correctly carries the viewer's Vercel auth session.
    // Production isn't protection-walled, so it keeps full optimization.
    unoptimized: process.env.VERCEL_ENV === 'preview',
    // Serve modern formats when the browser supports them - meaningfully smaller
    // than JPEG/PNG at the same visual quality.
    formats: ['image/avif', 'image/webp'],
    // Must list every quality value passed to <Image quality={...}> (Next 15
    // requires an explicit allowlist). 82 is ImageMedia's default.
    qualities: [75, 82, 100],
    // Every media URL is cache-busted with the asset's updatedAt timestamp
    // (see getMediaUrl), so a stale cached optimized image is never served -
    // safe to cache aggressively.
    minimumCacheTTL: 2678400,
    // Next's image optimizer blocks SVG by default (it can contain scripts) - some
    // uploaded partner/brand logos are SVGs, so allow them. The CSP still prevents
    // any embedded script in an SVG from executing.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        hostname: 'localhost',
        protocol: 'http',
      },
      {
        // Every preview deployment gets its own unique *.vercel.app hostname (not knowable
        // at build time), and getClientSideURL() now points media URLs at that hostname
        // instead of production's when running on a preview — this allowlists all of them.
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  // Default is 60s. The shared MongoDB Atlas M0 tier this project's build
  // connects to has enough latency variance that even a single reasonably
  // busy page (the homepage in particular, which fetches header nav data,
  // multiple trusted-brands rows, the case-studies strip, and the stats
  // block) occasionally needs a second or third retry to land under 60s -
  // Next hard-fails the whole build if all retries miss the timeout, rather
  // than just that one page. This buys real headroom for that variance
  // without changing what's cached or how - see the [locale] page/service/
  // device route comments for the separate, complementary fix that already
  // reduced how many pages need to be generated at build time at all.
  staticPageGenerationTimeout: 180,
  experimental: {
    // Every dynamic route's rendered output depends on the x-locale header set by
    // middleware, but the client Router Cache keys entries by the post-rewrite
    // pathname only (both /ar/x and /x resolve to the same route internally) - so
    // without this, a soft navigation can silently reuse a cached page from the
    // wrong locale. Forcing dynamic entries to always be treated as stale makes
    // every client-side navigation re-fetch, which correctly re-applies the
    // request's locale every time.
    staleTimes: {
      dynamic: 0,
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
