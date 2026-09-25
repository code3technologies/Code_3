import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Public newsletter signup. Validates, de-duplicates, and stores the address
// in the Subscribers collection (public create access is off on the
// collection itself, so this route is the only way in).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const POST = async (req: Request) => {
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: real users never fill this hidden field; bots often do. Pretend
  // success so they don't retry.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined)

  try {
    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'subscribers',
        data: {
          email,
          source: clip(body.source, 60),
          locale: clip(body.locale, 5),
          signupPage: clip(body.page, 300),
        },
      })
    }
    // Same response whether new or already subscribed, so the endpoint can't be
    // used to check whether an address is on the list.
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
