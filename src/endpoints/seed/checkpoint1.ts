import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

async function upsertPage(slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    payload.logger.info(`— Updating page "${slug}"...`)
    return payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
  } else {
    payload.logger.info(`— Creating page "${slug}"...`)
    return payload.create({
      collection: 'pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
  }
}

// Reused as a stand-in for every required upload field below. The underlying file isn't on
// disk locally (see checkpoint0.ts), but IconMedia/HighImpactHero already hide failed image
// loads gracefully, so this just satisfies Payload's required-field validation.
const heroMedia = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'hero-slide-1.jpg' } },
  limit: 1,
})
const mediaId = heroMedia.docs[0]?.id

if (!mediaId) {
  throw new Error('Expected media doc "hero-slide-1.jpg" to exist — run checkpoint0 first.')
}

// --- About Us ---
await upsertPage('about-us', {
  title: 'About Us',
  slug: 'about-us',
  slugLock: false,
  _status: 'published',
  hero: { type: 'none', HeroText: 'About Us' },
  layout: [
    {
      blockType: 'aboutUsBanner',
      title: 'ABOUT US',
      subtitle: 'Your trusted technology partner across the UAE',
      description:
        'CODE3 has spent over a decade helping businesses build, secure, and modernize their IT infrastructure — from network foundations to full digital transformation.',
      links: [{ link: { type: 'custom', label: 'Get in Touch', appearance: 'default', url: '/contact' } }],
      desktopImages: [
        { image: mediaId, alt: 'CODE3 team at work', aspectRatio: 'aspect-6/3', hasMarginBottom: false },
        { image: mediaId, alt: 'CODE3 office', aspectRatio: 'aspect-6/3', hasMarginBottom: true },
      ],
      mobileImages: [
        { image: mediaId, alt: 'CODE3 team at work', aspectRatio: 'aspect-4/3' },
        { image: mediaId, alt: 'CODE3 office', aspectRatio: 'aspect-video' },
      ],
    },
    {
      blockType: 'missionAndValues',
      badge: 'MISSION, VISION & VALUES',
      title: 'What drives us forward',
      subtitle: 'The principles behind every project we deliver.',
      missionCard: {
        icon: mediaId,
        title: 'OUR MISSION',
        content: 'To deliver reliable, secure technology infrastructure that lets our clients focus on growing their business.',
      },
      visionCard: {
        icon: mediaId,
        title: 'OUR VISION',
        content: 'To be the UAE’s most trusted technology partner for businesses of every size.',
      },
      valuesCard: {
        icon: mediaId,
        title: 'VALUES',
        content: 'Integrity, technical excellence, and long-term partnership over one-off transactions.',
      },
    },
    {
      blockType: 'whyChooseUsAbout',
      badge: 'WHY CHOOSE US',
      title: 'Why businesses choose CODE3',
      subtitle: 'A team that treats your infrastructure like it’s our own.',
      features: [
        { icon: mediaId, title: 'Certified engineers', description: 'A team certified across Microsoft, Cisco, and leading security platforms.' },
        { icon: mediaId, title: 'Rapid response', description: 'On-call support with response times built around your business hours.' },
        { icon: mediaId, title: 'End-to-end delivery', description: 'From network design to cybersecurity to custom software, under one roof.' },
        { icon: mediaId, title: 'Proven track record', description: 'A decade of long-term client relationships across the UAE.' },
      ],
    },
    {
      blockType: 'cta',
      showLogo: false,
      title: 'Ready to talk about your infrastructure?',
      description: 'Book a free consultation with our team.',
      links: [{ link: { type: 'custom', label: 'Contact Us', appearance: 'default', url: '/contact' } }],
    },
  ],
  meta: {
    title: 'About Us | CODE3 Technologies',
    description: 'CODE3 has spent over a decade helping businesses build, secure, and modernize their IT infrastructure across the UAE.',
  },
})

// --- Careers ---
await upsertPage('careers', {
  title: 'Careers',
  slug: 'careers',
  slugLock: false,
  _status: 'published',
  hero: { type: 'none', HeroText: 'Careers' },
  layout: [
    {
      blockType: 'careers',
      title: 'CAREERS',
      subtitle: 'Build your career with CODE3',
      description: 'We’re a team of engineers, designers, and support specialists solving real infrastructure problems for real businesses. Come build with us.',
      buttonText: 'View Open Roles',
      teamImages: [
        { image: mediaId, hasTopMargin: false, isVisibleOnMobile: true, isVisibleOnTablet: true, isVisibleOnDesktop: true },
        { image: mediaId, hasTopMargin: true, isVisibleOnMobile: false, isVisibleOnTablet: true, isVisibleOnDesktop: true },
      ],
    },
    {
      blockType: 'whyWorkWithUs',
      badge: 'WHY WORK WITH US',
      title: 'A place to do your best work',
      subtitle: 'What it’s actually like on the team.',
      features: [
        { icon: mediaId, title: 'Real ownership', description: 'You own projects end-to-end, from client kickoff to delivery.', colSpan: '4', iconAlignment: 'left' },
        { icon: mediaId, title: 'Growth & certification', description: 'We fund the certifications and training that keep your skills current.', colSpan: '4', iconAlignment: 'left' },
        { icon: mediaId, title: 'Collaborative teams', description: 'Small, senior teams — no bureaucracy between you and the work.', colSpan: '4', iconAlignment: 'left' },
        { icon: mediaId, title: 'Competitive benefits', description: 'Healthcare, flexible leave, and performance-based bonuses.', colSpan: '4', iconAlignment: 'left' },
      ],
    },
    {
      blockType: 'currentOpenings',
      badge: 'OPEN ROLES',
      title: 'Current openings',
      subtitle: 'Filter by department to find your fit.',
      showFilter: true,
      departments: [
        { value: 'it-support', label: 'IT & Support' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'development', label: 'Development' },
        { value: 'design', label: 'Design' },
      ],
      jobListings: [
        {
          department: 'IT & Support',
          title: 'Network Support Engineer',
          category: 'Full-time',
          categoryColor: 'blue',
          description: 'Support and maintain client network infrastructure, from LAN/WAN to enterprise Wi-Fi deployments.',
          location: 'Dubai, UAE',
          type: 'Full-time',
          viewJobText: 'View Job',
        },
        {
          department: 'Cybersecurity',
          title: 'SOC Analyst',
          category: 'Full-time',
          categoryColor: 'pink',
          description: 'Monitor client environments for threats and coordinate incident response as part of our SOC team.',
          location: 'Dubai, UAE',
          type: 'Full-time',
          viewJobText: 'View Job',
        },
        {
          department: 'Development',
          title: 'Full-Stack Developer',
          category: 'Full-time',
          categoryColor: 'green',
          description: 'Build and ship web applications for clients across industries using React, Next.js, and Node.',
          location: 'Dubai, UAE',
          type: 'Full-time',
          viewJobText: 'View Job',
        },
        {
          department: 'Design',
          title: 'UI/UX Designer',
          category: 'Contract',
          categoryColor: 'orange',
          description: 'Design research-backed interfaces for client web and mobile products, from wireframe to prototype.',
          location: 'Remote',
          type: 'Contract',
          viewJobText: 'View Job',
        },
      ],
    },
  ],
  meta: {
    title: 'Careers | CODE3 Technologies',
    description: 'Build your career with CODE3 — open roles across IT support, cybersecurity, development, and design.',
  },
})

// --- Contact ---
await upsertPage('contact', {
  title: 'Contact',
  slug: 'contact',
  slugLock: false,
  _status: 'published',
  hero: { type: 'none', HeroText: 'Contact' },
  layout: [
    {
      blockType: 'contactUs',
      heading: 'CONTACT US',
      subtitle: 'Let’s talk about your project',
      description: 'Tell us a bit about what you need and our team will get back to you within one business day.',
      formFields: {
        fullNameLabel: 'Full name',
        fullNamePlaceholder: 'Enter your full name',
        emailLabel: 'Email',
        emailPlaceholder: 'you@company.com',
        phoneLabel: 'Phone number',
        phonePlaceholder: '555 000 000',
        subjectLabel: 'Subject',
        messageLabel: 'Message',
        messagePlaceholder: 'Leave us a message...',
        privacyText: 'You agree to our friendly privacy policy.',
        privacyLink: '/privacy-policy',
        submitButtonText: 'Send message',
      },
      countryOptions: [
        { value: '+971', label: 'UAE' },
        { value: '+91', label: 'IND' },
      ],
      subjectOptions: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'sales', label: 'Sales Inquiry' },
        { value: 'partnership', label: 'Partnership' },
      ],
    },
  ],
  meta: {
    title: 'Contact | CODE3 Technologies',
    description: 'Get in touch with CODE3 — tell us about your project and we’ll get back to you within one business day.',
  },
})

// --- Industries We Serve ---
const industryGroups: { badge: string; title: string; subtitle: string; cards: { title: string; content: string }[] }[] = [
  {
    badge: 'GOVERNMENT & PUBLIC SECTOR',
    title: 'Government & Public Sector',
    subtitle: 'Secure, compliant infrastructure for public institutions.',
    cards: [
      { title: 'Federal & Local Government', content: 'Infrastructure and security aligned with government compliance standards.' },
      { title: 'Public Utilities', content: 'Resilient network and monitoring systems for critical utility operations.' },
      { title: 'Municipalities', content: 'Managed IT and support for municipal offices and public services.' },
    ],
  },
  {
    badge: 'FINANCIAL SERVICES',
    title: 'Banking & Financial Services',
    subtitle: 'High-security infrastructure for regulated institutions.',
    cards: [
      { title: 'Banking', content: 'Network security and compliance-ready infrastructure for financial institutions.' },
      { title: 'Insurance', content: 'Secure data handling and continuity planning for insurance providers.' },
      { title: 'Fintech', content: 'Scalable infrastructure and security for fast-growing fintech platforms.' },
    ],
  },
  {
    badge: 'HEALTHCARE',
    title: 'Healthcare & Life Sciences',
    subtitle: 'Reliable systems where uptime and privacy both matter.',
    cards: [
      { title: 'Hospitals & Clinics', content: 'Network infrastructure and cybersecurity built around patient data protection.' },
      { title: 'Pharmaceuticals', content: 'Secure, compliant IT environments for research and distribution operations.' },
      { title: 'Diagnostic Labs', content: 'Dependable connectivity and support for lab and imaging systems.' },
    ],
  },
  {
    badge: 'HOSPITALITY & RETAIL',
    title: 'Hospitality & Retail',
    subtitle: 'Infrastructure that keeps guest and customer experience running.',
    cards: [
      { title: 'Hotels & Resorts', content: 'Enterprise Wi-Fi, AV, and network infrastructure across large properties.' },
      { title: 'Retail Chains', content: 'Multi-site network support and POS-ready infrastructure.' },
      { title: 'Restaurants & F&B', content: 'Reliable connectivity and support for single and multi-location outlets.' },
    ],
  },
  {
    badge: 'CONSTRUCTION & REAL ESTATE',
    title: 'Construction & Real Estate',
    subtitle: 'Connected infrastructure from job site to head office.',
    cards: [
      { title: 'Real Estate Developers', content: 'Structured cabling and smart-building infrastructure for new developments.' },
      { title: 'Facilities Management', content: 'Ongoing IT and AV support across managed properties.' },
      { title: 'Construction Firms', content: 'Site connectivity and IT support for active construction projects.' },
    ],
  },
]

await upsertPage('industries-we-serve', {
  title: 'Industries We Serve',
  slug: 'industries-we-serve',
  slugLock: false,
  _status: 'published',
  hero: { type: 'none', HeroText: 'Industries We Serve' },
  layout: [
    {
      blockType: 'serviceDetailBanner',
      serviceBadge: 'INDUSTRIES',
      serviceName: 'Industries We Serve',
      title: 'Technology solutions built around your industry',
      description: 'From government to hospitality, we tailor infrastructure, security, and digital solutions to the compliance and operational needs of each sector we work with.',
      showGradientLine: false,
    },
    {
      blockType: 'trustedBrands',
      title: 'Trusted by leading organizations across the UAE',
      animationSpeed: 'normal',
      pauseOnHover: true,
      brands: [
        { name: 'Microsoft', logo: mediaId, linkType: 'none' },
        { name: 'Wolfvision', logo: mediaId, linkType: 'none' },
        { name: 'Ubiquiti', logo: mediaId, linkType: 'none' },
        { name: 'Cisco', logo: mediaId, linkType: 'none' },
      ],
    },
    ...industryGroups.map((group) => ({
      blockType: 'missionAndValues' as const,
      badge: group.badge,
      title: group.title,
      subtitle: group.subtitle,
      missionCard: { icon: mediaId, title: group.cards[0].title, content: group.cards[0].content },
      visionCard: { icon: mediaId, title: group.cards[1].title, content: group.cards[1].content },
      valuesCard: { icon: mediaId, title: group.cards[2].title, content: group.cards[2].content },
    })),
    {
      blockType: 'faq',
      badge: 'FAQS',
      title: 'Frequently asked questions',
      subtitle: 'Common questions about working with CODE3 across industries.',
      faqs: [
        { question: 'Do you work with our specific industry?', answer: 'We support government, financial services, healthcare, hospitality, retail, construction, and more — reach out and we’ll confirm fit.' },
        { question: 'Can you meet our compliance requirements?', answer: 'Yes — we design infrastructure and security around the specific compliance standards your industry requires.' },
      ],
    },
    {
      blockType: 'cta',
      showLogo: false,
      title: 'Let’s discuss your industry’s needs',
      description: 'Book a free consultation with our team.',
      links: [{ link: { type: 'custom', label: 'Contact Us', appearance: 'default', url: '/contact' } }],
    },
  ],
  meta: {
    title: 'Industries We Serve | CODE3 Technologies',
    description: 'CODE3 tailors infrastructure, security, and digital solutions to the compliance and operational needs of every industry we serve.',
  },
})

payload.logger.info('Checkpoint 1 seeded successfully!')
process.exit(0)
