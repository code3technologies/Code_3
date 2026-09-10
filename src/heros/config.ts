import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Photo Impact',
          value: 'photoImpact',
        },
        {
          label: 'Soft Impact',
          value: 'softImpact',
        },
        {
          label: 'Vivid Impact',
          value: 'vividImpact',
        },
        {
          label: 'Split Impact',
          value: 'splitImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      localized: true,
    },
    {
      name: "HeroText",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Text to display in the hero section",
        placeholder: "Enter hero text here",
      },
      label: "Hero Text",
    },
    {
      name: 'subText',
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description: 'Subtext to display in the hero section',
        placeholder: 'Enter subtext here',
      },
      label: 'Subtext',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'photoImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'carouselImages',
      type: 'array',
      label: 'Additional Carousel Images',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Optional extra slides shown alongside the main image above, rotating automatically.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  label: false,
}
