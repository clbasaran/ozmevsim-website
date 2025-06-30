/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com']
  },
  
  env: {
    SITE_NAME: 'Öz Mevsim Isı Sistemleri',
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://ozmevsim.com'
  },
  
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig; 