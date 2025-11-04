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
          name: 'url',
          type: 'text',
          label: 'Brand Website URL',
          admin: {
            description: 'Optional: Link to brand website',
          },
        },
      ],
      defaultValue: [
        {
          name: 'Microsoft',
          url: '',
        },
        {
          name: 'Wolfvision',
          url: '',
        },
        {
          name: 'Ubiquiti',
          url: '',
        },
      ],
    },
  ],
}