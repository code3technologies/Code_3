import { permanentRedirect } from 'next/navigation'

// Forced dynamic (not because this page does anything slow itself - it's a
// plain redirect - but so it never competes for a build-worker slot alongside
// the DB-querying pages below; the build has repeatedly timed out under a
// slow shared MongoDB Atlas connection when too many pages are generated at
// once, and this one costs nothing to exclude.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale?: string }>
}

// Permanent (308), not temporary: every page links to /posts from the menu,
// and a temporary redirect tells Google not to pass that link's value on.
// Keeps the locale, so /ar/posts goes to the Arabic listing, not the English.
export default async function Page({ params }: Args) {
  const { locale } = await params
  permanentRedirect(`${locale === 'ar' ? '/ar' : ''}/posts/page/1`)
}
