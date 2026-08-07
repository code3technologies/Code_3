import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig } from 'payload'

export const JobApplicationAttachments: CollectionConfig = {
  slug: 'job-application-attachments',
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  admin: {
    group: 'Complaints and Enquiries',
    defaultColumns: ['filename', 'createdAt'],
    description: 'Resumes and cover letters uploaded with job applications',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    // Public - applicants aren't logged in.
    read: () => true,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [],
}
