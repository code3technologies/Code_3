import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'name',
    group: 'Complaints and Enquiries',
    defaultColumns: ['name', 'jobTitle', 'email', 'status', 'createdAt'],
  },
  access: {
    read: isAdmin,
    // Public - applicants aren't logged in.
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            const { generateEmailHTML } = await import('../utilities/generateEmailHTML')

            const resumeId = typeof doc.resume === 'string' ? doc.resume : doc.resume?.id
            const coverLetterId =
              typeof doc.coverLetter === 'string' ? doc.coverLetter : doc.coverLetter?.id

            const resumeUrl = resumeId
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/job-application-attachments/${resumeId}`
              : null
            const coverLetterUrl = coverLetterId
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/job-application-attachments/${coverLetterId}`
              : null

            const adminEmailHTML = generateEmailHTML({
              headline: 'New Job Application',
              content: `
                <h2>New Application Received</h2>
                <p>A new application was submitted for: <strong>${doc.jobTitle}</strong></p>

                <table class="info-table">
                  <tr><td>Name:</td><td>${doc.name}</td></tr>
                  <tr><td>Email:</td><td>${doc.email}</td></tr>
                  <tr><td>Phone:</td><td>${doc.phone}</td></tr>
                  <tr><td>Current Location:</td><td>${doc.location}</td></tr>
                  <tr><td>Employment Status:</td><td>${doc.employmentStatus}</td></tr>
                  ${resumeUrl ? `<tr><td>Resume:</td><td><a href="${resumeUrl}">View Resume</a></td></tr>` : ''}
                  ${coverLetterUrl ? `<tr><td>Cover Letter:</td><td><a href="${coverLetterUrl}">View Cover Letter</a></td></tr>` : ''}
                </table>
              `,
              cta: {
                label: 'View Application',
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/job-applications/${doc.id}`,
              },
            })

            await req.payload.sendEmail({
              to: 'hr@code3.ae',
              subject: `New Application: ${doc.jobTitle} - ${doc.name}`,
              html: adminEmailHTML,
            })

            if (doc.email) {
              const applicantEmailHTML = generateEmailHTML({
                headline: 'Application Received - Code 3',
                content: `
                  <h2>Thank You for Applying</h2>
                  <p>Dear <strong>${doc.name}</strong>,</p>
                  <p>Thank you for applying for the <strong>${doc.jobTitle}</strong> position at CODE3 Technologies. We've received your application and our team will review it shortly.</p>
                  <p>If your profile matches what we're looking for, we'll reach out to you at <strong>${doc.email}</strong> to discuss next steps.</p>
                `,
              })

              await req.payload.sendEmail({
                to: doc.email,
                subject: `Application Received - ${doc.jobTitle}`,
                html: applicantEmailHTML,
              })
            }
          } catch (err) {
            console.error('Error sending job application emails:', err)
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Current Location',
      required: true,
    },
    {
      name: 'employmentStatus',
      type: 'select',
      label: 'Current Employment Status',
      required: true,
      options: [
        { label: 'Employed', value: 'employed' },
        { label: 'Unemployed', value: 'unemployed' },
        { label: 'Freelancer / Self-Employed', value: 'freelancer' },
        { label: 'Student', value: 'student' },
      ],
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'job-application-attachments',
      label: 'Resume',
      required: true,
    },
    {
      name: 'coverLetter',
      type: 'upload',
      relationTo: 'job-application-attachments',
      label: 'Cover Letter',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
