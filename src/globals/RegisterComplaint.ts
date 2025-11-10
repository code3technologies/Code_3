import { GlobalConfig } from 'payload'

export const RegisterComplaint: GlobalConfig = {
  slug: 'register-complaint',
  label: 'Register Complaint',
  admin: {
    group: 'Complaints and Enquiries',
    description: 'Submit a new complaint',
    hideAPIURL: true,
  },
  access: {
    read: async ({ req }) => req.user !== undefined,
    update: async ({ req }) => req.user !== undefined,
  },
  fields: [
    {
      name: 'formEmbed',
      type: 'ui',
      admin: {
        components: {
          Field: 'src/globals/RegisterComplaint/FormField#default',
        },
      },
    },
  ],
}
