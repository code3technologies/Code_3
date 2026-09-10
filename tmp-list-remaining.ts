import { getPayload } from 'payload'
import config from '@payload-config'

const DONE_IDS = new Set([
  '6a451a1678829dcc3a08c157', // IT Outsourcing
  '6a451a0878829dcc3a08c134', // On-Call IT Support
  '6a451a2d78829dcc3a08c180', // Remote Support
  '6a451a5678829dcc3a08c1c6', // Desktop Support
  '6a451a4978829dcc3a08c1a3', // New Office IT Setup
  '6a451adbdd2b49614b9ebe53', // IT Relocation
])

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    locale: 'en',
    depth: 0,
    limit: 0,
    where: {
      and: [
        { serviceCategory: { not_equals: 'none' } },
        { _status: { equals: 'published' } },
        { parentService: { exists: true } },
      ],
    },
  })
  const rows = result.docs
    .filter((d: any) => d.parentService)
    .map((d: any) => ({ id: d.id, title: d.title, slug: d.slug, parentService: d.parentService }))

  const parentIds = [...new Set(rows.map((r: any) => r.parentService))]
  const parents: Record<string, string> = {}
  for (const pid of parentIds) {
    const p: any = await payload.findByID({ collection: 'pages', id: pid as string, locale: 'en', depth: 0 })
    parents[pid as string] = p.title
  }

  const remaining = rows.filter((r: any) => !DONE_IDS.has(r.id))
  const grouped: Record<string, any[]> = {}
  for (const r of remaining) {
    const pname = parents[r.parentService] || r.parentService
    grouped[pname] = grouped[pname] || []
    grouped[pname].push(r)
  }
  console.log(`Total remaining: ${remaining.length}`)
  for (const [pname, items] of Object.entries(grouped)) {
    console.log(`\n${pname} (${items.length}):`)
    items.forEach((it: any) => console.log(`  ${it.id}  ${it.title}  (${it.slug})`))
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
