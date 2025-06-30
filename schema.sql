-- Öz Mevsim Website Database Schema
-- Created for ozmevsim-d1 Cloudflare D1 Database

-- 1. Products (Ürünler) Tablosu
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  image_url TEXT,
  category TEXT,
  brand TEXT,
  model TEXT,
  features TEXT, -- JSON string
  specifications TEXT, -- JSON string
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blog Posts Tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'general',
  author TEXT DEFAULT 'Admin',
  publish_date TEXT,
  read_time INTEGER DEFAULT 5,
  featured_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  tags TEXT, -- JSON array as string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. FAQ Tablosu
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Testimonials (Referanslar) Tablosu
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT,
  location TEXT,
  service TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Services (Hizmetler) Tablosu
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'cog',
  features TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact Messages Tablosu
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  replied_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Team Members Tablosu
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  twitter TEXT,
  experience TEXT,
  education TEXT,
  certifications TEXT, -- JSON array
  specializations TEXT, -- JSON array
  location TEXT,
  languages TEXT, -- JSON array
  achievements TEXT, -- JSON array
  years_of_experience INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 8. Portfolio/Projects Tablosu
CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  gallery_images TEXT, -- JSON array as string
  client_name TEXT,
  completion_date DATE,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Site Settings Tablosu
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text', -- text, json, boolean, number
  category TEXT,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Media/Upload Tablosu
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  category TEXT,
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);

-- Başlangıç verilerini ekle
INSERT OR IGNORE INTO site_settings (key, value, type, category, description) VALUES
('site_title', 'Öz Mevsim Isı Sistemleri', 'text', 'general', 'Site başlığı'),
('site_description', 'Kombi, klima ve ısı pompası uzmanı', 'text', 'general', 'Site açıklaması'),
('contact_email', 'info@ozmevsim.com', 'text', 'contact', 'İletişim e-postası'),
('contact_phone', '+90 532 XXX XX XX', 'text', 'contact', 'İletişim telefonu'),
('contact_address', 'İstanbul, Türkiye', 'text', 'contact', 'İletişim adresi'),
('hero_title', 'Konforlu Yaşamın Adresi', 'text', 'homepage', 'Ana sayfa hero başlığı'),
('hero_subtitle', 'Modern ısıtma ve soğutma çözümleri', 'text', 'homepage', 'Ana sayfa hero alt başlığı');

-- References table
CREATE TABLE IF NOT EXISTS references (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  client TEXT NOT NULL,
  location TEXT,
  category TEXT DEFAULT 'Genel',
  completed_date TEXT,
  image TEXT,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  rating INTEGER DEFAULT 5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Hero Slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  background_image TEXT,
  stats TEXT, -- JSON array
  primary_cta_text TEXT,
  primary_cta_href TEXT,
  secondary_cta_text TEXT,
  secondary_cta_href TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

 