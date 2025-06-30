export const APP_CONFIG = {
  name: 'Öz Mevsim',
  version: '2.0.0',
  description: 'Öz Mevsim Isı Sistemleri Mühendislik - Enterprise Web Sitesi',
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'ozmevsim_token',
    refreshTokenKey: 'ozmevsim_refresh_token',
    tokenExpiry: 3600000, // 1 saat
    adminPath: '/admin',
    loginPath: '/admin/login',
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  seo: {
    defaultTitle: 'Öz Mevsim Isı Sistemleri Mühendislik',
    defaultDescription: 'Profesyonel ısı sistemleri, iklimlendirme ve enerji çözümleri',
    defaultKeywords: 'ısı sistemleri, iklimlendirme, enerji, mühendislik, istanbul',
    defaultImage: '/images/og-image.jpg',
  },
  social: {
    facebook: 'https://facebook.com/ozmevsim',
    instagram: 'https://instagram.com/ozmevsim',
    linkedin: 'https://linkedin.com/company/ozmevsim',
    twitter: 'https://twitter.com/ozmevsim',
  },
  contact: {
    phone: '+90 212 XXX XX XX',
    email: 'info@ozmevsim.com',
    address: 'İstanbul, Türkiye',
  },
  features: {
    enableBlog: true,
    enableChat: true,
    enableAnalytics: true,
    enable3DViewer: true,
    enableIoTDashboard: true,
  },
} as const;

export type AppConfig = typeof APP_CONFIG; 