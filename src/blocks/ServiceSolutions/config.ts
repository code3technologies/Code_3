import type { Block } from 'payload'

export const ServiceSolutions: Block = {
  slug: 'serviceSolutions',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'Services',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Solutions We Deliver',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'We go beyond technology—we create future-ready solutions that empower businesses to perform better, stay secure, and grow faster. With expertise across IT, ICT, Cybersecurity, and AV, we are your single point of contact for all technology needs.',
      required: true,
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Service Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Service Description',
          required: true,
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Explore Service',
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button Link',
          defaultValue: '#',
        },
        {
          name: 'gridSpan',
          type: 'select',
          label: 'Column Width',
          options: [
            { label: '2 Columns out of 6, Tab(50%) and Desktop(3/1)', value: '2' },
            { label: '3 Columns in Tablet(50%) and 3 Columns in Desktop(50%) out of 6', value: '3' },
            { label: '6 Columns in Tablet(100%) and 3 Columns in Desktop(50%) out of 6', value: '2-3' },
          ],
          defaultValue: '2',
          required: true,
        },
      ],
      defaultValue: [
        {
          title: 'IT AMC',
          description:
            "Looking for a trusted partner for Annual IT maintenance contracts? We've got you covered.",
          buttonText: 'Explore Service',
          buttonLink: '#',
          gridSpan: '2',
        },
        {
          title: 'ICT & ELV Solutions',
          description:
            'Every project is custom-built around your requirements, ensuring scalability, reliability, and future-proofing.',
          buttonText: 'Explore Service',
          buttonLink: '#',
          gridSpan: '2',
        },
        {
          title: 'Cyber Security & Backup',
          description:
            'We deliver multi-layered protection so your business stays secure, compliant, and resilient.',
          buttonText: 'Explore Service',
          buttonLink: '#',
          gridSpan: '2',
        },
        {
          title: 'Audio Visual (AV) Solutions',
          description:
            'From small huddle spaces to enterprise-grade AV environments, we make communication clear, immersive, and effortless.',
          buttonText: 'Explore Service',
          buttonLink: '#',
          gridSpan: '3',
        },
        {
          title: 'Additional Digital Services',
          description:
            'From website design to SEO campaigns, we provide the digital tools your business needs to stand out and grow.',
          buttonText: 'Explore Service',
          buttonLink: '#',
          gridSpan: '2-3',
        },
      ],
    },
  ],
  interfaceName: 'ServiceSolutionsBlock',
}
