import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig } from 'payload'

export const Complaints: CollectionConfig = {
  slug: 'complaints',
  admin: {
    useAsTitle: 'id',
    group: 'Complaints and Enquiries',
    defaultColumns: ['createdBy', 'createdAt', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false

      if (user.role === 'admin') {
        return true
      }

      if (user.role === 'client') {
        return {
          createdBy: {
            equals: user.id,
          },
        }
      }

      return false
    },
    create: async ({ req }) => req.user !== undefined,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            const { generateEmailHTML } = await import('../../utilities/generateEmailHTML')

            // Extract submission data for email content
            const submissionData = (doc.submissionData || []) as Array<{
              field: string
              value: any
            }>
            const getFieldValue = (fieldName: string) => {
              const field = submissionData.find((item) => item.field === fieldName)
              return field?.value || 'N/A'
            }

            const userName =
              getFieldValue('companyname') || getFieldValue('name') || getFieldValue('fullname')
            const userEmail = getFieldValue('email')
            const userPhone = getFieldValue('phone') || getFieldValue('contact')
            const customerNumber = getFieldValue('customernumber')
            const userMessage =
              getFieldValue('complaint') || getFieldValue('message') || getFieldValue('description')

            // Email to Admin
            const adminEmailHTML = generateEmailHTML({
              headline: 'New Complaint Registered',
              content: `
                <h2>New Complaint Alert</h2>
                <p>A new complaint has been registered with ID: <strong>${doc.id}</strong></p>
                
                <table class="info-table">
                  <tr><td>Name:</td><td>${userName}</td></tr>
                  <tr><td>Email:</td><td>${userEmail}</td></tr>
                  <tr><td>Phone:</td><td>${userPhone}</td></tr>
                  <tr><td>Status:</td><td>${doc.status}</td></tr>
                </table>
                
                <p><strong>Complaint Details:</strong></p>
                <p style="padding: 15px; background-color: #f9f9f9; border-left: 3px solid #C90E1D;">${userMessage}</p>
              `,
              cta: {
                label: 'View Complete Complaint',
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/complaints/${doc.id}`,
              },
            })

            await req.payload.sendEmail({
              to: 'enquiries@code3.ae',
              subject: `New Complaint: ${userName} - ${doc.id}`,
              html: adminEmailHTML,
            })

            // Email to Customer
            if (req.user && req.user.email) {
              const customerEmailHTML = generateEmailHTML({
                headline: 'Complaint Received - Code 3',
                content: `
                  <h2>Your Complaint Has Been Registered</h2>
                  <p>Dear <strong>${userName}</strong>,</p>
                  <p>Thank you for reaching out to Code 3. We have successfully received your complaint and our team is reviewing it.</p>
                  
                  <table class="info-table">
                    <tr><td>Complaint ID:</td><td><strong>${doc.id}</strong></td></tr>
                    <tr><td>Status:</td><td><span style="color: #C90E1D; font-weight: bold;">${doc.status}</span></td></tr>
                    <tr><td>Registered:</td><td>${new Date(doc.createdAt).toLocaleString()}</td></tr>
                  </table>
                  
                  <p><strong>Your Submitted Details:</strong></p>
                  <p style="padding: 15px; background-color: #f9f9f9; border-left: 3px solid #C90E1D;">${userMessage}</p>
                  
                  <p>We will review your complaint and get back to you at <strong>${userEmail}</strong> shortly.</p>
                `,
              })

              await req.payload.sendEmail({
                to: req.user.email,
                subject: `Complaint Received - Ref: ${doc.id}`,
                html: customerEmailHTML,
              })
            }
          } catch (err) {
            console.error('Error sending complaint emails:', err)
          }
        }
        return doc
      },
    ],
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create') {
          if (req.user) {
            data.createdBy = req.user.id
          } else {
            console.error('No user in request! Cannot set createdBy')
          }
        }
        return data
      },
    ],
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
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
