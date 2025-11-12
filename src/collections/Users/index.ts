import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
    unlock: () => true,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  auth: {
    maxLoginAttempts: 0,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token || ''
        const user = args?.user as any
        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset/${token}`
        
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #d7213c; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin: 20px 0;
                }
                .footer { color: #666; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Reset Your Password</h1>
                <p>Hello ${user.name || user.email},</p>
                <p>You requested to reset your password for CODE3 Admin Panel.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetURL}" class="button">Reset Password</a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetURL}</p>
                <p class="footer">
                  This link will expire in 1 hour.<br>
                  If you didn't request this, please ignore this email.
                </p>
              </div>
            </body>
          </html>
        `
      },
      generateEmailSubject: () => 'Reset Your Password - CODE3',
    },
    tokenExpiration: 3600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Client',
          value: 'client',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        read: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        create: ({ req }) => req.user?.role === 'admin',
      },
      hooks: {
        beforeChange: [
          async ({ req, value, originalDoc }) => {
            if (req.user?.role !== 'admin') {
              return originalDoc?.role || 'client'
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
