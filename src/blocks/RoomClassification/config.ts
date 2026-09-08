import type { Block } from 'payload'
import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'

export const RoomClassification: Block = {
  slug: 'roomClassification',
  interfaceName: 'RoomClassificationBlock',
  labels: {
    singular: 'Room Classification Showcase',
    plural: 'Room Classification Showcases',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'ROOM CLASSIFICATION',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Intro Description',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()],
      }),
      admin: {
        description: 'e.g. "Experience the seamless integration of Yealink devices with Microsoft Teams Rooms..." — bold key phrases inline.',
      },
    },
    {
      name: 'rooms',
      type: 'array',
      label: 'Room Types',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', label: 'Tab Label', localized: true, required: true, admin: { description: 'e.g. "Standard Meeting Room"' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Room Photo (optional)',
          admin: { description: 'Leave empty to show the fallback icon panel below instead.' },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Fallback Icon (used when no photo is set)',
          options: [...ICON_PRESET_OPTIONS],
        },
        {
          name: 'caption',
          type: 'textarea',
          label: 'Caption (optional)',
          localized: true,
          admin: { description: 'Short line shown under the visual, e.g. "Best for huddle rooms · 55″–75″".' },
        },
      ],
    },
  ],
}
