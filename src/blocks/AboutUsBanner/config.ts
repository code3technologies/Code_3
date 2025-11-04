import { linkGroup } from '@/fields/linkGroup'
import type { Block } from 'payload'

export const AboutUsBanner: Block = {
  slug: 'aboutUsBanner',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'ABOUT US',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 1,
      },
    }),
    {
      name: 'mobileImages',
      type: 'array',
      label: 'Mobile Images',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
        },
        {
          name: 'aspectRatio',
          type: 'select',
          label: 'Aspect Ratio',
          options: [
            { label: '4:3', value: 'aspect-4/3' },
            { label: '16:9 (Video)', value: 'aspect-video' },
            { label: 'Square', value: 'aspect-square' },
          ],
          defaultValue: 'aspect-4/3',
        },
      ],
      defaultValue: [
        {
          alt: 'Business meeting',
          aspectRatio: 'aspect-4/3',
        },
        {
          alt: 'Professional team',
          aspectRatio: 'aspect-video',
        },
      ],
    },
    {
      name: 'desktopImages',
      type: 'array',
      label: 'Desktop Images',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
        },
        {
          name: 'aspectRatio',
          type: 'select',
          label: 'Aspect Ratio',
          options: [
            { label: '6:3', value: 'aspect-6/3' },
            { label: '4:3', value: 'aspect-4/3' },
            { label: '16:9', value: 'aspect-video' },
            { label: 'Square', value: 'aspect-square' },
          ],
          defaultValue: 'aspect-6/3',
        },
        {
          name: 'hasMarginBottom',
          type: 'checkbox',
          label: 'Has Bottom Margin',
          defaultValue: false,
        },
      ],
      defaultValue: [
        {
          aspectRatio: 'aspect-6/3',
          hasMarginBottom: false,
        },
        {
          aspectRatio: 'aspect-6/3',
          hasMarginBottom: true,
        },
      ],
    },
  ],
  interfaceName: 'AboutUsBannerBlock',
}