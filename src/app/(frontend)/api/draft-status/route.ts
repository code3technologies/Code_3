import { draftMode } from 'next/headers'

// Tiny, always-dynamic endpoint so AdminBar can find out whether draft mode is
// on without the root layout itself calling draftMode() - that would force
// every page on the site to render dynamically. See src/middleware.ts and
// src/app/(frontend)/_shared/RootLayoutContent.tsx for the full picture.
export const dynamic = 'force-dynamic'

export async function GET() {
  const { isEnabled } = await draftMode()
  return Response.json({ isEnabled })
}
