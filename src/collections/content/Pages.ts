import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Public can read published pages
      if (!user) return { _status: { equals: 'published' } }
      return true
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'legacyUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Original WordPress URL for redirect mapping',
      },
    },
    // SEO fields
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'noindex',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  timestamps: true,
}
