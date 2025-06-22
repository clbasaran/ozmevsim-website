/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Pages + Functions for APIs
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
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig; 