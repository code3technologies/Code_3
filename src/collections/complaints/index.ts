import { CollectionConfig } from 'payload'

export const Complaints: CollectionConfig = {
  slug: 'complaints',
  admin: {
    useAsTitle: 'id',
    group: 'Complaints and Enquiries',
    defaultColumns: ['id', 'createdAt', 'status'],
  },
  access: {
    read: async ({ req }) => req.user !== undefined,
    create: async ({ req }) => req.user !== undefined,
    update: async ({ req }) => req.user !== undefined,
    delete: async ({ req }) => req.user !== undefined,
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        try {
          if (!id) return

          const complaint = await req.payload.findByID({
            collection: 'complaints',
            id,
          })

          if (complaint.attachments && Array.isArray(complaint.attachments)) {
            for (const attachment of complaint.attachments) {
              const attachmentId = typeof attachment === 'string' ? attachment : attachment.id
              
              if (attachmentId) {
                await req.payload.delete({
                  collection: 'complaint-attachments',
                  id: attachmentId,
                })
              }
            }
          }
        } catch (error) {
          console.error('Error deleting attachments:', error)
        }
      },
    ],
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'submissionData',
      type: 'json',
      label: 'Form Submission Data',
      required: false,
      admin: {
        components: {
          Field: 'src/collections/Complaints/SubmissionDataField',
        },
      },
    },
    {
      name: 'attachments',
      type: 'upload', 
      relationTo: 'complaint-attachments',
      label: 'Attachments',
      hasMany: true,
      admin: {
        components: {
          Field: 'src/collections/Complaints/AttachmentsField',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
