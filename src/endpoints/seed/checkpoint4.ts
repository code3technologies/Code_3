import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
const homeDoc = existing.docs[0]

if (!homeDoc) {
  throw new Error('Expected "home" page to exist — run checkpoint0 first.')
}

const currentLayout = Array.isArray(homeDoc.layout) ? homeDoc.layout : []

// Swap the old scroll-jacking "services" block (added in checkpoint3) for the same
// tabbed/bordered ServiceCatalog block already used on the dedicated /services page —
// this is the block the user has been reviewing and approved.
const layoutWithoutOldServices = currentLayout.filter((block) => block.blockType !== 'services')

const catalogBlock = {
  blockType: 'serviceCatalog' as const,
  titleHighlight: 'Our Services',
  title: '& Solutions',
  serviceType: 'infrastructure' as const,
}

const newLayout = [catalogBlock, ...layoutWithoutOldServices]

await payload.update({
  collection: 'pages',
  id: homeDoc.id,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { layout: newLayout } as any,
  context: { disableRevalidate: true },
})

payload.logger.info('— Replaced homepage "services" block with "serviceCatalog" (Our Services & Solutions).')
payload.logger.info('Checkpoint 4 seeded successfully!')
process.exit(0)
