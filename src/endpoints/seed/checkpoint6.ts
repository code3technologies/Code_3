import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
const homeDoc = existing.docs[0]

if (!homeDoc) {
  throw new Error('Expected "home" page to exist — run checkpoint0 first.')
}

const currentLayout = Array.isArray(homeDoc.layout) ? homeDoc.layout : []
const hasStats = currentLayout.some((block) => block.blockType === 'stats')

if (hasStats) {
  payload.logger.info('— Home page already has a "stats" block, leaving layout untouched.')
} else {
  const statsBlock = {
    blockType: 'stats' as const,
    stats: [
      { icon: 'users', value: 30, suffix: '+', label: 'Experienced Professionals' },
      { icon: 'handshake', value: 50, suffix: '+', label: 'Technology Partners' },
      { icon: 'check', value: 1500, suffix: '+', label: 'Projects Successfully Delivered' },
      { icon: 'smile', value: 400, suffix: '+', label: 'Satisfied Customers' },
    ],
  }

  const lastWhyChooseIndex = currentLayout
    .map((block) => block.blockType)
    .lastIndexOf('whyChooseUsAbout')

  const newLayout =
    lastWhyChooseIndex === -1
      ? [...currentLayout, statsBlock]
      : [
          ...currentLayout.slice(0, lastWhyChooseIndex + 1),
          statsBlock,
          ...currentLayout.slice(lastWhyChooseIndex + 1),
        ]

  await payload.update({
    collection: 'pages',
    id: homeDoc.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { layout: newLayout } as any,
    context: { disableRevalidate: true },
  })
  payload.logger.info('— Added "stats" section after Why Choose CODE3.')
}

payload.logger.info('Checkpoint 6 seeded successfully!')
process.exit(0)
