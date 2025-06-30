import { APP_CONFIG } from './app.config';

export const API_CONFIG = {
  baseURL: APP_CONFIG.api.baseURL,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  ADMIN_LOGIN: '/admin-auth',
  ADMIN_LOGOUT: '/admin-auth/logout',
  ADMIN_VERIFY: '/admin-auth/verify',
  ADMIN_REFRESH: '/admin-auth/refresh',
  
  // Content endpoints
  BLOG: '/blog',
  BLOG_BY_ID: (id: string) => `/blog/${id}`,
  
  CONTACT: '/contact',
  FAQ: '/faq',
  
  HERO_SLIDES: '/hero-slides',
  
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  
  REFERENCES: '/references',
  REFERENCE_BY_ID: (id: string) => `/references/${id}`,
  
  SERVICES: '/services',
  SERVICE_BY_ID: (id: string) => `/services/${id}`,
  
  TEAM: '/team',
  TEAM_BY_ID: (id: string) => `/team/${id}`,
  
  TESTIMONIALS: '/testimonials',
  TESTIMONIAL_BY_ID: (id: string) => `/testimonials/${id}`,
  
  // Media endpoints
  MEDIA: '/media',
  MEDIA_UPLOAD: '/upload',
  MEDIA_UPLOAD_R2: '/upload-r2',
  
  // Settings endpoints
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_SEO: '/settings/seo',
  
  // System endpoints
  DATA_KV: '/data-kv',
  ADMIN_SYNC: '/admin-sync',
  FIX_FEATURES: '/fix-features',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type RequestMethod = typeof REQUEST_METHODS[keyof typeof REQUEST_METHODS]; 