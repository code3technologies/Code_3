import type { Block } from 'payload'

export const ServicesHero: Block = {
  slug: 'servicesHero',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'OUR SERVICES',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Your Technology, Secured & Simplified',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'See Our Services',
      required: true,
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
    },
    {
      name: 'image1',
      type: 'upload',
      relationTo: 'media',
      label: 'First Image',
      required: true,
    },
    {
      name: 'image2',
      type: 'upload',
      relationTo: 'media',
      label: 'Second Image',
      required: true,
    },
  ],
  interfaceName: 'ServicesHeroBlock',
}
