import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'

const IDS = [
  { id: '6a451a8278829dcc3a08c237', name: 'IT Asset Management' },
  { id: '6a451a7678829dcc3a08c214', name: 'Data Recovery (Managed IT)' },
  { id: '690a37d96580cb8832e7c6b5', name: 'Preventive Maintenance & System Health Checks' },
  { id: '690a315d86876d015b7595ae', name: '24/7 Remote & On-Site IT Support' },
]

async function main() {
  const payload = await getPayload({ config })
  const out: Record<string, any> = {}
  for (const item of IDS) {
    const doc: any = await payload.findByID({ collection: 'pages', id: item.id, locale: 'en', depth: 0 })
    out[item.name] = { id: item.id, slug: doc.slug, hero: doc.hero, meta: doc.meta, layout: doc.layout }
  }
  fs.writeFileSync('tmp-batch-en.json', JSON.stringify(out, null, 2))
  for (const [name, doc] of Object.entries(out)) {
    console.log(name, '->', (doc as any).layout.map((b: any) => b.blockType).join(', '))
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
