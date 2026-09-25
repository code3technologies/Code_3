import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

// Newsletter signups from the footer and blog. Created only through
// /api/subscribe (which validates and de-duplicates), never directly by the
// public - hence create: false here.
export const Subscribers: CollectionConfig<'subscribers'> = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  access: {
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Where they signed up, e.g. footer or blog-post.' },
    },
    { name: 'locale', type: 'text' },
    { name: 'signupPage', type: 'text', admin: { description: 'Page URL at signup.' } },
  ],
  timestamps: true,
}
