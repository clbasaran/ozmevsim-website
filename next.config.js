/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development mode: Disable static export for full Next.js functionality
  output: process.env.NODE_ENV === 'production' ? undefined : undefined, // Disable static export completely during development
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
  reactStrictMode: false, // Disable strict mode to prevent double rendering
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [] // Clear any external packages
  }
};

module.exports = nextConfig; 