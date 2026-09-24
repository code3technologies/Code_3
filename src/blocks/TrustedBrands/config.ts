import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const TrustedBrands: Block = {
  slug: 'trustedBrands',
  interfaceName: 'TrustedBrandsBlock', 
  labels: {
    singular: 'Trusted Brands Block',
    plural: 'Trusted Brands Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Section Subtitle',
      localized: true,
      admin: {
        description: 'Optional short line shown under the title.',
      },
    },
    {
      name: 'displayStyle',
      type: 'select',
      label: 'Display Style',
      options: [
        { label: 'Scrolling Marquee (auto-animates)', value: 'scroll' },
        { label: 'Static Grid', value: 'grid' },
        { label: 'Horizontal Scroll (manual, no animation)', value: 'horizontalScroll' },
      ],
      defaultValue: 'scroll',
      admin: {
        description: 'Marquee auto-animates in a loop; static grid wraps into rows; horizontal scroll is a single row the user scrolls manually.',
      },
    },
    {
      name: 'gridColumns',
      type: 'select',
      label: 'Grid Columns (Desktop)',
      options: [
        { label: '4 columns', value: '4' },
        { label: '5 columns', value: '5' },
      ],
      defaultValue: '4',
      admin: {
        description: 'Only used when Display Style is Static Grid.',
        condition: (_, siblingData) => siblingData?.displayStyle === 'grid',
      },
    },
    {
      name: 'animationSpeed',
      type: 'select',
      label: 'Animation Speed',
      options: [
        {
          label: 'Slow',
          value: 'slow',
        },
        {
          label: 'Normal',
          value: 'normal',
        },
        {
          label: 'Fast',
          value: 'fast',
        },
      ],
      defaultValue: 'normal',
      admin: {
        description: 'Control the speed of the scrolling animation',
        condition: (_, siblingData) => siblingData?.displayStyle === 'scroll',
      },
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      label: 'Pause Animation on Hover',
      defaultValue: true,
      admin: {
        description: 'Pause the scrolling animation when users hover over the brands',
        condition: (_, siblingData) => siblingData?.displayStyle === 'scroll',
      },
    },
    {
      name: 'brands',
      type: 'array',
      label: 'Brand Logos',
      minRows: 3,
      maxRows: 100,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Brand Name',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Brand Logo',
          admin: {
            description: 'Optional — if left blank, the brand name is shown as styled text instead.',
          },
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Link Type',
          options: [
            {
              label: 'No Link',
              value: 'none',
            },
            {
              label: 'External URL',
              value: 'external',
            },
            {
              label: 'Service Page',
              value: 'service',
            },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Choose where this brand logo should link to',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'External Website URL',
          admin: {
            description: 'External link (only used if Link Type is "External URL")',
            condition: (_data, siblingData) => siblingData?.linkType === 'external',
          },
        },
        {
          name: 'servicePage',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Service Page',
          admin: {
            description: 'Select a service or sub-service page to link to',
            condition: (_data, siblingData) => siblingData?.linkType === 'service',
          },
          filterOptions: () => {
            return {
              serviceCategory: {
                not_equals: 'none',
              },
            }
          },
        },
      ],
      defaultValue: [
        {
          name: 'Microsoft',
          linkType: 'none',
        },
        {
          name: 'Wolfvision',
          linkType: 'none',
        },
        {
          name: 'Ubiquiti',
          linkType: 'none',
        },
      ],
    },
    ...ctaFields(
      'Partner With Us',
      'Interested in partnering with CODE3?',
    ),
  ],
}
