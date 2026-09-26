// This route never touches draftMode(), so the preview tree just re-exports
// the public version unchanged - see src/middleware.ts for why this tree exists.
export { default, metadata } from '../../../[locale]/case-studies/page'

export const dynamic = 'force-dynamic'
