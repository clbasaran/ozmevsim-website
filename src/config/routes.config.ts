export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/hakkimizda',
  SERVICES: '/hizmetler',
  PRODUCTS: '/urunler',
  PRODUCT_DETAIL: '/urunler/[id]',
  PROJECTS: '/projeler',
  REFERENCES: '/referanslar',
  CONTACT: '/iletisim',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/[slug]',
  FAQ: '/sss',
  CATALOG: '/katalog',
  APPOINTMENT: '/randevu',
  
  // Legal pages
  PRIVACY: '/gizlilik',
  TERMS: '/kullanim-sartlari',
  COOKIES: '/cerez-politikasi',
  KVKK: '/kvkk',
  
  // Special pages
  DEMO: '/demo',
  PDF_VIEWER: '/pdf-viewer',
  TEST_TEAM: '/test-team',
  
  // IoT Service
  IOT_SERVICE: '/hizmetler/iot',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  
  // Admin content management
  ADMIN_CONTENT: '/admin/content',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_BACKUP: '/admin/backup',
  ADMIN_REPORTS: '/admin/reports',
  
  // Admin page management
  ADMIN_PAGES: '/admin/pages',
  ADMIN_PAGE_HOME: '/admin/pages/home',
  ADMIN_PAGE_ABOUT: '/admin/pages/about',
  ADMIN_PAGE_SERVICES: '/admin/pages/services',
  ADMIN_PAGE_PRODUCTS: '/admin/pages/products',
  ADMIN_PAGE_CONTACT: '/admin/pages/contact',
  ADMIN_PAGE_BLOG: '/admin/pages/blog',
  ADMIN_PAGE_FAQ: '/admin/pages/faq',
  ADMIN_PAGE_CATALOG: '/admin/pages/catalog',
  ADMIN_PAGE_REFERENCES: '/admin/pages/references',
  ADMIN_PAGE_TESTIMONIALS: '/admin/pages/testimonials',
  
  // Admin settings
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SETTINGS_GENERAL: '/admin/settings/general',
  ADMIN_SETTINGS_SEO: '/admin/settings/seo',
  
  // API routes
  API: {
    // Admin
    ADMIN_AUTH: '/api/admin-auth',
    ADMIN_SYNC: '/api/admin-sync',
    
    // Content
    BLOG: '/api/blog',
    CONTACT: '/api/contact',
    FAQ: '/api/faq',
    HERO_SLIDES: '/api/hero-slides',
    PRODUCTS: '/api/products',
    REFERENCES: '/api/references',
    SERVICES: '/api/services',
    TEAM: '/api/team',
    TESTIMONIALS: '/api/testimonials',
    
    // System
    DATA_KV: '/api/data-kv',
    MEDIA: '/api/media',
    SETTINGS: '/api/settings',
    UPLOAD: '/api/upload',
    UPLOAD_R2: '/api/upload-r2',
    FIX_FEATURES: '/api/fix-features',
  },
} as const;

export type Routes = typeof ROUTES; 