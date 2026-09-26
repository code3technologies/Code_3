import { redirect } from 'next/navigation'

// Forced dynamic (not because this page does anything slow itself - it's a
// plain redirect - but so it never competes for a build-worker slot alongside
// the DB-querying pages below; the build has repeatedly timed out under a
// slow shared MongoDB Atlas connection when too many pages are generated at
// once, and this one costs nothing to exclude.
export const dynamic = 'force-dynamic'

export default function Page() {
  redirect('/posts/page/1')
}