import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { revalidateCaseStudy, revalidateCaseStudyDelete } from './hooks/revalidateCaseStudy'

// Real client projects (challenge -> solution -> results). Nothing appears on
// the site (listing page, sitemap) until at least one is published, so this
// can ship empty and be filled in from the admin as projects are approved.
export const CaseStudies: CollectionConfig<'case-studies'> = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    industry: true,
    clientName: true,
    heroImage: true,
    publishedAt: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'industry', 'clientName', 'updatedAt'],
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'clientName',
      type: 'text',
      admin: {
        description: 'Leave blank to keep the client anonymous (shown as e.g. "A UAE logistics company").',
      },
    },
    {
      name: 'clientDescriptor',
      type: 'text',
      localized: true,
      admin: {
        description: 'Shown when the client is anonymous, e.g. "A UAE logistics company".',
      },
    },
    { name: 'industry', type: 'text', localized: true, admin: { description: 'e.g. Healthcare, Logistics' } },
    { name: 'clientLogo', type: 'upload', relationTo: 'media' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'One or two sentences shown on the listing page and in search results.' },
    },
    { name: 'challenge', type: 'textarea', required: true, localized: true },
    { name: 'solution', type: 'textarea', required: true, localized: true },
    {
      name: 'results',
      type: 'array',
      labels: { singular: 'Result', plural: 'Results' },
      admin: { description: 'Measurable outcomes, e.g. value "40%" and label "fewer support tickets".' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Service pages delivered on this project. Each links back from the case study.',
      },
      filterOptions: () => ({ serviceCategory: { not_equals: 'none' } }),
    },
    {
      name: 'testimonialQuote',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optional client quote.' },
    },
    { name: 'testimonialAuthor', type: 'text', admin: { description: 'e.g. "IT Manager, Client Name".' } },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    ...slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCaseStudy],
    afterDelete: [revalidateCaseStudyDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 25,
  },
}
