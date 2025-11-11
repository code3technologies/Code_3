import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig } from 'payload'

export const ComplaintAttachments: CollectionConfig = {
  slug: 'complaint-attachments',
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'application/msword'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
  },
  admin: {
    group: 'Complaints and Enquiries',
    defaultColumns: ['filename', 'createdAt'],
    description: 'Images and files uploaded with complaint forms',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: async ({ req }) => req.user !== undefined,
    create: async ({ req }) => req.user !== undefined,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Description of the image for accessibility',
      },
    },
  ],
}
