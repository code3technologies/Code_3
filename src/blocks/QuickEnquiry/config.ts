import type { Block } from 'payload'

export const QuickEnquiry: Block = {
  slug: 'quickEnquiry',
  interfaceName: 'QuickEnquiryBlock',
  labels: {
    singular: 'Quick Enquiry Form',
    plural: 'Quick Enquiry Forms',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Quick Enquiry',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      defaultValue: 'Get a callback from our team within 1 minute.',
      localized: true,
    },
    {
      name: 'formOnDark',
      type: 'checkbox',
      label: 'Glass Form (for a dark hero background)',
      defaultValue: false,
      admin: {
        description: 'Use a translucent glass style for the form so it sits well over an animated dark hero.',
      },
    },
    {
      name: 'promoEnabled',
      type: 'checkbox',
      label: 'Show Promo Card Below Form',
      defaultValue: false,
    },
    {
      name: 'promoBadge',
      type: 'text',
      label: 'Promo Badge Text',
      defaultValue: 'LIMITED TIME OFFER',
      localized: true,
      admin: { condition: (_, siblingData) => Boolean(siblingData?.promoEnabled) },
    },
    {
      name: 'promoTitle',
      type: 'text',
      label: 'Promo Title',
      localized: true,
      admin: { condition: (_, siblingData) => Boolean(siblingData?.promoEnabled) },
    },
    {
      name: 'promoTagline',
      type: 'text',
      label: 'Promo Tagline',
      localized: true,
      admin: {
        description: 'Short line right under the title, e.g. "Yes, you heard it right."',
        condition: (_, siblingData) => Boolean(siblingData?.promoEnabled),
      },
    },
    {
      name: 'promoDescription',
      type: 'textarea',
      label: 'Promo Description',
      localized: true,
      admin: { condition: (_, siblingData) => Boolean(siblingData?.promoEnabled) },
    },
    {
      name: 'promoFeatures',
      type: 'array',
      label: 'Promo Feature Bullets',
      maxRows: 4,
      fields: [{ name: 'text', type: 'text', localized: true, required: true }],
      admin: {
        description: 'Short scannable bullets shown with checkmarks, e.g. "No credit card required".',
        condition: (_, siblingData) => Boolean(siblingData?.promoEnabled),
      },
    },
    {
      name: 'promoNote',
      type: 'text',
      label: 'Promo Fine Print',
      localized: true,
      admin: {
        description: 'Small disclaimer line, e.g. "No annual commitment needed for the trial."',
        condition: (_, siblingData) => Boolean(siblingData?.promoEnabled),
      },
    },
    {
      name: 'promoCtaLabel',
      type: 'text',
      label: 'Promo Button Label',
      defaultValue: 'Claim Your Free Trial',
      localized: true,
      admin: { condition: (_, siblingData) => Boolean(siblingData?.promoEnabled) },
    },
    {
      name: 'promoCtaUrl',
      type: 'text',
      label: 'Promo Button URL',
      defaultValue: '/contact',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.promoEnabled) },
    },
    {
      name: 'sidebarImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Sidebar Image (optional)',
      admin: {
        description:
          'Shown below the form (and below the promo card, if enabled). Fills the empty space in the sidebar column — portrait or square images work best, matching the ~360px form width.',
      },
    },
  ],
}
