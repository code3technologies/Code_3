import canUseDOM from './canUseDOM'

// On preview deployments, VERCEL_PROJECT_PRODUCTION_URL always points at production's
// domain, regardless of which deployment is actually serving the request. That leaks
// production's URL into preview-rendered pages (e.g. absolute media URLs), so preview
// deployments end up depending on production having the exact same data/code. Prefer
// the current deployment's own URL (VERCEL_URL) when running on a preview instead.
function getVercelDeploymentURL(): string | undefined {
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return undefined
}

export const getServerSideURL = () => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || getVercelDeploymentURL() || 'http://localhost:3000'
  // Strip any trailing slash so `${getServerSideURL()}/path` never produces a
  // double slash (production's env value ends in "/", which broke og:image URLs).
  return url.replace(/\/+$/, '')
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getVercelDeploymentURL() || process.env.NEXT_PUBLIC_SERVER_URL || ''
}
