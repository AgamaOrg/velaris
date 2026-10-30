import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import { legacyRedirects } from './src/config/redirects'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return legacyRedirects
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default withPayload(nextConfig)
