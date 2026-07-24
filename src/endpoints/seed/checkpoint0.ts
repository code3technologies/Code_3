import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

async function upsertPage(slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    payload.logger.info(`— Updating page "${slug}"...`)
    const updated = await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
    return updated
  } else {
    payload.logger.info(`— Creating page "${slug}"...`)
    const created = await payload.create({
      collection: 'pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
    return created
  }
}

function simpleContentLayout(text: string) {
  return [
    {
      blockType: 'content' as const,
      columns: [
        {
          size: 'full' as const,
          richText: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  textFormat: 0,
                  children: [
                    { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  ]
}

// NOTE: media docs exist in the DB (hero-slide-1.jpg etc.) but their underlying files
// aren't present on local disk and Vercel Blob storage has no token configured in this
// environment, so the image itself 500s. HighImpactHero now hides the image container
// on load failure (see src/heros/HighImpact), so we still reference a real media doc
// (satisfies the required field) and it'll just start working once real storage/assets
// are wired up — no further seed change needed then.
const heroMedia = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'hero-slide-1.jpg' } },
  limit: 1,
})
const heroMediaId = heroMedia.docs[0]?.id

// --- Realistic parent + sub-service page hierarchy, to test the dynamic ServiceCatalog block ---
interface ParentSpec {
  slug: string
  title: string
  category: 'infrastructure' | 'digital'
  children: { slug: string; title: string; description: string }[]
}

const parentSpecs: ParentSpec[] = [
  {
    slug: 'managed-it-service',
    title: 'Managed IT Service',
    category: 'infrastructure',
    children: [
      { slug: 'it-amc', title: 'IT AMC', description: 'Annual maintenance contracts covering ongoing support and upkeep of your IT systems.' },
      { slug: 'on-call-it-support', title: 'On Call IT Support', description: 'On-demand technical assistance whenever an issue comes up.' },
      { slug: 'remote-support', title: 'Remote Support', description: 'Troubleshooting and fixes delivered remotely without a site visit.' },
    ],
  },
  {
    slug: 'network-infrastructure',
    title: 'Network Infrastructure',
    category: 'infrastructure',
    children: [
      { slug: 'lan-and-wan', title: 'LAN and WAN', description: 'Design and deployment of local and wide area networks.' },
      { slug: 'vpn', title: 'VPN', description: 'Secure, encrypted remote access to your business network.' },
      { slug: 'enterprise-wi-fi', title: 'Enterprise Wi-Fi', description: 'Reliable, secure wireless coverage across your facility.' },
    ],
  },
  {
    slug: 'cybersecurity-solutions',
    title: 'Cyber Security',
    category: 'infrastructure',
    children: [
      { slug: 'security-operations-center', title: 'Security Operations Center (SOC)', description: 'Centralized, continuous monitoring and response to security threats.' },
      { slug: 'vulnerability-assessment', title: 'Vulnerability Assessment And Penetration Testing', description: 'Identifying and testing security weaknesses before attackers do.' },
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    category: 'digital',
    children: [], // intentionally empty, to verify the "no sub-services yet" empty state
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'digital',
    children: [
      { slug: 'user-research', title: 'User Research', description: "Understanding your users' needs before we design a single screen." },
      { slug: 'wireframing', title: 'Wireframing & Prototyping', description: 'Structured, testable prototypes that validate ideas before development.' },
    ],
  },
]

for (const parent of parentSpecs) {
  const parentDoc = await upsertPage(parent.slug, {
    title: parent.title,
    slug: parent.slug,
    slugLock: false,
    serviceCategory: parent.category,
    _status: 'published',
    hero: { type: 'none', HeroText: parent.title },
    layout: simpleContentLayout(`${parent.title} overview.`),
    meta: { title: parent.title, description: `${parent.title} services from CODE3.` },
  })

  for (const child of parent.children) {
    await upsertPage(child.slug, {
      title: child.title,
      slug: child.slug,
      slugLock: false,
      serviceCategory: parent.category,
      parentService: parentDoc.id,
      _status: 'published',
      hero: { type: 'none', HeroText: child.title },
      layout: simpleContentLayout(child.description),
      meta: { title: child.title, description: child.description },
    })
  }
}

// --- Homepage ---
await upsertPage('home', {
  title: 'Home',
  slug: 'home',
  slugLock: false,
  _status: 'published',
  hero: {
    type: 'highImpact',
    HeroText: 'Technology infrastructure that keeps your business running, secure, and growing.',
    subText:
      'CODE3 delivers end-to-end IT infrastructure, cybersecurity, and digital solutions for businesses across the UAE.',
    media: heroMediaId,
    links: [
      { link: { type: 'custom', label: 'Book a Free Consultation', appearance: 'default', url: '/contact' } },
      { link: { type: 'custom', label: 'Explore Services', appearance: 'outline', url: '/services' } },
    ],
  },
  layout: [
    {
      blockType: 'faq',
      badge: 'FAQS',
      title: 'Frequently asked questions',
      subtitle: 'A few common questions about working with CODE3.',
      faqs: [
        {
          question: 'What services does CODE3 provide?',
          answer:
            'Managed IT services, cybersecurity, cloud and Microsoft solutions, network infrastructure, and digital services including web and app development.',
        },
        {
          question: 'Do you support businesses across the whole UAE?',
          answer: 'Yes — our engineers and support teams operate across Dubai and the wider UAE.',
        },
        {
          question: 'How do I get started?',
          answer: 'Book a free consultation and our team will schedule an initial assessment call.',
        },
      ],
    },
  ],
  meta: {
    title: 'CODE3 Technologies | IT Infrastructure, Cybersecurity & Digital Solutions',
    description:
      'CODE3 delivers end-to-end IT infrastructure, cybersecurity, and digital solutions for businesses across the UAE.',
  },
})

// --- Dedicated /services page: the real home for the new ServiceCatalog block ---
await upsertPage('services', {
  title: 'Services',
  slug: 'services',
  slugLock: false,
  _status: 'published',
  hero: { type: 'none', HeroText: 'Services' },
  layout: [
    {
      blockType: 'serviceCatalog',
      titleHighlight: 'Infrastructure',
      title: 'Services & Solutions',
      serviceType: 'infrastructure',
    },
    {
      blockType: 'serviceCatalog',
      titleHighlight: 'Digital',
      title: 'Services & Solutions',
      serviceType: 'digital',
    },
  ],
  meta: {
    title: 'Services | CODE3 Technologies',
    description: 'Explore CODE3’s full range of infrastructure and digital services.',
  },
})

payload.logger.info('Checkpoint 0 seeded successfully!')
process.exit(0)
