import type { Block } from 'payload'

export const ServiceDetailBanner: Block = {
  slug: 'serviceDetailBanner',
  fields: [
    {
      name: 'serviceBadge',
      type: 'text',
      label: 'Service Badge Text For Sub-Services',
      localized: true,
    },
    {
      name: 'serviceName',
      type: 'text',
      label: 'Service Name',
      localized: true,
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title for Services  ',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      required: true,
    },
    {
      name: 'showGradientLine',
      type: 'checkbox',
      label: 'Show Gradient Line',
      defaultValue: true,
    },
    {
      name: 'animatedBackground',
      type: 'checkbox',
      label: 'Animated Dark Background',
      defaultValue: false,
      admin: {
        description: 'Use the homepage-style animated dark-red hero background (drifting glow, light streaks, floating icons) instead of the plain white banner.',
      },
    },
    {
      name: 'backLinkLabel',
      type: 'text',
      label: 'Back Link Label',
      localized: true,
      admin: {
        description: 'e.g. "Cyber Security" — shown as a small link back to the parent service category.',
      },
    },
    {
      name: 'backLinkUrl',
      type: 'text',
      label: 'Back Link URL',
    },
    {
      name: 'cardBadge',
      type: 'text',
      label: 'Side Card Badge (optional)',
      localized: true,
      admin: {
        description: 'Optional card shown on the right side of the banner. Leave the heading empty to hide it entirely.',
      },
    },
    {
      name: 'cardHeading',
      type: 'text',
      label: 'Side Card Heading (optional)',
      localized: true,
    },
    {
      name: 'cardDescription',
      type: 'textarea',
      label: 'Side Card Description (optional)',
      localized: true,
    },
    {
      name: 'cardLinkText',
      type: 'text',
      label: 'Side Card Link Text (optional)',
      localized: true,
    },
    {
      name: 'cardLinkHref',
      type: 'text',
      label: 'Side Card Link URL (optional)',
    },
  ],
  interfaceName: 'ServiceDetailBannerBlock',
}
