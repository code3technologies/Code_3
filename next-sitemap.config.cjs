// Strip any trailing slash - NEXT_PUBLIC_SERVER_URL is set to "https://www.code3.ae/"
// (with a trailing slash) in Vercel, and appending "/pages-sitemap.xml" etc. to that
// produced double-slash URLs (e.g. ".../ae//pages-sitemap.xml") that Google's sitemap
// fetcher refuses to follow.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'
).replace(/\/+$/, '')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
      // OpenAI - ChatGPT
      { userAgent: 'GPTBot', allow: '/', disallow: '/admin/*' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/admin/*' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/admin/*' },
      // Anthropic - Claude
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/admin/*' },
      { userAgent: 'Claude-Web', allow: '/', disallow: '/admin/*' },
      { userAgent: 'anthropic-ai', allow: '/', disallow: '/admin/*' },
      // Google - Gemini / AI features (separate from standard Googlebot search indexing)
      { userAgent: 'Google-Extended', allow: '/', disallow: '/admin/*' },
      { userAgent: 'Googlebot', allow: '/', disallow: '/admin/*' },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/admin/*' },
      // Meta AI
      { userAgent: 'meta-externalagent', allow: '/', disallow: '/admin/*' },
      // Amazon (Alexa / AI features)
      { userAgent: 'Amazonbot', allow: '/', disallow: '/admin/*' },
      // Apple Intelligence
      { userAgent: 'Applebot-Extended', allow: '/', disallow: '/admin/*' },
      // Common Crawl - used to train many third-party AI models
      { userAgent: 'CCBot', allow: '/', disallow: '/admin/*' },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
