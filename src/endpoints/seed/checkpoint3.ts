import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
const homeDoc = existing.docs[0]

if (!homeDoc) {
  throw new Error('Expected "home" page to exist — run checkpoint0 first.')
}

const currentLayout = Array.isArray(homeDoc.layout) ? homeDoc.layout : []
const hasServicesBlock = currentLayout.some((block) => block.blockType === 'services')

if (hasServicesBlock) {
  payload.logger.info('— Home page already has a "services" block, leaving layout untouched.')
} else {
  const servicesBlock = {
    blockType: 'services' as const,
    badge: 'OUR SERVICES',
    title: 'Your Technology Partner in Every Step',
    subtitle:
      'From infrastructure to digital growth, explore the full range of services CODE3 delivers for businesses across the UAE.',
    maxServices: 6,
  }

  // Insert right after the hero, before the FAQ block.
  const newLayout = [servicesBlock, ...currentLayout]

  await payload.update({
    collection: 'pages',
    id: homeDoc.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { layout: newLayout } as any,
    context: { disableRevalidate: true },
  })
  payload.logger.info('— Added "services" block to home page layout.')
}

payload.logger.info('Checkpoint 3 (homepage services section) seeded successfully!')
process.exit(0)
