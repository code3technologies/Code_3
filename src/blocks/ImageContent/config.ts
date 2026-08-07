import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ImageContent: Block = {
  slug: 'imageContent',
  interfaceName: 'ImageContentBlock',
  labels: {
    singular: 'Image + Content',
    plural: 'Image + Content Blocks',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (optional)',
      localized: true,
      admin: {
        description: 'Optional H1 rendered above the text column, e.g. for the first section on a page.',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      label: 'Content',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
  ],
}
