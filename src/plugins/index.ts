import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { isAdmin } from '@/access/isAdmin'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      upload: true,
    },
    formOverrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      slug: 'enquiries',
      admin: {
        group: 'Complaints and Enquiries',
        defaultColumns: ['submittedBy', 'email', 'phone', 'status', 'createdAt'],
        hidden: ({ user }) => user?.role !== 'admin',
      },
      access: {
        read: isAdmin,
        update: isAdmin,
        create: () => true,
        delete: isAdmin,
      },
      labels: {
        singular: 'Enquiry',
        plural: 'Enquiries',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            interface SubmissionItem {
              field: string
              value: string
            }

            const submissionData = (data?.submissionData || []) as SubmissionItem[]

            const nameField = submissionData.find(
              (item) => item.field === 'fullname' || item.field === 'name',
            )
            const emailField = submissionData.find((item) => item.field === 'email')
            const phoneField = submissionData.find(
              (item) =>
                item.field === 'phone' || item.field === 'mobile' || item.field === 'contact',
            )

            data.submittedBy = nameField?.value || 'Anonymous'
            data.email = emailField?.value || ''
            data.phone = phoneField?.value || ''

            return data
          },
        ],
        afterChange: [
          async ({ doc, req, operation }) => {
            if (operation === 'create') {
              try {
                const { generateEmailHTML } = await import('../utilities/generateEmailHTML')

                // Extract submission data for email content
                const submissionData = (doc.submissionData || []) as Array<{
                  field: string
                  value: any
                }>

                const getFieldValue = (fieldName: string) => {
                  const field = submissionData.find((item) => item.field === fieldName)
                  return field?.value || 'N/A'
                }

                const userName = getFieldValue('fullname') || getFieldValue('name')
                const userEmail = getFieldValue('email')
                const userPhone = getFieldValue('phone') || getFieldValue('contact')
                const userCountry = getFieldValue('country')
                const userSubject = getFieldValue('subject')
                const userMessage = getFieldValue('message')

                // Email to Admin
                const adminEmailHTML = generateEmailHTML({
                  headline: 'New Contact Form Submission',
                  content: `
                    <h2>New Contact Enquiry Received</h2>
                    <p>A new contact form submission has been received with ID: <strong>${doc.id}</strong></p>
                    
                    <table class="info-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Name:</td><td style="padding: 10px;">${userName}</td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;">${userEmail}</td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Phone:</td><td style="padding: 10px;">${userCountry} ${userPhone}</td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Subject:</td><td style="padding: 10px;">${userSubject}</td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Status:</td><td style="padding: 10px;">${doc.status}</td></tr>
                    </table>
                    
                    <p><strong>Message:</strong></p>
                    <p style="padding: 15px; background-color: #f9f9f9; border-left: 3px solid #C90E1D;">${userMessage}</p>
                  `,
                  cta: {
                    label: 'View Complete Enquiry',
                    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/enquiries/${doc.id}`,
                  },
                })

                await req.payload.sendEmail({
                  to: 'enquiries@code3.ae',
                  subject: `New Contact: ${userName} - ${userSubject}`,
                  html: adminEmailHTML,
                })

                // Email to Customer
                const customerEmailHTML = generateEmailHTML({
                  headline: 'Thank You for Contacting Code 3',
                  content: `
                    <h2>We Have Received Your Message</h2>
                    <p>Dear <strong>${userName}</strong>,</p>
                    <p>Thank you for reaching out to Code 3. We have successfully received your enquiry and our team will review it shortly.</p>
                    
                    <table class="info-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Enquiry ID:</td><td style="padding: 10px;"><strong>${doc.id}</strong></td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Subject:</td><td style="padding: 10px;">${userSubject}</td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Status:</td><td style="padding: 10px;"><span style="color: #C90E1D; font-weight: bold;">${doc.status}</span></td></tr>
                      <tr style="border-bottom: 1px solid #e0e0e0;"><td style="padding: 10px; font-weight: bold;">Received:</td><td style="padding: 10px;">${new Date(doc.createdAt).toLocaleString()}</td></tr>
                    </table>
                    
                    <p><strong>Your Message:</strong></p>
                    <p style="padding: 15px; background-color: #f9f9f9; border-left: 3px solid #C90E1D;">${userMessage}</p>
                    
                    <p>We will get back to you at <strong>${userEmail}</strong> as soon as possible.</p>
                  `,
                })

                await req.payload.sendEmail({
                  to: userEmail,
                  subject: `Thank You for Contacting Code 3`,
                  html: customerEmailHTML,
                })
              } catch (err) {
                console.error('Error sending enquiry emails:', err)
                console.error('Error details:', {
                  message: err instanceof Error ? err.message : 'Unknown error',
                  stack: err instanceof Error ? err.stack : undefined,
                  name: err instanceof Error ? err.name : undefined,
                })
              }
            }
            return doc
          },
        ],
      },
      fields: ({ defaultFields }) => {
        return [
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'form') {
              return {
                ...field,
                admin: {
                  ...field.admin,
                  readOnly: true,
                  position: 'sidebar',
                },
              } as typeof field
            }

            if ('name' in field && field.name === 'submissionData') {
              return {
                ...field,
                admin: {
                  components: {
                    Field: 'src/collections/Enquiries/SubmissionDataView#SubmissionDataView',
                  },
                },
              } as typeof field
            }
            return field
          }),
          {
            name: 'status',
            type: 'select',
            label: 'Status',
            required: true,
            defaultValue: 'pending',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Reviewed', value: 'reviewed' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Rejected', value: 'rejected' },
            ],
            admin: {
              position: 'sidebar',
              description: 'Current status of this enquiry',
            },
          },
          {
            name: 'submittedBy',
            type: 'text',
            label: 'Name',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          },
          {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          },
        ]
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
]
