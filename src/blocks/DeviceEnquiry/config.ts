import type { Block } from 'payload'

export const DeviceEnquiry: Block = {
  slug: 'deviceEnquiry',
  interfaceName: 'DeviceEnquiryBlock',
  labels: {
    singular: 'Device Enquiry Form',
    plural: 'Device Enquiry Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'deviceLabel',
      type: 'text',
      label: 'Enquiry Reference Label',
      required: true,
      admin: {
        description:
          'Included in the submitted enquiry, e.g. "Yealink Video Conferencing Devices".',
      },
    },
  ],
}
