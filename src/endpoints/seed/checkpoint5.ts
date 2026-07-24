import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
const homeDoc = existing.docs[0]

if (!homeDoc) {
  throw new Error('Expected "home" page to exist — run checkpoint0 first.')
}

const heroMedia = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'hero-slide-1.jpg' } },
  limit: 1,
})
const mediaId = heroMedia.docs[0]?.id
if (!mediaId) {
  throw new Error('Expected media doc "hero-slide-1.jpg" to exist — run checkpoint0 first.')
}

const currentLayout = Array.isArray(homeDoc.layout) ? homeDoc.layout : []
const hasWhyChooseUs = currentLayout.some((block) => block.blockType === 'whyChooseUsAbout')

if (hasWhyChooseUs) {
  payload.logger.info('— Home page already has a "whyChooseUsAbout" block, leaving layout untouched.')
} else {
  const whyChooseUsBlock = {
    blockType: 'whyChooseUsAbout' as const,
    badge: 'WHY CHOOSE US',
    title: 'Why Choose CODE3',
    subtitle:
      'The technical depth to get it right and the business reliability to keep it running — reasons clients stay with us for years, not projects.',
    features: [
      {
        icon: mediaId,
        title: 'Certified technical expertise',
        description: 'Engineers certified across Microsoft, Cisco, and leading security platforms — not generalists.',
      },
      {
        icon: mediaId,
        title: 'End-to-end delivery',
        description: 'Infrastructure, cybersecurity, and digital under one roof, so nothing falls through the cracks between vendors.',
      },
      {
        icon: mediaId,
        title: 'Rapid, reliable response',
        description: 'On-call support with response times built around your business hours, not ours.',
      },
      {
        icon: mediaId,
        title: 'A decade of trust across the UAE',
        description: 'Long-term client relationships built on showing up and following through, project after project.',
      },
    ],
  }

  // Insert right after the last serviceCatalog block, before FAQ/CTA.
  const lastCatalogIndex = currentLayout
    .map((block) => block.blockType)
    .lastIndexOf('serviceCatalog')

  const newLayout =
    lastCatalogIndex === -1
      ? [...currentLayout, whyChooseUsBlock]
      : [
          ...currentLayout.slice(0, lastCatalogIndex + 1),
          whyChooseUsBlock,
          ...currentLayout.slice(lastCatalogIndex + 1),
        ]

  await payload.update({
    collection: 'pages',
    id: homeDoc.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { layout: newLayout } as any,
    context: { disableRevalidate: true },
  })
  payload.logger.info('— Added "Why Choose CODE3" section after Our Services & Solutions.')
}

payload.logger.info('Checkpoint 5 seeded successfully!')
process.exit(0)
