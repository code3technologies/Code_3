import type { Block } from 'payload'

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
      required: true,
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
      },
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      label: 'Pause Animation on Hover',
      defaultValue: true,
      admin: {
        description: 'Pause the scrolling animation when users hover over the brands',
      },
    },
    {
      name: 'brands',
      type: 'array',
      label: 'Brand Logos',
      minRows: 3,
      maxRows: 20,
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
          required: true,
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
            condition: (data, siblingData) => siblingData?.linkType === 'external',
          },
        },
        {
          name: 'servicePage',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Service Page',
          admin: {
            description: 'Select a service or sub-service page to link to',
            condition: (data, siblingData) => siblingData?.linkType === 'service',
          },
          filterOptions: ({ relationTo }) => {
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
  ],
}
