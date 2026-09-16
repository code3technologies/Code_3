import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Utility route — force-revalidates the Data Cache entry for every published
// page (revalidatePath + page_<slug> tag), plus the pages-sitemap tag.
// Needed because content writes made via `payload run` scripts pass
// `context: { disableRevalidate: true }` and never touch a live server's
// cache, and Vercel's Data Cache persists across deployments by design — so
// a redeploy alone does not surface already-correct database content.
//
// Paginated via ?from=&size= to stay within a serverless function's time
// budget. Requires ?key=<PAYLOAD_SECRET>. Kept in the repo (unlike earlier
// one-off tmp- versions) so this doesn't need to be re-added each time.

const getPagePath = (doc: { slug?: string | null; serviceCategory?: string | null }) => {
  if (doc.slug === 'home') return '/'
  const isServicePage = !!doc.serviceCategory && doc.serviceCategory !== 'none'
  return isServicePage ? `/service/${doc.slug}` : `/${doc.slug}`
}

export const GET = async (req: Request) => {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  if (key !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const from = Number(url.searchParams.get('from') || '0')
  const size = Number(url.searchParams.get('size') || '50')

  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: size,
    page: Math.floor(from / size) + 1,
    depth: 0,
    locale: 'en',
  })

  const revalidated: string[] = []
  for (const doc of res.docs as any[]) {
    const path = getPagePath(doc)
    revalidatePath(path)
    revalidateTag(`page_${doc.slug}`)
    revalidated.push(path)
  }
  revalidateTag('pages-sitemap')

  // Posts are a much smaller collection (dozens, not hundreds), so unlike
  // pages above they're always fully revalidated in one pass rather than
  // paginated via from/size.
  const postsRes = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    pagination: false,
    depth: 0,
    locale: 'en',
  })
  const postsRevalidated: string[] = []
  for (const doc of postsRes.docs as any[]) {
    const path = `/posts/${doc.slug}`
    revalidatePath(path)
    revalidateTag(`post_${doc.slug}`)
    postsRevalidated.push(path)
  }

  return NextResponse.json({
    ok: true,
    from,
    size,
    totalDocs: res.totalDocs,
    totalPages: res.totalPages,
    page: res.page,
    revalidatedCount: revalidated.length,
    revalidated,
    postsRevalidatedCount: postsRevalidated.length,
    postsRevalidated,
    at: Date.now(),
  })
}
