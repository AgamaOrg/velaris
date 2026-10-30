import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 hours
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 min lockout
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  access: {
    // Only admins can manage users via admin panel
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Users can read their own record
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
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
      defaultValue: 'sales-agent',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Content Editor', value: 'content-editor' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales Manager', value: 'sales-manager' },
        { label: 'Sales Agent', value: 'sales-agent' },
        { label: 'Compliance', value: 'compliance' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'team',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
