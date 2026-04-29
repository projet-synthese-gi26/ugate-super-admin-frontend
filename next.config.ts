import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  basePath: '/super-admin',
  assetPrefix: '/super-admin',
  images: {
    remotePatterns:[
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  output: 'standalone',
};

export default withNextIntl(nextConfig);