/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages için doğru ayarlar
  experimental: {
    // Cloudflare runtime optimizasyonları
    serverComponentsExternalPackages: []
  },
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
  // Cloudflare Pages için
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig; 