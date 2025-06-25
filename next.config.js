/** @type {import('next').NextConfig} */
const nextConfig = {
  // HYBRID MODE: Cloudflare Pages + Edge Functions for APIs + Dynamic routing
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static hosting
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com']
  },
  env: {
    SITE_NAME: 'Öz Mevsim Isı Sistemleri',
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://ozmevsim.com'
  },
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true
};

module.exports = nextConfig; 