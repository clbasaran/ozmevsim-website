// Application constants
export const APP_NAME = 'Öz Mevsim';
export const APP_DESCRIPTION = 'Öz Mevsim Isı Sistemleri Mühendislik';

// Local storage keys
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'ozmevsim_admin_token',
  USER_PREFERENCES: 'ozmevsim_user_preferences',
  THEME: 'ozmevsim_theme',
  LANGUAGE: 'ozmevsim_language',
  CART: 'ozmevsim_cart',
} as const;

// Cookie names
export const COOKIE_NAMES = {
  ADMIN_AUTH: 'ozmevsim_admin_auth',
  USER_CONSENT: 'ozmevsim_user_consent',
  PREFERENCES: 'ozmevsim_preferences',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// File upload constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: 300,
} as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Status constants
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
  GUEST: 'guest',
} as const;

// Theme constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language constants
export const LANGUAGES = {
  TR: 'tr',
  EN: 'en',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır.',
  NOT_FOUND: 'Aradığınız sayfa bulunamadı.',
  VALIDATION_ERROR: 'Lütfen gerekli alanları doldurun.',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük.',
  INVALID_FILE_TYPE: 'Geçersiz dosya türü.',
  GENERIC_ERROR: 'Beklenmeyen bir hata oluştu.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Başarıyla kaydedildi.',
  UPDATED: 'Başarıyla güncellendi.',
  DELETED: 'Başarıyla silindi.',
  UPLOADED: 'Dosya başarıyla yüklendi.',
  SENT: 'Başarıyla gönderildi.',
  COPIED: 'Panoya kopyalandı.',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
export type CookieName = keyof typeof COOKIE_NAMES;
export type DateFormat = keyof typeof DATE_FORMATS;
export type Status = typeof STATUS[keyof typeof STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type Theme = typeof THEME[keyof typeof THEME];
export type Language = typeof LANGUAGES[keyof typeof LANGUAGES]; 