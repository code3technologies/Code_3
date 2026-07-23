import type { Block } from 'payload'

export const Code3BlogPreview: Block = {
  slug: 'code3BlogPreview',
  interfaceName: 'Code3BlogPreviewBlock',
  labels: {
    singular: 'Blog Preview (Real Posts)',
    plural: 'Blog Previews (Real Posts)',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FROM THE BLOG',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Insights on IT, security, and digital growth',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      admin: {
        description: 'How many recent posts to show.',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Optional — leave empty to show the most recent posts from any category.',
      },
    },
  ],
}
